import {Args, Command, Flags} from '@oclif/core'
import {loadConfig, validateConfig} from '../helpers/config.js'
import {existsSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {
  getAvailableComponentNames,
  getComponentLibVersion,
  getComponentRealname,
  getComponentURL,
  getLibURL,
  getRegistry,
} from '../helpers/registry.js'
import ora from 'ora'
import React, {ComponentPropsWithoutRef} from 'react'
import {render, Box} from 'ink'
import {SearchBox} from '../components/SearchBox.js'
import {getComponentsInstalled} from '../helpers/path.js'
import {Choice} from '../components/Choice.js'
import {colorize} from '@oclif/core/ux'
import {Registry} from '../const.js'

function Generator() {
  let complete: boolean = false

  function ComponentSelector<T extends {displayName: string; key: string; installed: boolean}>(
    props: Omit<ComponentPropsWithoutRef<typeof SearchBox<T>>, 'helper'>,
  ) {
    return (
      <Box>
        <SearchBox
          helper={'Press Enter to select component.'}
          {...props}
          onSubmit={(value) => {
            complete = true
            props.onSubmit?.(value)
          }}
        />
      </Box>
    )
  }

  return [
    ComponentSelector,
    new Promise<void>((r) => {
      const i = setInterval(() => {
        if (complete) {
          r()
          clearInterval(i)
        }
      }, 100)
    }),
  ] as const
}

function Generator2() {
  let complete = false

  function ForceSelector({onComplete}: {onComplete: (value: 'yes' | 'no') => void}) {
    return (
      <Choice
        question={'You already installed this component. Overwrite?'}
        yes={'Yes, overwrite existing file and install it.'}
        no={'No, cancel the action.'}
        onSubmit={(value) => {
          complete = true
          onComplete(value)
        }}
      />
    )
  }

  return [
    ForceSelector,
    new Promise<void>((r) => {
      const i = setInterval(() => {
        if (complete) {
          r()
          clearInterval(i)
        }
      }, 100)
    }),
  ] as const
}

export default class Add extends Command {
  static override args = {
    name: Args.string({description: 'name of component to install'}),
  }

  static override description = 'Add a component to the project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f', description: 'override the existing file'}),
    config: Flags.string({char: 'p', description: 'path to config'}),
    shared: Flags.string({char: 's', description: 'place for installation of shared.ts'}),
    components: Flags.string({char: 'c', description: 'place for installation of components'}),
  }

  public async run(): Promise<void> {
    let {
      args,
      flags: {force, ...flags},
    } = await this.parse(Add)

    const resolvedConfig = await validateConfig((message: string) => this.log(message), await loadConfig(flags.config))
    const componentFolder = join(process.cwd(), resolvedConfig.paths.components)
    const libFolder = join(process.cwd(), resolvedConfig.paths.lib)
    const sharedFileBeforeResolve = join(libFolder, 'shared@version.tsx')
    if (!existsSync(componentFolder)) {
      await mkdir(componentFolder, {recursive: true})
    }
    if (!existsSync(libFolder)) {
      await mkdir(libFolder, {recursive: true})
    }

    const loadRegistryOra = ora('Fetching registry...').start()
    const unsafeRegistry = await getRegistry()
    if (!unsafeRegistry.ok) {
      loadRegistryOra.fail(unsafeRegistry.message)
      return
    }
    const registry = unsafeRegistry.registry
    const componentNames = await getAvailableComponentNames(registry)
    loadRegistryOra.succeed(`Successfully fetched registry! (${componentNames.length} components)`)
    const componentRealNames = await Promise.all(
      componentNames.map(async (name) => await getComponentRealname(registry, name)),
    )
    const installed = await getComponentsInstalled(componentRealNames, resolvedConfig)
    const searchBoxComponent = componentNames.map((name, index) => ({
      displayName: installed.includes(componentRealNames[index]) ? `${name} (installed)` : name,
      key: name,
      installed: installed.includes(componentRealNames[index]),
    }))

    let name: string | undefined = args.name?.toLowerCase?.()
    let requireForce: boolean =
      !name || !componentNames.includes(name.toLowerCase())
        ? false
        : searchBoxComponent.find(({key}) => key === name)?.installed
          ? !force
          : false

    if (!name || !componentNames.includes(name.toLowerCase())) {
      const [ComponentSelector, waitForComplete] = Generator()

      const inkInstance = render(
        <ComponentSelector
          components={searchBoxComponent}
          initialQuery={args.name}
          onSubmit={(comp) => {
            name = comp.key
            requireForce = comp.installed
            inkInstance.clear()
          }}
        />,
      )
      await waitForComplete
      inkInstance.unmount()
    }

    let quit = false

    if (requireForce) {
      const [ForceSelector, waitForComplete] = Generator2()

      const inkInstance = render(
        <ForceSelector
          onComplete={(value) => {
            force = value === 'yes'
            quit = value === 'no'
            inkInstance.clear()
          }}
        />,
      )
      await waitForComplete
      inkInstance.unmount()
      if (quit) {
        this.log(colorize('redBright', 'Installation canceled by user.'))
        return
      }
    }

    if (!name || !componentNames.includes(name.toLowerCase())) {
      this.error('Component name is not provided, or not selected.')
    }

    const resolvedName: keyof typeof registry.components = name

    const sharedFileOra = ora('Installing required module...').start()
    const requiredVersion = await getComponentLibVersion(registry, resolvedName)
    if (!requiredVersion.ok) {
      sharedFileOra.fail(`Registry error: there is no lib version ${requiredVersion.libVersion}`)
      return
    }
    const sharedFile = sharedFileBeforeResolve.replace('version', requiredVersion.libVersion)
    if (!existsSync(sharedFile)) {
      const sharedFileContentResponse = await fetch(await getLibURL(registry, requiredVersion.libVersion))
      if (!sharedFileContentResponse.ok) {
        sharedFileOra.fail(
          `Error while fetching shared module content: ${sharedFileContentResponse.status} ${sharedFileContentResponse.statusText}`,
        )
        return
      }
      const sharedFileContent = await sharedFileContentResponse.text()
      await writeFile(sharedFile, sharedFileContent)
      sharedFileOra.succeed('Shared module is successfully installed!')
    } else {
      sharedFileOra.succeed('Shared module is already installed!')
    }

    const componentFileOra = ora(`Installing ${name} component...`).start()
    const componentFile = join(componentFolder, registry.components[name].name)
    if (existsSync(componentFile) && !force) {
      componentFileOra.succeed(`Component is already installed! (${componentFile})`)
    } else {
      const componentFileContentResponse = await fetch(await getComponentURL(registry, name))
      if (!componentFileContentResponse.ok) {
        componentFileOra.fail(
          `Error while fetching component file content: ${componentFileContentResponse.status} ${componentFileContentResponse.statusText}`,
        )
        return
      }
      const componentFileContent = (await componentFileContentResponse.text()).replaceAll(
        /import\s+{[^}]*}\s+from\s+"..\/shared"/g,
        (match) => match.replace(/..\/shared/, resolvedConfig.import.lib),
      )
      await writeFile(componentFile, componentFileContent)
      componentFileOra.succeed('Component is successfully installed!')
    }

    this.log('Now you can import the component.')
  }
}

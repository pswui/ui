import {Args, Command, Flags} from '@oclif/core'
import {loadConfig, validateConfig} from '../helpers/config.js'
import {existsSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {getAvailableComponentNames, getComponentURL, getRegistry} from '../helpers/registry.js'
import ora from 'ora'
import React, {ComponentPropsWithoutRef} from 'react'
import {render, Box} from 'ink'
import {SearchBox} from '../components/SearchBox.js'
import {getDirComponentRequiredFiles, checkComponentInstalled} from '../helpers/path.js'
import {Choice} from '../components/Choice.js'
import {colorize} from '@oclif/core/ux'
import {safeFetch} from '../helpers/safeFetcher.js'

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
    branch: Flags.string({char: 'r', description: 'use other branch instead of main'}),
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
    if (!existsSync(componentFolder)) {
      await mkdir(componentFolder, {recursive: true})
    }
    if (!existsSync(libFolder)) {
      await mkdir(libFolder, {recursive: true})
    }

    const loadRegistryOra = ora('Fetching registry...').start()
    if (flags.registry) {
      this.log(`Using ${flags.branch} for branch.`)
    }
    const unsafeRegistry = await getRegistry(flags.branch)
    if (!unsafeRegistry.ok) {
      loadRegistryOra.fail(unsafeRegistry.message)
      return
    }
    const registry = unsafeRegistry.registry
    const componentNames = await getAvailableComponentNames(registry)
    loadRegistryOra.succeed(`Successfully fetched registry! (${componentNames.length} components)`)
    const searchBoxComponent: {displayName: string; key: string; installed: boolean}[] = []
    for await (const name of componentNames) {
      const installed = await checkComponentInstalled(registry.components[name], resolvedConfig)
      searchBoxComponent.push({
        displayName: installed ? `${name} (installed)` : name,
        key: name,
        installed,
      })
    }

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

    const libFileOra = ora('Installing required library...').start()
    let successCount = 0
    for await (const libFile of registry.lib) {
      const filePath = join(libFolder, libFile)
      if (!existsSync(filePath)) {
        const libFileContentResponse = await safeFetch(registry.base + registry.paths.lib.replace('{libName}', libFile))
        if (!libFileContentResponse.ok) {
          libFileOra.fail(libFileContentResponse.message)
          return
        }
        const libFileContent = await libFileContentResponse.response.text()
        await writeFile(filePath, libFileContent)
        successCount++
      }
    }
    if (successCount > 1) {
      libFileOra.succeed('Successfully installed library files!')
    } else {
      libFileOra.succeed('Library files are already installed!')
    }

    const componentFileOra = ora(`Installing ${name} component...`).start()
    const componentObject = registry.components[name]
    if (componentObject.type === 'file') {
      const componentFile = join(componentFolder, registry.components[name].name)
      if (existsSync(componentFile) && !force) {
        componentFileOra.succeed(`Component is already installed! (${componentFile})`)
      } else {
        const componentFileContentResponse = await safeFetch(await getComponentURL(registry, name))
        if (!componentFileContentResponse.ok) {
          componentFileOra.fail(componentFileContentResponse.message)
          return
        }
        const componentFileContent = (await componentFileContentResponse.response.text()).replaceAll(
          /import\s+{[^}]*}\s+from\s+"@pswui-lib"/g,
          (match) => match.replace(/@pswui-lib/, resolvedConfig.import.lib),
        )
        await writeFile(componentFile, componentFileContent)
        componentFileOra.succeed('Component is successfully installed!')
      }
    } else if (componentObject.type === 'dir') {
      const componentDir = join(componentFolder, componentObject.name)
      if (!existsSync(componentDir)) {
        await mkdir(componentDir, {recursive: true})
      }
      const requiredFiles = await getDirComponentRequiredFiles(componentObject, resolvedConfig)
      if (requiredFiles.length === 0 && !force) {
        componentFileOra.succeed(`Component is already installed! (${componentDir})`)
      } else {
        for await (const filename of requiredFiles) {
          const componentFile = join(componentDir, filename)
          if (!existsSync(componentFile) || force) {
            const componentFileContentResponse = await safeFetch(
              await getComponentURL(registry, componentObject.name, filename),
            )
            if (!componentFileContentResponse.ok) {
              componentFileOra.fail(componentFileContentResponse.message)
              return
            }
            const componentFileContent = (await componentFileContentResponse.response.text()).replaceAll(
              /import\s+{[^}]*}\s+from\s+"@pswui-lib"/g,
              (match) => match.replace(/@pswui-lib/, resolvedConfig.import.lib),
            )
            await writeFile(componentFile, componentFileContent)
          }
        }
        componentFileOra.succeed('Component is successfully installed!')
      }
    }

    this.log('Now you can import the component.')
  }
}

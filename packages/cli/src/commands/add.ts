import {Args, Command, Flags} from '@oclif/core'
import {loadConfig, validateConfig} from '../helpers/config.js'
import {existsSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import {join} from 'node:path'
import {getAvailableComponentNames, getComponentURL, getRegistry} from '../helpers/registry.js'
import ora from 'ora'

export default class Add extends Command {
  static override args = {
    name: Args.string({description: 'name of component to install'}),
  }

  static override description = 'Add a component to the project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    force: Flags.boolean({char: 'f', description: 'override the existing file'}),
    // WARNING: forceShared could break your components!
    forceShared: Flags.boolean({char: 'F', description: 'override the existing shared.ts and update it to latest'}),
    config: Flags.string({char: 'p', description: 'path to config'}),
    shared: Flags.string({char: 's', description: 'place for installation of shared.ts'}),
    components: Flags.string({char: 'c', description: 'place for installation of components'}),
  }

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Add)

    if (!args.name) {
      this.error('No component name provided. Please provide name of component you want to be installed.')
    }

    const name = args.name.toLowerCase()

    const resolvedConfig = await validateConfig((message: string) => this.log(message), await loadConfig(flags.config))
    const componentFolder = join(process.cwd(), resolvedConfig.paths.components)
    const sharedFile = join(process.cwd(), resolvedConfig.paths.shared)

    if (!existsSync(componentFolder)) {
      await mkdir(componentFolder, {recursive: true})
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

    if (!componentNames.includes(name)) {
      this.error(`Component with name ${name} does not exists in registry. Please provide correct name.`)
    }

    const sharedFileOra = ora('Installing shared module...').start()
    if (!existsSync(sharedFile) || flags.forceShared) {
      const sharedFileContentResponse = await fetch(registry.shared)
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
    const componentFile = join(componentFolder, registry.components[name])
    if (existsSync(componentFile) && !flags.force) {
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
        (match) => match.replace(/..\/shared/, resolvedConfig.import.shared),
      )
      await writeFile(componentFile, componentFileContent)
      componentFileOra.succeed('Component is successfully installed!')
    }

    this.log('Now you can import the component.')
  }
}

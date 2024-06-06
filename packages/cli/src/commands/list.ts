import {Command, Flags} from '@oclif/core'
import {getAvailableComponentNames, getRegistry, getComponentURL} from '../helpers/registry.js'
import ora from 'ora'
import treeify from 'treeify'
import {CONFIG_DEFAULT_PATH} from '../const.js'
import {loadConfig, validateConfig} from '../helpers/config.js'
import {getComponentsInstalled} from '../helpers/path.js'

export default class List extends Command {
  static override description = 'Prints all available components in registry and components installed in this project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    url: Flags.boolean({char: 'u', description: 'include component file URL'}),
    config: Flags.string({char: 'p', description: 'path to config'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(List)

    const registrySpinner = ora('Fetching registry...')
    const getInstalledSpinner = ora('Getting installed components...')

    const loadedConfig = await validateConfig((message: string) => this.log(message), await loadConfig(flags.config))

    registrySpinner.start()
    const unsafeRegistry = await getRegistry()
    if (!unsafeRegistry.ok) {
      registrySpinner.fail(unsafeRegistry.message)
      return
    }
    const registry = unsafeRegistry.registry
    registrySpinner.succeed(`Fetched ${Object.keys(registry.components).length} components.`)

    const names = await getAvailableComponentNames(registry)

    getInstalledSpinner.start()
    const installedNames = await getComponentsInstalled(names, loadedConfig)
    getInstalledSpinner.succeed(`Got ${installedNames.length} installed components.`)

    let final: Record<string, {URL?: string; installed: 'yes' | 'no'}> = {}
    for (const name of names) {
      const installed = installedNames.includes(name) ? 'yes' : 'no'
      if (flags.url) {
        const url = await getComponentURL(registry, name)
        final = {...final, [name]: {URL: url, installed}}
      } else {
        final = {...final, [name]: {installed}}
      }
    }

    this.log('AVAILABLE COMPONENTS')
    this.log(treeify.asTree(final, true, true))
  }
}

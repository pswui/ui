import {Command, Flags} from '@oclif/core'
import ora from 'ora'
import treeify from 'treeify'

import {loadConfig, validateConfig} from '../helpers/config.js'
import {getComponentsInstalled} from '../helpers/path.js'
import {getAvailableComponentNames, getComponentRealname, getComponentURL, getRegistry} from '../helpers/registry.js'

export default class List extends Command {
  static override description = 'Prints all available components in registry and components installed in this project.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {
    branch: Flags.string({char: 'r', description: 'use other branch instead of main'}),
    config: Flags.string({char: 'p', description: 'path to config'}),
    url: Flags.boolean({char: 'u', description: 'include component file URL'}),
  }

  public async run(): Promise<void> {
    const {flags} = await this.parse(List)

    const registrySpinner = ora('Fetching registry...')
    const getInstalledSpinner = ora('Getting installed components...')

    const loadedConfig = await validateConfig((message: string) => this.log(message), await loadConfig(flags.config))

    registrySpinner.start()
    if (flags.branch) {
      this.log(`Using ${flags.branch} for registry.`)
    }

    const unsafeRegistry = await getRegistry(flags.branch)
    if (!unsafeRegistry.ok) {
      registrySpinner.fail(unsafeRegistry.message)
      return
    }

    const {registry} = unsafeRegistry
    registrySpinner.succeed(`Fetched ${Object.keys(registry.components).length} components.`)

    const names = await getAvailableComponentNames(registry)

    getInstalledSpinner.start()
    const installedNames = await getComponentsInstalled(
      await Promise.all(names.map(async (name) => getComponentRealname(registry, name))),
      loadedConfig,
    )
    getInstalledSpinner.succeed(`Got ${installedNames.length} installed components.`)

    let final: Record<string, {URL?: Record<string, string>; installed: 'no' | 'yes'}> = {}
    for await (const name of names) {
      const componentObject = registry.components[name]
      const installed = installedNames.includes(await getComponentRealname(registry, name)) ? 'yes' : 'no'
      if (flags.url) {
        let url: Record<string, string> = {}

        if (componentObject.type === 'file') {
          url[name] = await getComponentURL(registry, name)
        } else if (componentObject.type === 'dir') {
          for await (const file of componentObject.files) {
            url[file] = await getComponentURL(registry, name, file)
          }
        }
        final = {...final, [name]: {URL: url, installed}}
      } else {
        final = {...final, [name]: {installed}}
      }
    }

    this.log('AVAILABLE COMPONENTS')
    this.log(treeify.asTree(final, true, true))
  }
}

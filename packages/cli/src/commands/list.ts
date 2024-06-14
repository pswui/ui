import {Command, Flags} from '@oclif/core'
import ora from 'ora'
import treeify from 'treeify'

import {loadConfig, validateConfig} from '../helpers/config.js'
import {checkComponentInstalled} from '../helpers/path.js'
import {getComponentURL, getDirComponentURL, getRegistry} from '../helpers/registry.js'

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
    const names = Object.keys(registry.components)

    registrySpinner.succeed(`Fetched ${names.length} components.`)

    let final: Record<string, {URL?: Record<string, string>; installed: 'no' | 'yes'}> = {}
    for await (const name of names) {
      const componentObject = registry.components[name]
      const installed = (await checkComponentInstalled(componentObject, loadedConfig)) ? 'yes' : 'no'
      if (flags.url) {
        let url: Record<string, string> = {}

        if (componentObject.type === 'file') {
          url[name] = await getComponentURL(registry, componentObject)
        } else if (componentObject.type === 'dir') {
          url = Object.fromEntries(await getDirComponentURL(registry, componentObject))
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

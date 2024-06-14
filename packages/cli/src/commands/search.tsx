import {Command, Args, Flags} from '@oclif/core'
import {render} from 'ink'
import {SearchBox} from '../components/SearchBox.js'
import {getRegistry} from '../helpers/registry.js'
import React from 'react'

export default class Search extends Command {
  static override args = {
    query: Args.string({description: 'search query'}),
  }

  static override flags = {
    branch: Flags.string({char: 'r', description: 'use other branch instead of main'}),
  }

  static override description = 'Search components.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {args, flags} = await this.parse(Search)

    if (flags.branch) {
      this.log(`Using ${flags.branch} for registry.`)
    }
    const registryResult = await getRegistry(flags.branch)
    if (!registryResult.ok) {
      this.error(registryResult.message)
    }
    const registry = registryResult.registry
    const componentNames = Object.keys(registry.components)

    await render(
      <SearchBox
        components={componentNames.map((v) => ({key: v, displayName: v}))}
        initialQuery={args.query}
        helper={'Press ESC to quit'}
        onKeyDown={(_, k, app) => k.escape && app.exit()}
      />,
    ).waitUntilExit()
  }
}

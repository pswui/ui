import {Command, Args} from '@oclif/core'
import {render} from 'ink'
import {SearchBox} from '../components/SearchBox.js'
import {getAvailableComponentNames, getRegistry} from '../helpers/registry.js'
import React from 'react'

export default class Search extends Command {
  static override args = {
    query: Args.string({description: 'search query'}),
  }

  static override description = 'Search components.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  public async run(): Promise<void> {
    const {args} = await this.parse(Search)

    const registryResult = await getRegistry()
    if (!registryResult.ok) {
      this.error(registryResult.message)
    }
    const registry = registryResult.registry
    const componentNames = await getAvailableComponentNames(registry)

    await render(
      <SearchBox
        components={componentNames}
        initialQuery={args.query}
        helper={'Press ESC to quit'}
        onKeyDown={(_, k, app) => k.escape && app.exit()}
      />,
    ).waitUntilExit()
  }
}

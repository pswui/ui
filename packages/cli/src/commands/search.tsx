import {Command} from '@oclif/core'
import {render} from 'ink'
import {SearchBox} from '../components/SearchBox.js'
import {getAvailableComponentNames, getRegistry} from '../helpers/registry.js'
import React from 'react'

export default class Search extends Command {
  static override description = 'Search components.'

  static override examples = ['<%= config.bin %> <%= command.id %>']

  static override flags = {}

  public async run(): Promise<void> {
    const registryResult = await getRegistry()
    if (!registryResult.ok) {
      this.error(registryResult.message)
    }
    const registry = registryResult.registry
    const componentNames = await getAvailableComponentNames(registry)

    render(<SearchBox components={componentNames} helper={'Press Ctrl+C to quit'} />)
  }
}

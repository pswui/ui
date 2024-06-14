import {existsSync} from 'node:fs'
import {readdir} from 'node:fs/promises'
import path from 'node:path'

import {ResolvedConfig} from '../const.js'

export async function getComponentsInstalled(components: string[], config: ResolvedConfig) {
  const componentPath = path.join(process.cwd(), config.paths.components)
  if (existsSync(componentPath)) {
    const dir = await readdir(componentPath)
    const dirOnlyContainsComponent = []
    for (const fileName of dir) {
      if (components.includes(fileName)) {
        dirOnlyContainsComponent.push(fileName)
      }
    }

    return dirOnlyContainsComponent
  }

  return []
}

export async function changeExtension(_path: string, extension: string): Promise<string> {
  return path.join(path.dirname(_path), path.basename(_path, path.extname(_path)) + extension)
}

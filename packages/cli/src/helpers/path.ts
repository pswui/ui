import {existsSync} from 'node:fs'
import {readdir} from 'node:fs/promises'
import path from 'node:path'

import {RegistryComponent, ResolvedConfig} from '../const.js'

export async function getComponentsInstalled(components: string[], config: ResolvedConfig) {
  const componentPath = path.join(process.cwd(), config.paths.components)
  if (!existsSync(componentPath)) {
    return []
  }

  const dir = await readdir(componentPath)
  const dirOnlyContainsComponent = []
  for (const fileName of dir) {
    if (components.includes(fileName)) {
      dirOnlyContainsComponent.push(fileName)
    }
  }

  return dirOnlyContainsComponent
}

export async function getDirComponentInstalledFiles<T extends RegistryComponent & {type: 'dir'}>(
  componentObject: T,
  config: ResolvedConfig,
) {
  const componentPath = path.join(process.cwd(), config.paths.components, componentObject.name)
  if (!existsSync(componentPath)) {
    return []
  }

  const dir = await readdir(componentPath)
  const dirOnlyContainsComponentFile = []
  for (const fileName of dir) {
    if (componentObject.files.includes(fileName)) {
      dirOnlyContainsComponentFile.push(fileName)
    }
  }

  return dirOnlyContainsComponentFile
}

export async function checkComponentInstalled(component: RegistryComponent, config: ResolvedConfig): Promise<boolean> {
  const componentDirRoot = path.join(process.cwd(), config.paths.components)
  if (!existsSync(componentDirRoot)) return false

  if (component.type === 'file') {
    const dir = await readdir(componentDirRoot)
    return dir.includes(component.name)
  } else {
    const componentDir = path.join(componentDirRoot, component.name)
    if (!existsSync(componentDir)) return false
    const dir = await readdir(componentDir)
    return component.files.filter((filename) => !dir.includes(filename)).length === 0
  }
}

export async function changeExtension(_path: string, extension: string): Promise<string> {
  return path.join(path.dirname(_path), path.basename(_path, path.extname(_path)) + extension)
}

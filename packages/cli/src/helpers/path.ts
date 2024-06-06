import {ResolvedConfig} from '../const.js'
import {readdir} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {basename, dirname, extname, join} from 'node:path'

export async function getComponentsInstalled(components: string[], config: ResolvedConfig) {
  const componentPath = join(process.cwd(), config.paths.components)
  if (existsSync(componentPath)) {
    const dir = await readdir(componentPath)
    return dir.reduce((prev, current) => (components.includes(current) ? [...prev, current] : prev), [] as string[])
  } else {
    return []
  }
}

export async function changeExtension(path: string, extension: string): Promise<string> {
  return join(dirname(path), basename(path, extname(path)) + extension)
}

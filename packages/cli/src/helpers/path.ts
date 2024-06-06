import {ResolvedConfig} from '../const.js'
import {readdir} from 'node:fs/promises'
import {existsSync} from 'node:fs'
import {join} from 'node:path'

export async function getComponentsInstalled(components: string[], config: ResolvedConfig) {
  const componentPath = join(process.cwd(), config.paths.components)
  if (existsSync(componentPath)) {
    const dir = await readdir(componentPath)
    return dir.reduce((prev, current) => (components.includes(current) ? [...prev, current] : prev), [] as string[])
  } else {
    return []
  }
}

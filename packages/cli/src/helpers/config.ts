import {CONFIG_DEFAULT_PATH, DEFAULT_CONFIG, ResolvedConfig} from '../const.js'
import {configZod} from '../const.js'
import {join} from 'node:path'
import {existsSync} from 'node:fs'

export async function loadConfig(config?: string): Promise<unknown> {
  const configPath = join(process.cwd(), config ?? CONFIG_DEFAULT_PATH)

  if (existsSync(configPath)) {
    return (await import(configPath)).default
  } else {
    return DEFAULT_CONFIG
  }
}

export async function validateConfig(config?: unknown): Promise<ResolvedConfig> {
  return await configZod.parseAsync(config)
}

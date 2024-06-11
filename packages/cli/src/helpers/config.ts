import {CONFIG_DEFAULT_PATH, DEFAULT_CONFIG, ResolvedConfig} from '../const.js'
import {configZod} from '../const.js'
import {join} from 'node:path'
import {existsSync} from 'node:fs'
import {changeExtension} from './path.js'
import {colorize} from '@oclif/core/ux'

export async function loadConfig(config?: string): Promise<unknown> {
  const userConfigPath = config ? join(process.cwd(), config) : null
  const defaultConfigPath = join(process.cwd(), CONFIG_DEFAULT_PATH)
  const cjsConfigPath = join(process.cwd(), await changeExtension(CONFIG_DEFAULT_PATH, '.cjs'))
  const mjsConfigPath = join(process.cwd(), await changeExtension(CONFIG_DEFAULT_PATH, '.mjs'))

  if (userConfigPath) {
    if (existsSync(userConfigPath)) {
      return (await import(userConfigPath)).default
    } else {
      throw new Error(`Error: config ${userConfigPath} not found.`)
    }
  }

  if (existsSync(defaultConfigPath)) {
    return (await import(defaultConfigPath)).default
  }
  if (existsSync(cjsConfigPath)) {
    return (await import(cjsConfigPath)).default
  }
  if (existsSync(mjsConfigPath)) {
    return (await import(mjsConfigPath)).default
  }
  return DEFAULT_CONFIG
}

export async function validateConfig(log: (message: string) => void, config?: unknown): Promise<ResolvedConfig> {
  const parsedConfig: ResolvedConfig = await configZod.parseAsync(config)
  log(colorize('gray', `Install component to: ${join(process.cwd(), parsedConfig.paths.components)}`))
  log(colorize('gray', `Install shared module to: ${join(process.cwd(), parsedConfig.paths.lib)}`))
  log(colorize('gray', `Import shared with: ${parsedConfig.import.lib}`))
  return parsedConfig
}

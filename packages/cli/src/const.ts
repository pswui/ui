import z from 'zod'

export const REGISTRY_URL = 'https://ui.psw.kr/registry.json'
export const CONFIG_DEFAULT_PATH = 'pswui.config.js'

export interface Registry {
  base: string
  lib: Record<string, string>
  components: Record<string, string>
}

export interface Config {
  /**
   * Path that cli will create a file.
   */
  paths?: {
    components?: 'src/pswui/components' | string
    lib?: 'src/pswui/lib' | string
  }
  /**
   * Absolute path that will used for import in component
   */
  import?: {
    lib?: '@pswui-lib' | string
  }
}
export type ResolvedConfig<T = Config> = {
  [k in keyof T]-?: NonNullable<T[k]> extends object ? ResolvedConfig<NonNullable<T[k]>> : T[k]
}

export const DEFAULT_CONFIG = {
  paths: {
    components: 'src/pswui/components',
    lib: 'src/pswui/lib',
  },
  import: {
    lib: '@pswui-lib',
  },
}
export const configZod = z.object({
  paths: z
    .object({
      components: z.string().optional().default(DEFAULT_CONFIG.paths.components),
      lib: z.string().optional().default(DEFAULT_CONFIG.paths.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.paths),
  import: z
    .object({
      lib: z.string().optional().default(DEFAULT_CONFIG.import.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.import),
})

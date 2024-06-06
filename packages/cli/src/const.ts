import z from 'zod'

export const REGISTRY_URL = 'https://ui.psw.kr/registry.json'
export const CONFIG_DEFAULT_PATH = 'pswui.config.js'

export interface Registry {
  base: string
  shared: string
  components: Record<string, string>
}

export interface Config {
  /**
   * Path that cli will create a file.
   */
  paths?: {
    components?: 'src/pswui/components' | string
    shared?: 'src/pswui/shared.ts' | string
  }
  /**
   * Absolute path that will used for import in component
   */
  import?: {
    shared?: '@pswui-shared' | string
  }
}
export type ResolvedConfig<T = Config> = {
  [k in keyof T]-?: NonNullable<T[k]> extends object ? ResolvedConfig<NonNullable<T[k]>> : T[k]
}

export const DEFAULT_CONFIG = {
  paths: {
    components: 'src/pswui/components',
    shared: 'src/pswui/shared.ts',
  },
  import: {
    shared: '@pswui-shared',
  },
}
export const configZod = z.object({
  paths: z
    .object({
      components: z.string().optional().default(DEFAULT_CONFIG.paths.components),
      shared: z.string().optional().default(DEFAULT_CONFIG.paths.shared),
    })
    .optional()
    .default(DEFAULT_CONFIG.paths),
  import: z
    .object({
      shared: z.string().optional().default(DEFAULT_CONFIG.import.shared),
    })
    .optional()
    .default(DEFAULT_CONFIG.import),
})

import {z} from 'zod'

export const REGISTRY_URL = 'https://raw.githubusercontent.com/pswui/ui/main/registry.json'
export const CONFIG_DEFAULT_PATH = 'pswui.config.js'

type RegistryComponent =
  | {
      type: 'file'
      name: string
    }
  | {
      type: 'dir'
      name: string
      files: string[]
    }

export interface Registry {
  base: string
  components: Record<string, RegistryComponent>
  paths: {
    components: string
    lib: string
  }
  lib: string[]
}

export interface Config {
  /**
   * Absolute path that will used for import in component
   */
  import?: {
    lib?: '@pswui-lib' | string
  }
  /**
   * Path that cli will create a file.
   */
  paths?: {
    components?: 'src/pswui/components' | string
    lib?: 'src/pswui/lib.tsx' | string
  }
}
export type ResolvedConfig<T = Config> = {
  [k in keyof T]-?: NonNullable<T[k]> extends object ? ResolvedConfig<NonNullable<T[k]>> : T[k]
}

export const DEFAULT_CONFIG = {
  import: {
    lib: '@pswui-lib',
  },
  paths: {
    components: 'src/pswui/components',
    lib: 'src/pswui/lib.tsx',
  },
}
export const configZod = z.object({
  import: z
    .object({
      lib: z.string().optional().default(DEFAULT_CONFIG.import.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.import),
  paths: z
    .object({
      components: z.string().optional().default(DEFAULT_CONFIG.paths.components),
      lib: z.string().optional().default(DEFAULT_CONFIG.paths.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.paths),
})

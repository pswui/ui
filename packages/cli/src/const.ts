import { z } from "zod";

export const registryURL = (branch: string) =>
  `https://raw.githubusercontent.com/pswui/ui/${branch}/registry.json`;
export const CONFIG_DEFAULT_PATH = "pswui.config.js";

export interface RegistryAsset {
  checksum?: string;
  name: string;
}

export type RawRegistryAsset = string | RegistryAsset;

export type RegistryComponent =
  | {
      files: RegistryAsset[];
      name: string;
      type: "dir";
    }
  | {
      checksum?: string;
      name: string;
      type: "file";
    };

export type RawRegistryComponent =
  | {
      files: RawRegistryAsset[];
      name: string;
      type: "dir";
    }
  | {
      checksum?: string;
      name: string;
      type: "file";
    };

export interface Registry {
  base: string;
  components: Record<string, RegistryComponent>;
  lib: RegistryAsset[];
  paths: {
    components: string;
    lib: string;
  };
}

export interface RawRegistry {
  base: string;
  components: Record<string, RawRegistryComponent>;
  lib: RawRegistryAsset[];
  paths: {
    components: string;
    lib: string;
  };
}

export interface Config {
  /**
   * Absolute path that will used for import in component
   */
  import?: {
    lib?: "@pswui-lib" | string;
  };
  /**
   * Path that cli will create a file.
   */
  paths?: {
    components?: "src/pswui/components" | string;
    lib?: "src/pswui/lib" | string;
  };
}
export type ResolvedConfig<T = Config> = {
  [k in keyof T]-?: NonNullable<T[k]> extends object
    ? ResolvedConfig<NonNullable<T[k]>>
    : T[k];
};

export const DEFAULT_CONFIG = {
  import: {
    lib: "@pswui-lib",
  },
  paths: {
    components: "src/pswui/components",
    lib: "src/pswui/lib",
  },
};
export const configZod = z.object({
  import: z
    .object({
      lib: z.string().optional().default(DEFAULT_CONFIG.import.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.import),
  paths: z
    .object({
      components: z
        .string()
        .optional()
        .default(DEFAULT_CONFIG.paths.components),
      lib: z.string().optional().default(DEFAULT_CONFIG.paths.lib),
    })
    .optional()
    .default(DEFAULT_CONFIG.paths),
});

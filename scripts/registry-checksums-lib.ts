import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

export interface RegistryAsset {
  checksum?: string;
  name: string;
}

export type RawRegistryAsset = string | RegistryAsset;

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

export interface RawRegistry {
  base: string;
  components: Record<string, RawRegistryComponent>;
  lib: RawRegistryAsset[];
  paths: {
    components: string;
    lib: string;
  };
}

export interface RegistryChecksumOptions {
  projectRoot: string;
  readTextFile?: (path: string) => Promise<string>;
}

export function sha256Hex(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function normalizeRegistryAsset(asset: RawRegistryAsset): RegistryAsset {
  return typeof asset === "string" ? { name: asset } : asset;
}

async function readProjectFile(path: string): Promise<string> {
  return readFile(path, "utf8");
}

function withChecksum(name: string, content: string): RegistryAsset {
  return {
    checksum: sha256Hex(content),
    name,
  };
}

export async function regenerateRegistryChecksums(
  registry: RawRegistry,
  { projectRoot, readTextFile = readProjectFile }: RegistryChecksumOptions,
): Promise<RawRegistry> {
  const lib = await Promise.all(
    registry.lib.map(async (asset) => {
      const normalizedAsset = normalizeRegistryAsset(asset);
      const content = await readTextFile(
        resolve(projectRoot, "packages/react/lib", normalizedAsset.name),
      );

      return withChecksum(normalizedAsset.name, content);
    }),
  );

  const components = Object.fromEntries(
    await Promise.all(
      Object.entries(registry.components).map(
        async ([componentKey, component]) => {
          if (component.type === "dir") {
            const files = await Promise.all(
              component.files.map(async (asset) => {
                const normalizedAsset = normalizeRegistryAsset(asset);
                const content = await readTextFile(
                  resolve(
                    projectRoot,
                    "packages/react/components",
                    component.name,
                    normalizedAsset.name,
                  ),
                );

                return withChecksum(normalizedAsset.name, content);
              }),
            );

            return [
              componentKey,
              {
                ...component,
                files,
              },
            ] as const;
          }

          const content = await readTextFile(
            resolve(projectRoot, "packages/react/components", component.name),
          );

          return [
            componentKey,
            {
              ...component,
              checksum: sha256Hex(content),
            },
          ] as const;
        },
      ),
    ),
  );

  return {
    ...registry,
    components,
    lib,
  };
}

export function formatRegistryJson(registry: RawRegistry): string {
  return `${JSON.stringify(registry, null, 2)}\n`;
}

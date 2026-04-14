import { createHash } from "node:crypto";
import {
  type RawRegistry,
  type RawRegistryAsset,
  type Registry,
  type RegistryAsset,
  type RegistryComponent,
  registryURL,
} from "../const.js";
import { safeFetch } from "./safe-fetcher.js";

export function sha256Hex(content: string): string {
  return createHash("sha256").update(content).digest("hex");
}

export function normalizeRegistryAsset(asset: RawRegistryAsset): RegistryAsset {
  return typeof asset === "string" ? { name: asset } : asset;
}

export function normalizeRegistry(rawRegistry: RawRegistry): Registry {
  return {
    ...rawRegistry,
    components: Object.fromEntries(
      Object.entries(rawRegistry.components).map(([name, component]) => [
        name,
        component.type === "dir"
          ? {
              ...component,
              files: component.files.map(normalizeRegistryAsset),
            }
          : component,
      ]),
    ),
    lib: rawRegistry.lib.map(normalizeRegistryAsset),
  };
}

export function verifyRegistryAssetChecksum(
  asset: Pick<RegistryAsset, "checksum" | "name">,
  content: string,
  url: string,
):
  | { ok: true }
  | {
      message: string;
      ok: false;
    } {
  if (!asset.checksum) {
    return { ok: true };
  }

  const checksum = sha256Hex(content);
  if (checksum === asset.checksum) {
    return { ok: true };
  }

  return {
    message: `Checksum verification failed for ${asset.name} from ${url}. Expected ${asset.checksum}, received ${checksum}.`,
    ok: false,
  };
}

export async function getRegistry(
  branch?: string,
): Promise<{ message: string; ok: false } | { ok: true; registry: Registry }> {
  const registryResponse = await safeFetch(registryURL(branch ?? "main"));

  if (registryResponse.ok) {
    const registryJson = normalizeRegistry(
      (await registryResponse.response.json()) as RawRegistry,
    );
    registryJson.base = registryJson.base.replace("{branch}", branch ?? "main");

    return {
      ok: true,
      registry: registryJson,
    };
  }

  return registryResponse;
}

export async function getComponentURL(
  registry: Registry,
  component: { type: "file" } & RegistryComponent,
): Promise<string> {
  return (
    registry.base +
    registry.paths.components.replace("{componentName}", component.name)
  );
}

export async function getDirComponentURL(
  registry: Registry,
  component: { type: "dir" } & RegistryComponent,
  files?: string[],
): Promise<[string, string][]> {
  const base =
    registry.base +
    registry.paths.components.replace("{componentName}", component.name);

  return (files ?? component.files.map(({ name }) => name)).map((filename) => [
    filename,
    `${base}/${filename}`,
  ]);
}

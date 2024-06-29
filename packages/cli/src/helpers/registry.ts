import {
  type Registry,
  type RegistryComponent,
  registryURL,
} from "../const.js";
import { safeFetch } from "./safe-fetcher.js";

export async function getRegistry(
  branch?: string,
): Promise<{ message: string; ok: false } | { ok: true; registry: Registry }> {
  const registryResponse = await safeFetch(registryURL(branch ?? "main"));

  if (registryResponse.ok) {
    const registryJson = (await registryResponse.response.json()) as Registry;
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

  return (files ?? component.files).map((filename) => [
    filename,
    `${base}/${filename}`,
  ]);
}

import {Registry, REGISTRY_URL, RegistryComponent} from '../const.js'
import {safeFetch} from './safeFetcher.js'

export async function getRegistry(
  branch?: string,
): Promise<{message: string; ok: false} | {ok: true; registry: Registry}> {
  const registryResponse = await safeFetch(REGISTRY_URL(branch ?? 'main'))

  if (registryResponse.ok) {
    const registryJson = (await registryResponse.response.json()) as Registry
    registryJson.base = registryJson.base.replace('{branch}', branch ?? 'main')

    return {
      ok: true,
      registry: registryJson,
    }
  }

  return registryResponse
}

export async function getComponentURL(
  registry: Registry,
  component: RegistryComponent & {type: 'file'},
): Promise<string> {
  return registry.base + registry.paths.components.replace('{componentName}', component.name)
}

export async function getDirComponentURL(
  registry: Registry,
  component: RegistryComponent & {type: 'dir'},
): Promise<string[]> {
  const base = registry.base + registry.paths.components.replace('{componentName}', component.name)

  return component.files.map((filename) => base + '/' + filename)
}

import {REGISTRY_URL, Registry} from '../const.js'
import {safeFetch} from './safeFetcher.js'

export async function getRegistry(
  branch?: string,
): Promise<{message: string; ok: false} | {ok: true; registry: Registry}> {
  const registryResponse = await safeFetch(REGISTRY_URL(branch ?? 'main'))

  if (registryResponse.ok) {
    const registryJson = registryResponse.json as Registry
    registryJson.base = registryJson.base.replace('{branch}', branch ?? 'main')

    return {
      ok: true,
      registry: registryJson,
    }
  }

  return registryResponse
}

export async function getAvailableComponentNames(registry: Registry): Promise<string[]> {
  return Object.keys(registry.components)
}

export async function getComponentURL(registry: Registry, componentName: string): Promise<string> {
  return registry.base + registry.paths.components.replace('{componentName}', registry.components[componentName].name)
}

export async function getComponentRealname(
  registry: Registry,
  componentName: keyof Registry['components'],
): Promise<string> {
  return registry.components[componentName].name
}

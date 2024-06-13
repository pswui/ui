import {REGISTRY_URL, Registry} from '../const.js'

export async function getRegistry(REGISTRY_OVERRIDE_URL?: string): Promise<{ok: true; registry: Registry} | {ok: false; message: string}> {
  const registryResponse = await fetch(REGISTRY_OVERRIDE_URL ?? REGISTRY_URL)

  if (registryResponse.ok) {
    return {
      ok: true,
      registry: (await registryResponse.json()) as Registry,
    }
  } else {
    return {
      ok: false,
      message: `Error while fetching registry: ${registryResponse.status} ${registryResponse.statusText}`,
    }
  }
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

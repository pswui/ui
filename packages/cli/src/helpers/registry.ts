import {REGISTRY_URL, Registry} from '../const.js'

export async function getRegistry(): Promise<Registry> {
  return (await (await fetch(REGISTRY_URL)).json()) as Registry
}

export async function getAvailableComponentNames(registry: Registry): Promise<string[]> {
  return Object.keys(registry.components)
}

export async function getComponentURL(registry: Registry, componentName: string): Promise<string> {
  return registry.base.replace('{componentName}', registry.components[componentName])
}

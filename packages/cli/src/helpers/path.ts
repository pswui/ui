import { existsSync } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";

import type { RegistryComponent, ResolvedConfig } from "../const.js";

export async function getDirComponentRequiredFiles<
  T extends { type: "dir" } & RegistryComponent,
>(componentObject: T, config: ResolvedConfig) {
  const componentPath = path.join(
    process.cwd(),
    config.paths.components,
    componentObject.name,
  );
  if (!existsSync(componentPath)) {
    return componentObject.files;
  }

  const dir = await readdir(componentPath);

  return componentObject.files.filter((filename) => !dir.includes(filename));
}

export async function checkComponentInstalled(
  component: RegistryComponent,
  config: ResolvedConfig,
): Promise<boolean> {
  const componentDirRoot = path.join(process.cwd(), config.paths.components);
  if (!existsSync(componentDirRoot)) return false;

  if (component.type === "file") {
    const dir = await readdir(componentDirRoot);
    return dir.includes(component.name);
  }

  const componentDir = path.join(componentDirRoot, component.name);
  if (!existsSync(componentDir)) return false;
  const dir = await readdir(componentDir);
  return (
    component.files.filter((filename) => !dir.includes(filename)).length === 0
  );
}

export async function changeExtension(
  _path: string,
  extension: string,
): Promise<string> {
  return path.join(
    path.dirname(_path),
    path.basename(_path, path.extname(_path)) + extension,
  );
}

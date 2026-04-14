import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  type RawRegistry,
  formatRegistryJson,
  regenerateRegistryChecksums,
} from "./registry-checksums-lib.ts";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const registryPath = resolve(projectRoot, "registry.json");

async function main() {
  const currentRegistryJson = await readFile(registryPath, "utf8");
  const currentRegistry = JSON.parse(currentRegistryJson) as RawRegistry;
  const nextRegistry = await regenerateRegistryChecksums(currentRegistry, {
    projectRoot,
  });
  const nextRegistryJson = formatRegistryJson(nextRegistry);

  if (nextRegistryJson === currentRegistryJson) {
    console.log("registry.json checksums are already up to date.");
    return;
  }

  await writeFile(registryPath, nextRegistryJson, "utf8");
  console.log("Updated registry.json checksums.");
}

await main();

import { writeFile } from "node:fs/promises";
import type { RegistryAsset } from "../const.js";
import { verifyRegistryAssetChecksum } from "./registry.js";
import { safeFetch } from "./safe-fetcher.js";

export async function installRegistryAsset({
  asset,
  destination,
  transform,
  url,
}: {
  asset: Pick<RegistryAsset, "checksum" | "name">;
  destination: string;
  transform?: (content: string) => string;
  url: string;
}): Promise<{ message: string; ok: false } | { ok: true }> {
  const response = await safeFetch(url);
  if (!response.ok) {
    return response;
  }

  const downloadedContent = await response.response.text();
  const verified = verifyRegistryAssetChecksum(asset, downloadedContent, url);
  if (!verified.ok) {
    return verified;
  }

  await writeFile(
    destination,
    transform?.(downloadedContent) ?? downloadedContent,
  );

  return { ok: true };
}

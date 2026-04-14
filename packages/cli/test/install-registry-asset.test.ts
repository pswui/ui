import { afterEach, describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { installRegistryAsset } from "../src/helpers/install-registry-asset.ts";
import { sha256Hex } from "../src/helpers/registry.ts";

const originalFetch = globalThis.fetch;
const tempDirs: string[] = [];

afterEach(async () => {
  globalThis.fetch = originalFetch;
  await Promise.all(
    tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })),
  );
});

describe("installRegistryAsset", () => {
  test("writes transformed content after checksum verification succeeds", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pswui-install-"));
    tempDirs.push(tempDir);

    const downloadedContent = 'import { Slot } from "@pswui-lib";\n';
    globalThis.fetch = async () =>
      new Response(downloadedContent, {
        status: 200,
      });

    const destination = join(tempDir, "Button.tsx");
    const result = await installRegistryAsset({
      asset: {
        checksum: sha256Hex(downloadedContent),
        name: "Button.tsx",
      },
      destination,
      transform: (content) => content.replace("@pswui-lib", "@/lib/pswui"),
      url: "https://example.com/Button.tsx",
    });

    expect(result).toEqual({ ok: true });
    expect(await readFile(destination, "utf8")).toBe(
      'import { Slot } from "@/lib/pswui";\n',
    );
  });

  test("fails without writing when checksum verification fails", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "pswui-install-"));
    tempDirs.push(tempDir);

    globalThis.fetch = async () =>
      new Response("received", {
        status: 200,
      });

    const destination = join(tempDir, "Button.tsx");
    const result = await installRegistryAsset({
      asset: {
        checksum: sha256Hex("expected"),
        name: "Button.tsx",
      },
      destination,
      url: "https://example.com/Button.tsx",
    });

    expect(result).toEqual({
      message: `Checksum verification failed for Button.tsx from https://example.com/Button.tsx. Expected ${sha256Hex("expected")}, received ${sha256Hex("received")}.`,
      ok: false,
    });
    expect(existsSync(destination)).toBe(false);
  });
});

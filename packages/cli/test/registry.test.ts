import { describe, expect, test } from "bun:test";
import type { RawRegistry } from "../src/const.ts";
import {
  getDirComponentURL,
  normalizeRegistry,
  sha256Hex,
  verifyRegistryAssetChecksum,
} from "../src/helpers/registry.ts";

describe("registry helpers", () => {
  test("normalizeRegistry upgrades legacy asset entries", async () => {
    const registry = normalizeRegistry({
      base: "https://example.com/{branch}",
      components: {
        button: {
          checksum: "button-checksum",
          name: "Button.tsx",
          type: "file",
        },
        dialog: {
          files: [
            "index.ts",
            { checksum: "context-checksum", name: "Context.ts" },
          ],
          name: "Dialog",
          type: "dir",
        },
      },
      lib: ["index.ts", { checksum: "slot-checksum", name: "Slot.tsx" }],
      paths: {
        components: "/components/{componentName}",
        lib: "/lib/{libName}",
      },
    } satisfies RawRegistry);

    expect(registry.lib).toEqual([
      { name: "index.ts" },
      { checksum: "slot-checksum", name: "Slot.tsx" },
    ]);

    const dialog = registry.components.dialog;
    expect(dialog.type).toBe("dir");
    if (dialog.type !== "dir") {
      throw new Error("dialog should be a dir component");
    }

    expect(dialog.files).toEqual([
      { name: "index.ts" },
      { checksum: "context-checksum", name: "Context.ts" },
    ]);
    expect(await getDirComponentURL(registry, dialog)).toEqual([
      ["index.ts", "https://example.com/{branch}/components/Dialog/index.ts"],
      [
        "Context.ts",
        "https://example.com/{branch}/components/Dialog/Context.ts",
      ],
    ]);
  });

  test("sha256Hex and verifyRegistryAssetChecksum accept matching content", () => {
    const content = "export const button = true;\n";
    const checksum = sha256Hex(content);

    expect(checksum).toHaveLength(64);
    expect(
      verifyRegistryAssetChecksum(
        { checksum, name: "Button.tsx" },
        content,
        "https://example.com/Button.tsx",
      ),
    ).toEqual({ ok: true });
  });

  test("verifyRegistryAssetChecksum rejects mismatched content", () => {
    expect(
      verifyRegistryAssetChecksum(
        { checksum: sha256Hex("expected"), name: "Button.tsx" },
        "received",
        "https://example.com/Button.tsx",
      ),
    ).toEqual({
      message: `Checksum verification failed for Button.tsx from https://example.com/Button.tsx. Expected ${sha256Hex("expected")}, received ${sha256Hex("received")}.`,
      ok: false,
    });
  });
});

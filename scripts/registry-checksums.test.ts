import { describe, expect, test } from "bun:test";
import {
  type RawRegistry,
  formatRegistryJson,
  regenerateRegistryChecksums,
  sha256Hex,
} from "./registry-checksums-lib.ts";

describe("registry checksum regeneration", () => {
  test("recomputes checksums while preserving registry shape and order", async () => {
    const registry: RawRegistry = {
      base: "https://example.com/{branch}",
      components: {
        button: {
          checksum: "old-button",
          name: "Button.tsx",
          type: "file",
        },
        dialog: {
          files: ["index.ts", { checksum: "old-context", name: "Context.ts" }],
          name: "Dialog",
          type: "dir",
        },
      },
      lib: ["index.ts", { checksum: "old-slot", name: "Slot.tsx" }],
      paths: {
        components: "/packages/react/components/{componentName}",
        lib: "/packages/react/lib/{libName}",
      },
    };

    const files = new Map<string, string>([
      ["/repo/packages/react/lib/index.ts", 'export * from "./Slot";\n'],
      ["/repo/packages/react/lib/Slot.tsx", "export const Slot = true;\n"],
      [
        "/repo/packages/react/components/Button.tsx",
        "export const Button = () => null;\n",
      ],
      [
        "/repo/packages/react/components/Dialog/index.ts",
        'export * from "./Context";\n',
      ],
      [
        "/repo/packages/react/components/Dialog/Context.ts",
        "export const DialogContext = {};\n",
      ],
    ]);

    const regenerated = await regenerateRegistryChecksums(registry, {
      projectRoot: "/repo",
      readTextFile: async (path) => {
        const content = files.get(path);
        if (!content) {
          throw new Error(`Unexpected path: ${path}`);
        }

        return content;
      },
    });

    expect(regenerated.lib).toEqual([
      {
        checksum: sha256Hex('export * from "./Slot";\n'),
        name: "index.ts",
      },
      {
        checksum: sha256Hex("export const Slot = true;\n"),
        name: "Slot.tsx",
      },
    ]);
    expect(Object.keys(regenerated.components)).toEqual(["button", "dialog"]);
    expect(regenerated.components.button).toEqual({
      checksum: sha256Hex("export const Button = () => null;\n"),
      name: "Button.tsx",
      type: "file",
    });
    expect(regenerated.components.dialog).toEqual({
      files: [
        {
          checksum: sha256Hex('export * from "./Context";\n'),
          name: "index.ts",
        },
        {
          checksum: sha256Hex("export const DialogContext = {};\n"),
          name: "Context.ts",
        },
      ],
      name: "Dialog",
      type: "dir",
    });
  });

  test("formats registry output with stable indentation and trailing newline", () => {
    const json = formatRegistryJson({
      base: "https://example.com/{branch}",
      components: {},
      lib: [],
      paths: {
        components: "/components/{componentName}",
        lib: "/lib/{libName}",
      },
    });

    expect(json).toBe(`{
  "base": "https://example.com/{branch}",
  "components": {},
  "lib": [],
  "paths": {
    "components": "/components/{componentName}",
    "lib": "/lib/{libName}"
  }
}
`);
  });
});

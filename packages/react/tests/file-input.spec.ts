import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("file input accepts native file selection and clears custom validity", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("file-input-section");
  const input = section.getByLabel("Project assets");
  const selection = section.getByTestId("file-input-selection");

  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(selection).toHaveText("No files selected");

  const beforeSelection = await input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return {
      customError: target.validity.customError,
      message: target.validationMessage,
      valid: target.validity.valid,
    };
  });

  expect(beforeSelection.customError).toBe(true);
  expect(beforeSelection.valid).toBe(false);
  expect(beforeSelection.message).toContain("Select at least one file");

  await input.setInputFiles([
    {
      name: "brief.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("Brief"),
    },
    {
      name: "hero.png",
      mimeType: "image/png",
      buffer: Buffer.from("Hero"),
    },
  ]);

  await expect(selection).toHaveText("brief.pdf, hero.png");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");

  const afterSelection = await input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return {
      files: Array.from(target.files ?? []).map((file) => file.name),
      valid: target.validity.valid,
    };
  });

  expect(afterSelection.files).toEqual(["brief.pdf", "hero.png"]);
  expect(afterSelection.valid).toBe(true);
});

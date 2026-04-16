import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("datetime input uses native datetime-local behavior and clears custom validity", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("datetime-input-section");
  const input = section.getByLabel("Launch window");
  const value = section.getByTestId("datetime-input-value");

  await expect(input).toHaveAttribute("type", "datetime-local");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(value).toHaveText("No launch window selected");

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
  expect(beforeSelection.message).toContain("Choose a launch date and time");

  await input.fill("2026-05-20T14:30");

  await expect(value).toHaveText("2026-05-20T14:30");
  await expect(input).not.toHaveAttribute("aria-invalid", "true");

  const afterSelection = await input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return {
      customError: target.validity.customError,
      type: target.type,
      valid: target.validity.valid,
      value: target.value,
    };
  });

  expect(afterSelection.customError).toBe(false);
  expect(afterSelection.type).toBe("datetime-local");
  expect(afterSelection.valid).toBe(true);
  expect(afterSelection.value).toBe("2026-05-20T14:30");
});

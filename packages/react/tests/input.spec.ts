import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("input applies custom validity message", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("input-section");
  const input = section.getByLabel("Email input");

  const validation = await input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return {
      customError: target.validity.customError,
      message: target.validationMessage,
    };
  });

  expect(validation.customError).toBe(true);
  expect(validation.message).toContain("Invalid email");
});

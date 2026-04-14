import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("input exposes semantic invalid state and custom validity message", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("input-section");
  const input = section.getByLabel("Email input");

  await expect(input).toHaveAttribute("aria-invalid", "true");

  const validation = await input.evaluate((element) => {
    const target = element as HTMLInputElement;
    return {
      customError: target.validity.customError,
      valid: target.validity.valid,
      message: target.validationMessage,
    };
  });

  expect(validation.customError).toBe(true);
  expect(validation.valid).toBe(false);
  expect(validation.message).toContain("Invalid email");
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("textarea exposes semantic invalid state and custom validity message", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("textarea-section");
  const textarea = section.getByLabel("Feedback textarea");

  await expect(textarea).toHaveAttribute("aria-invalid", "true");

  const validation = await textarea.evaluate((element) => {
    const target = element as HTMLTextAreaElement;
    return {
      customError: target.validity.customError,
      valid: target.validity.valid,
      message: target.validationMessage,
    };
  });

  expect(validation.customError).toBe(true);
  expect(validation.valid).toBe(false);
  expect(validation.message).toContain("Feedback is required");
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("textarea applies custom validity message", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("textarea-section");
  const textarea = section.getByLabel("Feedback textarea");

  const validation = await textarea.evaluate((element) => {
    const target = element as HTMLTextAreaElement;
    return {
      customError: target.validity.customError,
      message: target.validationMessage,
    };
  });

  expect(validation.customError).toBe(true);
  expect(validation.message).toContain("Feedback is required");
});

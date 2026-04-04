import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("form surfaces invalid state through error and input validity", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("form-section");
  await expect(section.getByTestId("form-error")).toHaveText("Required field");
  await expect(section.getByText("Helpful instructions")).toHaveCount(0);

  const hasCustomError = await section
    .getByLabel("Form name")
    .evaluate((element) => (element as HTMLInputElement).validity.customError);

  expect(hasCustomError).toBe(true);
});

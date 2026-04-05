import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("checkbox toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("checkbox-section");
  const control = section.getByTestId("checkbox-control");
  const input = control.locator('input[type="checkbox"]');

  await control.click();

  await expect(input).toBeChecked();
  await expect(section.getByTestId("checkbox-state")).toHaveText("true");
});

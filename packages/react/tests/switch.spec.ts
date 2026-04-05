import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("switch toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("switch-section");
  const control = section.getByTestId("switch-control");
  const input = control.locator('input[type="checkbox"]');

  await control.click();

  await expect(input).toBeChecked();
  await expect(section.getByTestId("switch-state")).toHaveText("true");
});

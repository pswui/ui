import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("switch toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("switch-section");
  const input = section.getByRole("switch", { name: "Enable notifications" });

  await input.click();

  await expect(input).toBeChecked();
  await expect(section.getByTestId("switch-state")).toHaveText("true");
});

test("switch toggles with Space from keyboard focus", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("switch-section");
  const input = section.getByRole("switch", { name: "Enable notifications" });

  await input.focus();
  await expect(input).toBeFocused();

  await page.keyboard.press("Space");

  await expect(input).toBeChecked();
  await expect(section.getByTestId("switch-state")).toHaveText("true");
});

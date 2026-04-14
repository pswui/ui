import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("radio group updates selected value on click", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("radio-group-section");
  const starter = section.getByRole("radio", { name: "Starter" });
  const pro = section.getByRole("radio", { name: "Pro" });

  await expect(starter).toBeChecked();
  await pro.click();

  await expect(pro).toBeChecked();
  await expect(starter).not.toBeChecked();
  await expect(section.getByTestId("radio-group-state")).toHaveText("pro");
});

test("radio group supports arrow-key navigation", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("radio-group-section");
  const starter = section.getByRole("radio", { name: "Starter" });
  const pro = section.getByRole("radio", { name: "Pro" });

  await starter.focus();
  await expect(starter).toBeFocused();

  await page.keyboard.press("ArrowDown");

  await expect(pro).toBeChecked();
  await expect(section.getByTestId("radio-group-state")).toHaveText("pro");
});

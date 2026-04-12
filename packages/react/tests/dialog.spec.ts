import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("dialog opens and closes", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("dialog-section");
  await section.getByRole("button", { name: "Open dialog" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toContainText("Dialog description");

  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).not.toBeVisible();
});

test("dialog closes on Escape", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("dialog-section");
  await section.getByRole("button", { name: "Open dialog" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();

  await page.keyboard.press("Escape");

  await expect(dialog).not.toBeVisible();
});

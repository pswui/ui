import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("dialog opens and closes", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("dialog-section");
  const trigger = section.getByRole("button", { name: "Open dialog" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Dialog title" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog).toHaveAccessibleDescription("Dialog description");

  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(dialog).not.toBeVisible();
});

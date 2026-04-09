import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("drawer opens and closes", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  await section.getByRole("button", { name: "Open drawer" }).click();

  const closeButton = page.getByRole("button", { name: "Close drawer" });

  await expect(closeButton).toBeVisible();
  await closeButton.click();
  await expect(closeButton).not.toBeVisible();
});

test("drawer closes on Escape", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  await section.getByRole("button", { name: "Open drawer" }).click();

  const closeButton = page.getByRole("button", { name: "Close drawer" });

  await expect(closeButton).toBeVisible();
  await closeButton.focus();
  await closeButton.press("Escape");
  await expect(closeButton).not.toBeVisible();
});

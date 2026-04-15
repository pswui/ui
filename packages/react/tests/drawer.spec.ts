import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("drawer exposes dialog semantics and closes from its close button", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  const openButton = section.getByRole("button", { name: "Open drawer" });

  await expect(openButton).toHaveAttribute("aria-haspopup", "dialog");
  await expect(openButton).toHaveAttribute("aria-expanded", "false");

  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Drawer title" });
  const closeButton = dialog.getByRole("button", { name: "Close drawer" });

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute(
    "aria-describedby",
    "drawer-description",
  );
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(openButton).toHaveAttribute("aria-expanded", "true");
  await expect(openButton).toHaveAttribute("aria-controls");
  await expect(closeButton).toBeFocused();

  await closeButton.click();
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
});

test("drawer closes on Escape", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  const openButton = section.getByRole("button", { name: "Open drawer" });

  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Drawer title" });

  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
});

test("drawer closes on outside click", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  const openButton = section.getByRole("button", { name: "Open drawer" });

  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Drawer title" });
  const overlay = dialog.locator("xpath=..");

  await expect(dialog).toBeVisible();
  await overlay.click({ position: { x: 16, y: 16 } });
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
});

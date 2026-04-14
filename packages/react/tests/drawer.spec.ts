import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("drawer exposes dialog semantics and moves focus inside on open", async ({
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
  await section.getByRole("button", { name: "Open drawer" }).click();

  const closeButton = page.getByRole("button", { name: "Close drawer" });

  await expect(closeButton).toBeVisible();
  await closeButton.focus();
  await closeButton.press("Escape");
  await expect(closeButton).not.toBeVisible();
});

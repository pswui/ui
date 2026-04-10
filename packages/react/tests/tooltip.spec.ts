import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("tooltip becomes visible on hover and focus", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("tooltip-section");
  const trigger = section.getByRole("button", { name: "Tooltip trigger" });
  const tooltip = section.locator('[role="tooltip"]');

  await expect(tooltip).toHaveAttribute("aria-hidden", "true");
  await expect(tooltip).toHaveAttribute("hidden", "");
  await expect(section.getByRole("tooltip")).toHaveCount(0);

  await trigger.hover();
  await expect(tooltip).not.toHaveAttribute("hidden", "");
  await expect(tooltip).toHaveAttribute("aria-hidden", "false");
  await expect(section.getByRole("tooltip")).toContainText("Tooltip content");

  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveAttribute("aria-hidden", "true");
  await expect(tooltip).toHaveAttribute("hidden", "");
  await expect(section.getByRole("tooltip")).toHaveCount(0);

  await trigger.focus();
  await expect(tooltip).not.toHaveAttribute("hidden", "");
  await expect(tooltip).toHaveAttribute("aria-hidden", "false");
  await expect(section.getByRole("tooltip")).toContainText("Tooltip content");
});

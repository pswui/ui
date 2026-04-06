import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("tooltip becomes visible on hover and focus", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("tooltip-section");
  const trigger = section.getByRole("button", { name: "Tooltip trigger" });
  const tooltip = section.getByRole("tooltip");

  await expect(tooltip).toHaveCSS("opacity", "0");

  await trigger.hover();
  await expect(tooltip).toHaveCSS("opacity", "1");
  await expect(tooltip).toContainText("Tooltip content");

  await page.mouse.move(0, 0);
  await expect(tooltip).toHaveCSS("opacity", "0");

  await trigger.focus();
  await expect(tooltip).toHaveCSS("opacity", "1");
  await expect(tooltip).toContainText("Tooltip content");
});

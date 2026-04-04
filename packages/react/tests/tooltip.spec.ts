import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("tooltip becomes visible on hover", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("tooltip-section");
  const tooltip = section.getByRole("tooltip");

  await section.getByRole("button", { name: "Tooltip trigger" }).hover();
  await expect(tooltip).toBeVisible();
  await expect(tooltip).toContainText("Tooltip content");
});

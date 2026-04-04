import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("popover opens on trigger and closes on outside click", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("popover-section");
  const content = page.getByText("Popover content");

  await section.getByRole("button", { name: "Open popover" }).click();
  await expect(content).toBeVisible();

  await page.mouse.click(5, 5);
  await expect(content).not.toBeVisible();
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("popover opens on trigger and closes on outside click", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("popover-section");
  const content = page.getByText("Popover content");
  const trigger = section.getByRole("button", { name: "Open popover" });

  await expect(content).toBeHidden();

  await trigger.click();
  await expect(content).toBeVisible();

  await page.mouse.click(5, 5);
  await expect(content).toBeHidden();
});

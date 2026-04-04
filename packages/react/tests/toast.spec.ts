import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("toast renders and can be dismissed", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("toast-section");
  await section.getByRole("button", { name: "Show toast" }).click();

  await expect(page.getByText("Toast title")).toBeVisible();
  await expect(page.getByText("Toast description")).toBeVisible();

  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByText("Toast title")).not.toBeVisible();
});

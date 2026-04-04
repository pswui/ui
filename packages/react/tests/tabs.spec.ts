import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("tabs show default content and switch on click", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("tabs-section");
  await expect(section.getByText("Account content")).toBeVisible();
  await expect(section.getByText("Security content")).toHaveCount(0);

  await section.getByRole("button", { name: "Security" }).click();

  await expect(section.getByText("Account content")).toHaveCount(0);
  await expect(section.getByText("Security content")).toBeVisible();
});

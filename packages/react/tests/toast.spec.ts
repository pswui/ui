import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("toast announces non-error notifications politely and can be dismissed", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("toast-section");
  await section.getByRole("button", { name: "Show toast" }).click();

  const toast = page.getByRole("status").filter({ hasText: "Toast title" });

  await expect(toast).toBeVisible();
  await expect(toast).toContainText("Toast description");
  await expect(toast).toHaveAttribute("aria-live", "polite");
  await expect(toast).toHaveAttribute("aria-atomic", "true");

  await page.getByRole("button", { name: "Close" }).click();
  await expect(toast).not.toBeVisible();
});

test("toast announces error notifications assertively", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("toast-section");
  await section.getByRole("button", { name: "Show error toast" }).click();

  const toast = page
    .getByRole("alert")
    .filter({ hasText: "Error toast title" });

  await expect(toast).toBeVisible();
  await expect(toast).toContainText("Error toast description");
  await expect(toast).toHaveAttribute("aria-live", "assertive");
  await expect(toast).toHaveAttribute("aria-atomic", "true");
});

import { type Page, expect } from "@playwright/test";

export async function gotoHarness(page: Page) {
  await page.goto("/playwright-harness.html");
  await expect(
    page.getByRole("heading", { name: "PSW UI component test page" }),
  ).toBeVisible();
}

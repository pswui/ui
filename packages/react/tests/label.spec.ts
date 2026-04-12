import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("label preserves custom className with variant classes", async ({
  page,
}) => {
  await gotoHarness(page);

  const label = page.getByTestId("label-control");

  await expect(label).toHaveClass(/bg-amber-100/);
  await expect(label).toHaveClass(/flex-row/);
});

test("label click toggles nested checkbox", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("label-section");
  const input = section.getByRole("checkbox", { name: "Label checkbox" });

  await section.getByText("Label text").click();
  await expect(input).toBeChecked();
});

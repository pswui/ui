import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("label click toggles nested checkbox", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("label-section");
  const input = section.getByRole("checkbox", { name: "Label checkbox" });

  await section.getByText("Label text").click();
  await expect(input).toBeChecked();
});

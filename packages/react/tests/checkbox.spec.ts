import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("checkbox toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("checkbox-section");
  const input = section.getByRole("checkbox", { name: "Accept terms" });

  await input.check();

  await expect(input).toBeChecked();
  await expect(section.getByTestId("checkbox-state")).toHaveText("true");
});

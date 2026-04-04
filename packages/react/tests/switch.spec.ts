import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("switch toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("switch-section");
  const input = section.getByRole("checkbox", {
    name: "Enable notifications",
  });

  await input.check();

  await expect(input).toBeChecked();
  await expect(section.getByTestId("switch-state")).toHaveText("true");
});

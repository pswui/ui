import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("checkbox toggles checked state", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("checkbox-section");
  const checkbox = section.getByRole("checkbox", { name: "Accept terms" });

  await checkbox.click();

  await expect(checkbox).toBeChecked();
  await expect(section.getByTestId("checkbox-state")).toHaveText("true");
});

test("checkbox is focusable and toggles from the keyboard", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("checkbox-section");
  const checkbox = section.getByRole("checkbox", { name: "Accept terms" });

  await checkbox.focus();

  await expect(checkbox).toBeFocused();

  await page.keyboard.press("Space");

  await expect(checkbox).toBeChecked();
  await expect(section.getByTestId("checkbox-state")).toHaveText("true");
});

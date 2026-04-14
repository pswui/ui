import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("slider exposes native range semantics and keyboard updates", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("slider-section");
  const slider = section.getByRole("slider", { name: "Volume", exact: true });

  await expect(slider).toHaveValue("35");

  await slider.focus();
  await expect(slider).toBeFocused();

  await page.keyboard.press("ArrowRight");

  await expect(slider).toHaveValue("40");
  await expect(section.getByTestId("slider-value")).toHaveText("40");
  await expect(
    section.getByRole("slider", { name: "Disabled volume slider" }),
  ).toBeDisabled();
});

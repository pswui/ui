import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("select supports keyboard selection in uncontrolled mode", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("select-section");
  const trigger = section.getByRole("button", { name: "Project plan" });

  await trigger.focus();
  await expect(trigger).toBeFocused();

  await page.keyboard.press("ArrowDown");
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");

  await expect(trigger).toHaveText(/Pro/);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(section.getByTestId("select-uncontrolled-state")).toHaveText(
    "pro",
  );
});

test("select supports controlled value changes and disabled states", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("select-section");
  const controlledTrigger = section.getByRole("button", {
    name: "Team region",
  });

  await controlledTrigger.click();
  await expect(controlledTrigger).toHaveAttribute("aria-expanded", "true");

  const disabledOption = page.getByRole("option", { name: "Europe" });
  await expect(disabledOption).toHaveAttribute("aria-disabled", "true");

  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(section.getByTestId("select-controlled-state")).toHaveText(
    "apac",
  );
  await expect(controlledTrigger).toHaveText(/Asia Pacific/);

  await expect(
    section.getByRole("button", { name: "Disabled select" }),
  ).toBeDisabled();
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("popover toggles on trigger and closes on outside click", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("popover-section");
  const content = section.getByText("Popover content");
  const trigger = section.getByRole("button", { name: "Open popover" });

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await trigger.click();
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");

  await page.mouse.click(5, 5);
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("controlled popover ignores trigger toggles and follows the opened prop", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("popover-controlled-section");
  const content = section.getByText("Controlled popover content");
  const trigger = section.getByRole("button", {
    name: "Controlled popover trigger",
  });
  const toggle = section.getByRole("button", {
    name: "Toggle controlled popover",
  });
  const state = section.getByTestId("popover-controlled-state");

  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(state).toHaveText("false");

  await trigger.click();
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(state).toHaveText("false");

  await toggle.click();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(state).toHaveText("true");

  await trigger.click();
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(state).toHaveText("true");

  await page.mouse.click(5, 5);
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(state).toHaveText("true");

  await toggle.click();
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(state).toHaveText("false");
});

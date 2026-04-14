import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("toggle updates pressed state and disabled toggle remains disabled", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("toggle-section");
  const toggle = section.getByRole("button", { name: "Pin item" });

  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();

  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(section.getByTestId("toggle-state")).toHaveText("true");
  await expect(
    section.getByRole("button", { name: "Disabled toggle" }),
  ).toBeDisabled();
});

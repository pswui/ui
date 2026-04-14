import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("button clicks update state and disabled button remains disabled", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("button-section");
  await section.getByRole("button", { name: "Increment" }).click();

  await expect(section.getByTestId("button-count")).toHaveText("1");
  await expect(
    section.getByRole("button", { name: "Disabled action" }),
  ).toBeDisabled();
});

test("asChild anchor keeps link semantics", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("button-section");
  const link = section.getByRole("link", { name: "Button asChild link" });

  await expect(link).toHaveAttribute("href", "#button-as-child-link");
  await expect(
    section.getByRole("button", { name: "Button asChild link" }),
  ).toHaveCount(0);
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("separator exposes orientation semantics and supports decorative mode", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("separator-section");
  const horizontal = section.getByRole("separator", {
    name: "Horizontal separator",
  });
  const vertical = section.getByRole("separator", {
    name: "Vertical separator",
  });

  await expect(horizontal).toBeVisible();
  await expect(horizontal).not.toHaveAttribute("aria-orientation", "vertical");
  await expect(vertical).toBeVisible();
  await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
  await expect(section.getByRole("separator")).toHaveCount(2);

  const decorative = section.getByTestId("decorative-separator");
  await expect(decorative).toHaveAttribute("role", "none");
  await expect(decorative).toHaveAttribute("aria-hidden", "true");
});

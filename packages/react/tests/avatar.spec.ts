import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("avatar shows image content and falls back accessibly on image failure", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("avatar-section");
  const loadedAvatar = section.getByTestId("avatar-image");
  const fallbackAvatar = section.getByTestId("avatar-fallback");

  await expect(loadedAvatar).toHaveAttribute("data-state", "loaded");
  await expect(
    loadedAvatar.getByRole("img", { name: "Taylor Lane" }),
  ).toBeVisible();

  await expect(fallbackAvatar).toHaveAttribute("data-state", "fallback");
  await expect(fallbackAvatar).toHaveAttribute("role", "img");
  await expect(fallbackAvatar).toHaveAttribute("aria-label", "Ada Lovelace");
  await expect(fallbackAvatar.locator("img")).toHaveCount(0);
  await expect(fallbackAvatar).toContainText("AL");
});

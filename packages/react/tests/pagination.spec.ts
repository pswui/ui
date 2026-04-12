import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("pagination exposes accessible navigation semantics and skips disabled actions", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("pagination-section");
  const navigation = section.getByRole("navigation", { name: "Results pages" });

  await expect(navigation).toBeVisible();
  await expect(navigation.locator('[aria-current="page"]')).toHaveText("1");
  await expect(navigation.getByRole("link")).toHaveCount(5);

  const previous = navigation.getByRole("link", { name: "Previous page" });
  await expect(previous).toHaveAttribute("aria-disabled", "true");
  await expect(previous).toHaveAttribute("tabindex", "-1");

  await previous.click({ force: true });
  await expect(section.getByTestId("pagination-last-action")).toHaveText(
    "page:1",
  );

  const ellipsis = section.getByTestId("pagination-ellipsis");
  await expect(ellipsis).toHaveAttribute("aria-hidden", "true");

  await navigation.getByRole("link", { name: "2" }).click();
  await expect(section.getByTestId("pagination-last-action")).toHaveText(
    "page:2",
  );
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("breadcrumb renders semantic navigation and decorative separators", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("breadcrumb-section");
  const nav = section.getByRole("navigation", { name: "Breadcrumb" });

  await expect(nav).toBeVisible();
  await expect(section.getByRole("link", { name: "Home" })).toHaveAttribute(
    "href",
    "/",
  );
  await expect(section.getByRole("link", { name: "Settings" })).toHaveAttribute(
    "href",
    "#settings",
  );
  await expect(section.getByTestId("breadcrumb-current-page")).toHaveAttribute(
    "aria-current",
    "page",
  );

  const separators = section.getByTestId("breadcrumb-separator");
  await expect(separators).toHaveCount(2);
  await expect(separators.first()).toHaveAttribute("role", "presentation");
  await expect(separators.first()).toHaveAttribute("aria-hidden", "true");
});

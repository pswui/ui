import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("badge renders status variants and preserves asChild semantics", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("badge-section");

  await expect(section.getByText("Default")).toBeVisible();
  await expect(section.getByText("Success")).toHaveClass(/bg-green-100/);
  await expect(section.getByText("Warning")).toHaveClass(/text-xs/);
  await expect(section.getByText("Danger")).toHaveClass(/bg-red-100/);

  const linkedBadge = section.getByRole("link", { name: "Linked badge" });
  await expect(linkedBadge).toHaveAttribute("href", /#badge-link$/);
  await expect(linkedBadge).toHaveClass(/inline-flex/);
});

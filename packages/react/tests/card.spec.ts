import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("card renders semantic sections and content", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("card-section");
  const card = section.getByTestId("card-root");

  await expect(card).toHaveJSProperty("tagName", "ARTICLE");
  await expect(card.getByTestId("card-header")).toHaveJSProperty(
    "tagName",
    "HEADER",
  );
  await expect(
    card.getByRole("heading", { level: 3, name: "Design review" }),
  ).toBeVisible();
  await expect(
    card.getByText("Ready for a focused component pass."),
  ).toHaveJSProperty("tagName", "P");
  await expect(card.getByTestId("card-content")).toContainText(
    "Review spacing, contrast, and responsive structure.",
  );
  await expect(card.getByTestId("card-footer")).toHaveJSProperty(
    "tagName",
    "FOOTER",
  );
  await expect(card.getByRole("button", { name: "Open review" })).toBeVisible();
});

import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("card wires its title and description to the article", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("card-section");
  const card = section.getByTestId("card-root");
  const title = card.getByRole("heading", { level: 3, name: "Design review" });
  const description = card.getByText("Ready for a focused component pass.");

  await expect(card).toHaveJSProperty("tagName", "ARTICLE");
  await expect(card.getByTestId("card-header")).toHaveJSProperty(
    "tagName",
    "HEADER",
  );
  await expect(title).toBeVisible();
  await expect(description).toHaveJSProperty("tagName", "P");
  await expect(title).toHaveAttribute("id", /.+/);
  await expect(description).toHaveAttribute("id", /.+/);
  await expect(card.getByTestId("card-content")).toContainText(
    "Review spacing, contrast, and responsive structure.",
  );
  await expect(card.getByTestId("card-footer")).toHaveJSProperty(
    "tagName",
    "FOOTER",
  );
  await expect(card.getByRole("button", { name: "Open review" })).toBeVisible();
  const titleId = await title.getAttribute("id");
  const descriptionId = await description.getAttribute("id");

  expect(titleId).toBeTruthy();
  expect(descriptionId).toBeTruthy();

  if (!titleId || !descriptionId) {
    throw new Error("Card title and description must render stable ids.");
  }

  await expect(card).toHaveAttribute("aria-labelledby", titleId);
  await expect(card).toHaveAttribute("aria-describedby", descriptionId);
});

test("card preserves aria wiring when root and text use asChild", async ({
  page,
}) => {
  await gotoHarness(page);

  const card = page.getByTestId("card-as-child-root");

  await expect(card).toHaveJSProperty("tagName", "SECTION");
  await expect(
    card.getByRole("heading", { level: 4, name: "Linked review" }),
  ).toHaveAttribute("id", "card-as-child-title");
  await expect(
    card.getByText("Custom elements still label the card."),
  ).toHaveAttribute("id", "card-as-child-description");
  await expect(card).toHaveAttribute("aria-labelledby", "card-as-child-title");
  await expect(card).toHaveAttribute(
    "aria-describedby",
    "card-as-child-description",
  );
});

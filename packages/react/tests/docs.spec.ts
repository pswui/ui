import { expect, test } from "@playwright/test";

test("docs navigation reaches the Select page and its preview works", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Build your components in isolation.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Browse Components" }).click();
  await expect(page).toHaveURL(/\/docs\/components\/accordion$/);
  await expect(
    page.getByRole("heading", { name: "Accordion", level: 1 }),
  ).toBeVisible();

  await page.goto("/docs/components/select");
  await expect(page).toHaveURL(/\/docs\/components\/select$/);
  await expect(
    page.getByRole("heading", { name: "Select", level: 1 }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Team region" }).click();
  await page.getByRole("option", { name: "Asia Pacific" }).click();

  await expect(page.getByText("Current value: apac")).toBeVisible();
});

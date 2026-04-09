import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("alert renders semantic structure and supports status variants", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("alert-section");
  const defaultAlert = section.getByTestId("alert-default");
  const successAlert = section.getByTestId("alert-success");

  await expect(defaultAlert).toHaveJSProperty("tagName", "SECTION");
  await expect(defaultAlert).toHaveAttribute("role", "alert");
  await expect(
    defaultAlert.getByRole("heading", { level: 5, name: "Heads up" }),
  ).toBeVisible();
  await expect(
    defaultAlert.getByText(
      "This default alert keeps the content compact and readable.",
    ),
  ).toHaveJSProperty("tagName", "P");

  await expect(successAlert).toHaveAttribute("role", "alert");
  await expect(
    successAlert.getByRole("heading", { level: 5, name: "Changes saved" }),
  ).toBeVisible();
  await expect(successAlert).toContainText(
    "Your profile settings were stored successfully.",
  );
});

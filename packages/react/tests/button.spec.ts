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

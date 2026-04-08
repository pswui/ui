import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("progress exposes determinate and indeterminate state", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("progress-section");
  const determinate = section.getByRole("progressbar", {
    name: "Upload progress",
  });
  const indeterminate = section.getByRole("progressbar", {
    name: "Sync progress",
  });

  await expect(determinate).toHaveAttribute("aria-valuenow", "40");
  await expect(determinate).toHaveAttribute("aria-valuemax", "100");

  await section.getByRole("button", { name: "Set progress to 75" }).click();

  await expect(determinate).toHaveAttribute("aria-valuenow", "75");
  await expect(section.getByTestId("progress-value")).toHaveText("75");
  expect(await indeterminate.getAttribute("aria-valuenow")).toBeNull();
});

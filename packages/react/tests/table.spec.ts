import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("table renders semantic sections, headers, cells, and caption", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("table-section");
  const table = section.getByRole("table", {
    name: "Quarterly revenue by team",
  });

  await expect(table).toHaveJSProperty("tagName", "TABLE");
  await expect(section.getByTestId("table-caption")).toHaveJSProperty(
    "tagName",
    "CAPTION",
  );
  await expect(section.getByTestId("table-header")).toHaveJSProperty(
    "tagName",
    "THEAD",
  );
  await expect(section.getByTestId("table-body")).toHaveJSProperty(
    "tagName",
    "TBODY",
  );
  await expect(section.getByTestId("table-footer")).toHaveJSProperty(
    "tagName",
    "TFOOT",
  );

  await expect(section.getByRole("rowgroup")).toHaveCount(3);
  await expect(
    section.getByRole("columnheader", { name: "Team" }),
  ).toBeVisible();
  await expect(
    section.getByRole("columnheader", { name: "Region" }),
  ).toBeVisible();
  await expect(
    section.getByRole("columnheader", { name: "Revenue" }),
  ).toBeVisible();
  await expect(section.getByRole("cell", { name: "$92K" })).toBeVisible();
  await expect(section.getByRole("cell", { name: "$74K" })).toBeVisible();
  await expect(section.getByRole("cell", { name: "$166K" })).toBeVisible();
  await expect(section.getByRole("row")).toHaveCount(4);
});

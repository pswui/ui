import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("toggle group updates controlled single selection", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("toggle-group-section");
  const group = section.getByRole("toolbar", { name: "Text alignment" });
  const center = group.getByRole("button", { name: "Center" });
  const right = group.getByRole("button", { name: "Right" });

  await expect(center).toHaveAttribute("aria-pressed", "true");
  await expect(right).toHaveAttribute("aria-pressed", "false");

  await right.click();

  await expect(right).toHaveAttribute("aria-pressed", "true");
  await expect(center).toHaveAttribute("aria-pressed", "false");
  await expect(section.getByTestId("toggle-group-single-state")).toHaveText(
    "right",
  );
});

test("toggle group supports uncontrolled multiple selection", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("toggle-group-section");
  const group = section.getByRole("toolbar", { name: "Text format" });
  const bold = group.getByRole("button", { name: "Bold" });
  const italic = group.getByRole("button", { name: "Italic" });

  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await expect(group).toHaveAttribute("aria-orientation", "vertical");

  await italic.click();
  await expect(section.getByTestId("toggle-group-multiple-state")).toHaveText(
    "bold,italic",
  );

  await bold.click();
  await expect(bold).toHaveAttribute("aria-pressed", "false");
  await expect(section.getByTestId("toggle-group-multiple-state")).toHaveText(
    "italic",
  );
});

test("toggle group keeps disabled items non-interactive", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("toggle-group-section");
  const group = section.getByRole("toolbar", { name: "Text alignment" });
  const disabled = group.getByRole("button", { name: "Justify" });

  await expect(disabled).toBeDisabled();
  await disabled.click({ force: true });

  await expect(disabled).toHaveAttribute("aria-pressed", "false");
  await expect(section.getByTestId("toggle-group-single-state")).toHaveText(
    "center",
  );
});

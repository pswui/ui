import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("accordion opens one item at a time and supports collapsing", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("accordion-section");
  const shippingTrigger = section.getByRole("button", { name: "Shipping" });
  const returnsTrigger = section.getByRole("button", { name: "Returns" });

  await expect(shippingTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(returnsTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(section.getByRole("region", { name: "Shipping" })).toBeVisible();
  await expect(section.getByRole("region", { name: "Returns" })).toHaveCount(0);

  await returnsTrigger.click();

  await expect(shippingTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(returnsTrigger).toHaveAttribute("aria-expanded", "true");
  await expect(section.getByRole("region", { name: "Shipping" })).toHaveCount(
    0,
  );
  await expect(section.getByRole("region", { name: "Returns" })).toBeVisible();

  await returnsTrigger.click();

  await expect(returnsTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(section.getByRole("region", { name: "Returns" })).toHaveCount(0);
});

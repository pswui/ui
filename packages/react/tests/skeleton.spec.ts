import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("skeleton renders decorative placeholders with shape and size variants", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("skeleton-section");
  const avatar = section.getByTestId("skeleton-avatar");
  const title = section.getByTestId("skeleton-title");
  const line = section.getByTestId("skeleton-line");
  const shortLine = section.getByTestId("skeleton-short-line");

  await expect(avatar).toBeVisible();
  await expect(title).toBeVisible();
  await expect(line).toBeVisible();
  await expect(shortLine).toBeVisible();

  await expect(avatar).toHaveAttribute("aria-hidden", "true");
  await expect(avatar).toHaveClass(/rounded-full/);
  await expect(title).toHaveClass(/h-6/);
  await expect(title).toHaveClass(/w-48/);
  await expect(line).toHaveClass(/animate-pulse/);
  await expect(shortLine).toHaveClass(/w-2\/3/);

  const avatarBox = await avatar.boundingBox();
  expect(avatarBox?.width).toBeGreaterThan(0);
  expect(avatarBox?.width).toBe(avatarBox?.height);
});

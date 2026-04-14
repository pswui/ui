import { expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

test("scroll area supports focusable vertical and horizontal overflow regions", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("scroll-area-section");
  const vertical = section.getByTestId("scroll-area-vertical");
  const horizontal = section.getByTestId("scroll-area-horizontal");

  await expect(
    section.getByRole("region", { name: "Activity feed" }),
  ).toBeVisible();
  await expect(
    section.getByRole("region", { name: "Timeline lanes" }),
  ).toBeVisible();

  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(vertical).toHaveAttribute("tabindex", "0");

  const verticalMetrics = await vertical.evaluate((node) => {
    const styles = window.getComputedStyle(node);
    node.scrollTop = node.scrollHeight;

    const lastItem = node.querySelector('[data-testid="scroll-area-item-12"]');
    if (!(lastItem instanceof HTMLElement)) {
      return null;
    }

    const nodeRect = node.getBoundingClientRect();
    const lastRect = lastItem.getBoundingClientRect();

    return {
      canScroll: node.scrollHeight > node.clientHeight,
      overflowX: styles.overflowX,
      overflowY: styles.overflowY,
      scrollTop: node.scrollTop,
      lastItemVisible:
        lastRect.top >= nodeRect.top && lastRect.bottom <= nodeRect.bottom,
    };
  });

  expect(verticalMetrics).not.toBeNull();
  expect(verticalMetrics?.canScroll).toBe(true);
  expect(verticalMetrics?.overflowX).toBe("hidden");
  expect(verticalMetrics?.overflowY).toBe("auto");
  expect(verticalMetrics?.scrollTop ?? 0).toBeGreaterThan(0);
  expect(verticalMetrics?.lastItemVisible).toBe(true);

  await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
  await expect(horizontal).toHaveAttribute("tabindex", "0");

  const horizontalMetrics = await horizontal.evaluate((node) => {
    const styles = window.getComputedStyle(node);
    node.scrollLeft = node.scrollWidth;

    const lastLane = node.querySelector(
      '[data-testid="scroll-area-lane-last"]',
    );
    if (!(lastLane instanceof HTMLElement)) {
      return null;
    }

    const nodeRect = node.getBoundingClientRect();
    const laneRect = lastLane.getBoundingClientRect();

    return {
      canScroll: node.scrollWidth > node.clientWidth,
      overflowX: styles.overflowX,
      overflowY: styles.overflowY,
      scrollLeft: node.scrollLeft,
      lastLaneVisible:
        laneRect.left >= nodeRect.left && laneRect.right <= nodeRect.right,
    };
  });

  expect(horizontalMetrics).not.toBeNull();
  expect(horizontalMetrics?.canScroll).toBe(true);
  expect(horizontalMetrics?.overflowX).toBe("auto");
  expect(horizontalMetrics?.overflowY).toBe("hidden");
  expect(horizontalMetrics?.scrollLeft ?? 0).toBeGreaterThan(0);
  expect(horizontalMetrics?.lastLaneVisible).toBe(true);
});

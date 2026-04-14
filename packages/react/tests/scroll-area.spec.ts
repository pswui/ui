import { type Locator, expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

async function readScrollbarState(locator: Locator) {
  return locator.evaluate((node) => {
    const styles = window.getComputedStyle(node);
    const data = {
      overflowX: styles.overflowX,
      overflowY: styles.overflowY,
      scrollLeft: node.scrollLeft,
      scrollTop: node.scrollTop,
      scrollbarWidth: styles.getPropertyValue("scrollbar-width"),
      webkitScrollbarHeight: "",
      webkitScrollbarWidth: "",
    };

    try {
      const pseudoStyles = window.getComputedStyle(node, "::-webkit-scrollbar");
      data.webkitScrollbarHeight = pseudoStyles.height;
      data.webkitScrollbarWidth = pseudoStyles.width;
    } catch {
      // Firefox does not expose WebKit pseudo-element styles.
    }

    return data;
  });
}

async function isTargetVisibleWithinScrollArea(
  scrollArea: Locator,
  selector: string,
) {
  return scrollArea.evaluate((node, currentSelector) => {
    const target = node.querySelector(currentSelector);
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    const nodeRect = node.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return (
      targetRect.top >= nodeRect.top &&
      targetRect.right <= nodeRect.right &&
      targetRect.bottom <= nodeRect.bottom &&
      targetRect.left >= nodeRect.left
    );
  }, selector);
}

async function readThumbTravel(
  scrollAreaRoot: Locator,
  axis: "vertical" | "horizontal",
) {
  return scrollAreaRoot.evaluate((node, currentAxis) => {
    const track = node.querySelector(`[data-scrollbar-track="${currentAxis}"]`);
    const thumb = node.querySelector(`[data-scrollbar-thumb="${currentAxis}"]`);
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) {
      return null;
    }

    const trackRect = track.getBoundingClientRect();
    const thumbRect = thumb.getBoundingClientRect();

    return currentAxis === "vertical"
      ? thumbRect.top - trackRect.top
      : thumbRect.left - trackRect.left;
  }, axis);
}

async function dragThumb(
  scrollAreaRoot: Locator,
  axis: "vertical" | "horizontal",
  delta: number,
) {
  return scrollAreaRoot.evaluate(
    (node, { currentAxis, currentDelta }) => {
      const thumb = node.querySelector(
        `[data-scrollbar-thumb="${currentAxis}"]`,
      );
      if (!(thumb instanceof HTMLElement)) {
        return false;
      }

      const thumbRect = thumb.getBoundingClientRect();
      const startX = thumbRect.left + thumbRect.width / 2;
      const startY = thumbRect.top + thumbRect.height / 2;
      const endX =
        currentAxis === "horizontal" ? startX + currentDelta : startX;
      const endY = currentAxis === "vertical" ? startY + currentDelta : startY;
      const pointerId = currentAxis === "vertical" ? 11 : 12;

      thumb.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          buttons: 1,
          clientX: startX,
          clientY: startY,
          isPrimary: true,
          pointerId,
          pointerType: "mouse",
        }),
      );
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          bubbles: true,
          buttons: 1,
          clientX: endX,
          clientY: endY,
          isPrimary: true,
          pointerId,
          pointerType: "mouse",
        }),
      );
      window.dispatchEvent(
        new PointerEvent("pointerup", {
          bubbles: true,
          buttons: 0,
          clientX: endX,
          clientY: endY,
          isPrimary: true,
          pointerId,
          pointerType: "mouse",
        }),
      );

      return true;
    },
    { currentAxis: axis, currentDelta: delta },
  );
}

test("scroll area hides native scrollbars and keeps custom chrome in sync", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("scroll-area-section");
  const vertical = section.getByTestId("scroll-area-vertical");
  const horizontal = section.getByTestId("scroll-area-horizontal");
  const both = section.getByTestId("scroll-area-both");
  const verticalRoot = vertical.locator("xpath=..");
  const horizontalRoot = horizontal.locator("xpath=..");
  const bothRoot = both.locator("xpath=..");

  await expect(
    section.getByRole("region", { name: "Activity feed" }),
  ).toBeVisible();
  await expect(
    section.getByRole("region", { name: "Timeline lanes" }),
  ).toBeVisible();
  await expect(
    section.getByRole("region", { name: "Delivery board" }),
  ).toBeVisible();

  await expect(vertical).toHaveAttribute("data-orientation", "vertical");
  await expect(horizontal).toHaveAttribute("data-orientation", "horizontal");
  await expect(both).toHaveAttribute("data-orientation", "both");

  await expect(vertical).toHaveAttribute("tabindex", "0");
  await expect(horizontal).toHaveAttribute("tabindex", "0");
  await expect(both).toHaveAttribute("tabindex", "0");

  const verticalTrack = verticalRoot.locator(
    '[data-scrollbar-track="vertical"]',
  );
  const verticalThumb = verticalRoot.locator(
    '[data-scrollbar-thumb="vertical"]',
  );
  const horizontalTrack = horizontalRoot.locator(
    '[data-scrollbar-track="horizontal"]',
  );
  const horizontalThumb = horizontalRoot.locator(
    '[data-scrollbar-thumb="horizontal"]',
  );
  const bothVerticalTrack = bothRoot.locator(
    '[data-scrollbar-track="vertical"]',
  );
  const bothHorizontalTrack = bothRoot.locator(
    '[data-scrollbar-track="horizontal"]',
  );

  await expect(verticalTrack).toBeVisible();
  await expect(verticalThumb).toBeVisible();
  await expect(horizontalTrack).toBeVisible();
  await expect(horizontalThumb).toBeVisible();
  await expect(bothVerticalTrack).toBeVisible();
  await expect(bothHorizontalTrack).toBeVisible();

  const verticalState = await readScrollbarState(vertical);
  expect(verticalState.overflowX).toBe("hidden");
  expect(verticalState.overflowY).toBe("auto");
  expect(verticalState.scrollbarWidth.trim()).toBe("none");
  expect(
    verticalState.webkitScrollbarWidth === "0px" ||
      verticalState.webkitScrollbarHeight === "0px",
  ).toBe(true);

  const horizontalState = await readScrollbarState(horizontal);
  expect(horizontalState.overflowX).toBe("auto");
  expect(horizontalState.overflowY).toBe("hidden");
  expect(horizontalState.scrollbarWidth.trim()).toBe("none");
  expect(
    horizontalState.webkitScrollbarWidth === "0px" ||
      horizontalState.webkitScrollbarHeight === "0px",
  ).toBe(true);

  const initialVerticalThumbTravel = await readThumbTravel(
    verticalRoot,
    "vertical",
  );
  expect(initialVerticalThumbTravel).not.toBeNull();

  await vertical.press("PageDown");

  await expect
    .poll(async () => {
      const state = await readScrollbarState(vertical);
      return state.scrollTop;
    })
    .toBeGreaterThan(0);

  const nextVerticalThumbTravel = await readThumbTravel(
    verticalRoot,
    "vertical",
  );
  expect(nextVerticalThumbTravel).not.toBeNull();
  expect(
    (nextVerticalThumbTravel ?? 0) - (initialVerticalThumbTravel ?? 0),
  ).toBeGreaterThan(0);

  await horizontal.hover();
  await page.mouse.wheel(4000, 0);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(horizontal);
      return state.scrollLeft;
    })
    .toBeGreaterThan(0);

  expect(
    await isTargetVisibleWithinScrollArea(
      horizontal,
      '[data-testid="scroll-area-lane-last"]',
    ),
  ).toBe(true);

  await both.evaluate((node) => {
    node.scrollTo({
      top: node.scrollHeight,
      left: node.scrollWidth,
    });
  });

  const bothState = await readScrollbarState(both);
  expect(bothState.scrollTop).toBeGreaterThan(0);
  expect(bothState.scrollLeft).toBeGreaterThan(0);
  expect(
    await isTargetVisibleWithinScrollArea(
      both,
      '[data-testid="scroll-area-board-card-last"]',
    ),
  ).toBe(true);
});

test("scroll area thumbs support pointer dragging", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("scroll-area-section");
  const vertical = section.getByTestId("scroll-area-vertical");
  const horizontal = section.getByTestId("scroll-area-horizontal");
  const verticalRoot = vertical.locator("xpath=..");
  const horizontalRoot = horizontal.locator("xpath=..");

  expect(await dragThumb(verticalRoot, "vertical", 72)).toBe(true);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(vertical);
      return state.scrollTop;
    })
    .toBeGreaterThan(0);

  expect(await dragThumb(horizontalRoot, "horizontal", 96)).toBe(true);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(horizontal);
      return state.scrollLeft;
    })
    .toBeGreaterThan(0);
});

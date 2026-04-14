import { type Locator, expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

type Axis = "vertical" | "horizontal";

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

async function readScrollbarChrome(scrollAreaRoot: Locator, axis: Axis) {
  return scrollAreaRoot.evaluate((node, currentAxis) => {
    const track = node.querySelector(`[data-scrollbar-track="${currentAxis}"]`);
    const thumb = node.querySelector(`[data-scrollbar-thumb="${currentAxis}"]`);
    if (!(track instanceof HTMLElement) || !(thumb instanceof HTMLElement)) {
      return null;
    }

    const trackStyles = window.getComputedStyle(track);
    const thumbStyles = window.getComputedStyle(thumb);

    return {
      thumbBackgroundColor: thumbStyles.backgroundColor,
      trackBackgroundColor: trackStyles.backgroundColor,
      trackBackgroundImage: trackStyles.backgroundImage,
      trackOpacity: Number.parseFloat(trackStyles.opacity),
    };
  }, axis);
}

function isTransparentColor(color: string) {
  return color === "rgba(0, 0, 0, 0)" || color === "transparent";
}

async function expectScrollbarChromeVisible(
  scrollAreaRoot: Locator,
  axis: Axis,
) {
  await expect
    .poll(
      async () =>
        (await readScrollbarChrome(scrollAreaRoot, axis))?.trackOpacity ?? -1,
    )
    .toBeGreaterThan(0.8);
}

async function expectScrollbarChromeHidden(
  scrollAreaRoot: Locator,
  axis: Axis,
) {
  await expect
    .poll(
      async () =>
        (await readScrollbarChrome(scrollAreaRoot, axis))?.trackOpacity ?? 1,
      { timeout: 2_000 },
    )
    .toBeLessThan(0.1);
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

async function readThumbTravel(scrollAreaRoot: Locator, axis: Axis) {
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

async function dragThumb(scrollAreaRoot: Locator, axis: Axis, delta: number) {
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

test("scroll area renders thumb-only chrome and keeps it in sync", async ({
  page,
  browserName,
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

  await expect(verticalTrack).toHaveCount(1);
  await expect(verticalThumb).toHaveCount(1);
  await expect(horizontalTrack).toHaveCount(1);
  await expect(horizontalThumb).toHaveCount(1);
  await expect(bothVerticalTrack).toHaveCount(1);
  await expect(bothHorizontalTrack).toHaveCount(1);

  const verticalChrome = await readScrollbarChrome(verticalRoot, "vertical");
  const horizontalChrome = await readScrollbarChrome(
    horizontalRoot,
    "horizontal",
  );
  const bothVerticalChrome = await readScrollbarChrome(bothRoot, "vertical");
  const bothHorizontalChrome = await readScrollbarChrome(
    bothRoot,
    "horizontal",
  );

  expect(verticalChrome).not.toBeNull();
  expect(horizontalChrome).not.toBeNull();
  expect(bothVerticalChrome).not.toBeNull();
  expect(bothHorizontalChrome).not.toBeNull();
  expect(isTransparentColor(verticalChrome?.trackBackgroundColor ?? "")).toBe(
    true,
  );
  expect(isTransparentColor(horizontalChrome?.trackBackgroundColor ?? "")).toBe(
    true,
  );
  expect(
    isTransparentColor(bothVerticalChrome?.trackBackgroundColor ?? ""),
  ).toBe(true);
  expect(
    isTransparentColor(bothHorizontalChrome?.trackBackgroundColor ?? ""),
  ).toBe(true);
  expect(verticalChrome?.trackBackgroundImage).toBe("none");
  expect(horizontalChrome?.trackBackgroundImage).toBe("none");
  expect(bothVerticalChrome?.trackBackgroundImage).toBe("none");
  expect(bothHorizontalChrome?.trackBackgroundImage).toBe("none");
  expect(isTransparentColor(verticalChrome?.thumbBackgroundColor ?? "")).toBe(
    false,
  );
  expect(isTransparentColor(horizontalChrome?.thumbBackgroundColor ?? "")).toBe(
    false,
  );

  const verticalState = await readScrollbarState(vertical);
  expect(verticalState.overflowX).toBe("hidden");
  expect(verticalState.overflowY).toBe("auto");
  expect(verticalState.scrollbarWidth.trim()).toBe("none");
  if (browserName === "firefox") {
    expect(verticalState.webkitScrollbarWidth).toBe("");
    expect(verticalState.webkitScrollbarHeight).toBe("");
  } else {
    expect(
      verticalState.webkitScrollbarWidth === "0px" ||
        verticalState.webkitScrollbarHeight === "0px",
    ).toBe(true);
  }

  const horizontalState = await readScrollbarState(horizontal);
  expect(horizontalState.overflowX).toBe("auto");
  expect(horizontalState.overflowY).toBe("hidden");
  expect(horizontalState.scrollbarWidth.trim()).toBe("none");
  if (browserName === "firefox") {
    expect(horizontalState.webkitScrollbarWidth).toBe("");
    expect(horizontalState.webkitScrollbarHeight).toBe("");
  } else {
    expect(
      horizontalState.webkitScrollbarWidth === "0px" ||
        horizontalState.webkitScrollbarHeight === "0px",
    ).toBe(true);
  }

  const initialVerticalThumbTravel = await readThumbTravel(
    verticalRoot,
    "vertical",
  );
  const initialHorizontalThumbTravel = await readThumbTravel(
    horizontalRoot,
    "horizontal",
  );
  expect(initialVerticalThumbTravel).not.toBeNull();
  expect(initialHorizontalThumbTravel).not.toBeNull();

  await vertical.hover();
  await expectScrollbarChromeVisible(verticalRoot, "vertical");
  await horizontal.hover();
  await expectScrollbarChromeVisible(horizontalRoot, "horizontal");
  await expectScrollbarChromeHidden(verticalRoot, "vertical");
  await expectScrollbarChromeHidden(horizontalRoot, "horizontal");

  await vertical.hover();
  await expectScrollbarChromeVisible(verticalRoot, "vertical");
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
  await expectScrollbarChromeVisible(verticalRoot, "vertical");

  await horizontal.hover();
  await expectScrollbarChromeVisible(horizontalRoot, "horizontal");
  await page.mouse.wheel(4000, 0);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(horizontal);
      return state.scrollLeft;
    })
    .toBeGreaterThan(0);

  const nextHorizontalThumbTravel = await readThumbTravel(
    horizontalRoot,
    "horizontal",
  );
  expect(nextHorizontalThumbTravel).not.toBeNull();
  expect(
    (nextHorizontalThumbTravel ?? 0) - (initialHorizontalThumbTravel ?? 0),
  ).toBeGreaterThan(0);

  await both.hover();
  await both.evaluate((node) => {
    node.scrollTo({
      top: node.scrollHeight,
      left: node.scrollWidth,
    });
  });

  const bothState = await readScrollbarState(both);
  expect(bothState.scrollTop).toBeGreaterThan(0);
  expect(bothState.scrollLeft).toBeGreaterThan(0);
  await expectScrollbarChromeVisible(bothRoot, "vertical");
  await expectScrollbarChromeVisible(bothRoot, "horizontal");
  expect(
    await isTargetVisibleWithinScrollArea(
      both,
      '[data-testid="scroll-area-board-card-last"]',
    ),
  ).toBe(true);
});

test("scroll area thumbs support pointer dragging after idle fade", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("scroll-area-section");
  const vertical = section.getByTestId("scroll-area-vertical");
  const horizontal = section.getByTestId("scroll-area-horizontal");
  const verticalRoot = vertical.locator("xpath=..");
  const horizontalRoot = horizontal.locator("xpath=..");

  await expectScrollbarChromeHidden(verticalRoot, "vertical");
  await expectScrollbarChromeHidden(horizontalRoot, "horizontal");

  await vertical.hover();
  await expectScrollbarChromeVisible(verticalRoot, "vertical");
  expect(await dragThumb(verticalRoot, "vertical", 72)).toBe(true);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(vertical);
      return state.scrollTop;
    })
    .toBeGreaterThan(0);

  await horizontal.hover();
  await expectScrollbarChromeVisible(horizontalRoot, "horizontal");
  expect(await dragThumb(horizontalRoot, "horizontal", 96)).toBe(true);

  await expect
    .poll(async () => {
      const state = await readScrollbarState(horizontal);
      return state.scrollLeft;
    })
    .toBeGreaterThan(0);
});

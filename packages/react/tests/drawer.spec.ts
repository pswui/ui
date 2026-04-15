import { type Locator, type Page, expect, test } from "@playwright/test";

import { gotoHarness } from "./helpers";

async function dispatchSyntheticTouchEvent(
  locator: Locator,
  type: "touchend" | "touchmove" | "touchstart",
  point: { x: number; y: number },
) {
  await locator.evaluate(
    (element, { type, point }) => {
      const touchInit = {
        clientX: point.x,
        clientY: point.y,
        identifier: 0,
        pageX: point.x,
        pageY: point.y,
        screenX: point.x,
        screenY: point.y,
        target: element,
      };
      const createTouch = () =>
        (() => {
          try {
            if (typeof Touch === "function") {
              return new Touch(touchInit);
            }
          } catch {}

          return touchInit;
        })();
      const touches = type === "touchend" ? [] : [createTouch()];
      const changedTouches = [createTouch()];

      let event: Event;
      try {
        event =
          typeof TouchEvent === "function"
            ? new TouchEvent(type, {
                bubbles: true,
                cancelable: true,
                changedTouches,
                targetTouches: touches,
                touches,
              })
            : new Event(type, {
                bubbles: true,
                cancelable: true,
              });
      } catch {
        event = new Event(type, {
          bubbles: true,
          cancelable: true,
        });
      }

      if (!("touches" in event)) {
        Object.defineProperties(event, {
          changedTouches: {
            configurable: true,
            value: changedTouches,
          },
          targetTouches: {
            configurable: true,
            value: touches,
          },
          touches: {
            configurable: true,
            value: touches,
          },
        });
      }

      const dispatchTarget = type === "touchstart" ? element : window;
      dispatchTarget.dispatchEvent(event);
    },
    { type, point },
  );
}

async function openScrollableDrawer(page: Page) {
  const section = page.getByTestId("drawer-scroll-section");
  await section
    .getByRole("button", { name: "Open scrollable drawer" })
    .click({ force: true });

  const dialog = page.getByRole("dialog", {
    name: "Scrollable drawer title",
  });
  const closeButton = dialog.getByRole("button", {
    name: "Close scrollable drawer",
  });

  await expect(dialog).toBeVisible();
  await expect(closeButton).toBeFocused();

  return {
    dialog,
    scrollRegion: dialog.getByTestId("drawer-scroll-region"),
  };
}

test("drawer exposes dialog semantics and moves focus inside on open", async ({
  page,
}) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  const openButton = section.getByRole("button", { name: "Open drawer" });

  await expect(openButton).toHaveAttribute("aria-haspopup", "dialog");
  await expect(openButton).toHaveAttribute("aria-expanded", "false");

  await openButton.click();

  const dialog = page.getByRole("dialog", { name: "Drawer title" });
  const closeButton = dialog.getByRole("button", { name: "Close drawer" });

  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute(
    "aria-describedby",
    "drawer-description",
  );
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(openButton).toHaveAttribute("aria-expanded", "true");
  await expect(openButton).toHaveAttribute("aria-controls");

  await expect(closeButton).toBeFocused();
  await closeButton.click();
  await expect(dialog).not.toBeVisible();
  await expect(openButton).toHaveAttribute("aria-expanded", "false");
});

test("drawer closes on Escape", async ({ page }) => {
  await gotoHarness(page);

  const section = page.getByTestId("drawer-section");
  await section.getByRole("button", { name: "Open drawer" }).click();

  const closeButton = page.getByRole("button", { name: "Close drawer" });

  await expect(closeButton).toBeVisible();
  await closeButton.focus();
  await closeButton.press("Escape");
  await expect(closeButton).not.toBeVisible();
});

test.describe("drawer touch interactions", () => {
  test.use({
    hasTouch: true,
    viewport: { width: 390, height: 844 },
  });

  test.beforeEach(async ({ browserName }) => {
    test.skip(
      browserName === "firefox",
      "Firefox does not support the touch emulation used by this regression.",
    );
  });

  test("nested scrollable content does not start a close drag while it can still scroll", async ({
    page,
  }) => {
    await gotoHarness(page);

    const { dialog, scrollRegion } = await openScrollableDrawer(page);

    await dialog.evaluate((element) => {
      element.scrollTop = 0;
    });
    await scrollRegion.evaluate((element) => {
      element.scrollTop = 80;
    });

    const box = await scrollRegion.boundingBox();
    if (!box) {
      throw new Error("Expected drawer scroll region to have a bounding box");
    }

    const x = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await dispatchSyntheticTouchEvent(scrollRegion, "touchstart", {
      x,
      y: startY,
    });
    await dispatchSyntheticTouchEvent(scrollRegion, "touchmove", {
      x,
      y: startY + 140,
    });

    expect(
      await dialog.evaluate(
        (element) => (element as HTMLElement).style.transform,
      ),
    ).toBe("");

    await dispatchSyntheticTouchEvent(scrollRegion, "touchend", {
      x,
      y: startY + 140,
    });

    await expect(dialog).toBeVisible();
  });

  test("drawer starts a close drag with a downward swipe once nested content is already at the top", async ({
    page,
  }) => {
    await gotoHarness(page);

    const { dialog, scrollRegion } = await openScrollableDrawer(page);

    await dialog.evaluate((element) => {
      element.scrollTop = 0;
    });
    await scrollRegion.evaluate((element) => {
      element.scrollTop = 0;
    });

    const box = await scrollRegion.boundingBox();
    if (!box) {
      throw new Error("Expected drawer scroll region to have a bounding box");
    }

    const x = box.x + box.width / 2;
    const startY = box.y + 48;
    const swipeDistance = await dialog.evaluate(
      (element) => element.getBoundingClientRect().height * 0.75,
    );

    await dispatchSyntheticTouchEvent(scrollRegion, "touchstart", {
      x,
      y: startY,
    });
    await dispatchSyntheticTouchEvent(scrollRegion, "touchmove", {
      x,
      y: startY + swipeDistance,
    });

    await expect
      .poll(() =>
        dialog.evaluate((element) => (element as HTMLElement).style.transform),
      )
      .toContain("translateY");

    await dispatchSyntheticTouchEvent(scrollRegion, "touchend", {
      x,
      y: startY + swipeDistance,
    });
  });
});

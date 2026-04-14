import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const TRACK_THICKNESS = 7;
const TRACK_INSET = 4;
const TRACK_CORNER_GAP = 12;
const MIN_THUMB_SIZE = 24;
const SCROLLBAR_IDLE_DELAY = 700;

const [scrollAreaVariant, resolveScrollAreaVariantProps] = vcn({
  base: "overscroll-contain focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-neutral-700 dark:focus-visible:ring-offset-black [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0",
  variants: {
    orientation: {
      vertical: "overflow-y-auto overflow-x-hidden",
      horizontal: "overflow-x-auto overflow-y-hidden",
      both: "overflow-auto",
    },
  },
  defaults: {
    orientation: "vertical",
  },
});

type Orientation = "vertical" | "horizontal" | "both";
type Axis = "vertical" | "horizontal";

type AxisMetrics = {
  contentSize: number;
  maxScroll: number;
  thumbOffset: number;
  thumbSize: number;
  trackSize: number;
  viewportSize: number;
  visible: boolean;
};

type ScrollMetrics = Record<Axis, AxisMetrics>;

type DragState = {
  axis: Axis;
  pointerId: number;
  thumbPointerOffset: number;
};

const emptyAxisMetrics = (): AxisMetrics => ({
  contentSize: 0,
  maxScroll: 0,
  thumbOffset: 0,
  thumbSize: 0,
  trackSize: 0,
  viewportSize: 0,
  visible: false,
});

const emptyScrollMetrics = (): ScrollMetrics => ({
  vertical: emptyAxisMetrics(),
  horizontal: emptyAxisMetrics(),
});

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getAxisMetrics(
  node: HTMLDivElement,
  axis: Axis,
  showOppositeAxis: boolean,
): AxisMetrics {
  const viewportSize =
    axis === "vertical" ? node.clientHeight : node.clientWidth;
  const contentSize =
    axis === "vertical" ? node.scrollHeight : node.scrollWidth;
  const scrollOffset = axis === "vertical" ? node.scrollTop : node.scrollLeft;
  const maxScroll = Math.max(contentSize - viewportSize, 0);
  const trackSize = Math.max(
    viewportSize - TRACK_INSET * 2 - (showOppositeAxis ? TRACK_CORNER_GAP : 0),
    0,
  );
  const visible = maxScroll > 0 && trackSize > 0;

  if (!visible) {
    return {
      contentSize,
      maxScroll,
      thumbOffset: 0,
      thumbSize: 0,
      trackSize,
      viewportSize,
      visible: false,
    };
  }

  const thumbSize = clamp(
    trackSize * (viewportSize / contentSize),
    MIN_THUMB_SIZE,
    trackSize,
  );
  const maxThumbOffset = Math.max(trackSize - thumbSize, 0);
  const thumbOffset =
    maxScroll === 0 ? 0 : (scrollOffset / maxScroll) * maxThumbOffset;

  return {
    contentSize,
    maxScroll,
    thumbOffset,
    thumbSize,
    trackSize,
    viewportSize,
    visible: true,
  };
}

function isAxisEnabled(orientation: Orientation, axis: Axis) {
  if (orientation === "both") return true;
  return orientation === axis;
}

function isAxisMetricsEqual(current: AxisMetrics, next: AxisMetrics) {
  return (
    current.contentSize === next.contentSize &&
    current.maxScroll === next.maxScroll &&
    current.thumbOffset === next.thumbOffset &&
    current.thumbSize === next.thumbSize &&
    current.trackSize === next.trackSize &&
    current.viewportSize === next.viewportSize &&
    current.visible === next.visible
  );
}

function areScrollMetricsEqual(current: ScrollMetrics, next: ScrollMetrics) {
  return (
    isAxisMetricsEqual(current.vertical, next.vertical) &&
    isAxisMetricsEqual(current.horizontal, next.horizontal)
  );
}

interface ScrollAreaProps
  extends VariantProps<typeof scrollAreaVariant>,
    React.ComponentPropsWithoutRef<"div"> {}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveScrollAreaVariantProps(props);
    const { children, tabIndex, ...otherPropsExtracted } = otherPropsCompressed;

    const orientation = (variantProps.orientation ?? "vertical") as Orientation;
    const localRef = React.useRef<HTMLDivElement | null>(null);
    const verticalTrackRef = React.useRef<HTMLDivElement | null>(null);
    const horizontalTrackRef = React.useRef<HTMLDivElement | null>(null);
    const frameRef = React.useRef<number | null>(null);
    const hideChromeTimeoutRef = React.useRef<number | null>(null);
    const metricsRef = React.useRef<ScrollMetrics>(emptyScrollMetrics());
    const dragStateRef = React.useRef<DragState | null>(null);
    const [isChromeVisible, setIsChromeVisible] = React.useState(true);
    const [metrics, setMetrics] =
      React.useState<ScrollMetrics>(emptyScrollMetrics);

    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        localRef.current = node;

        if (typeof ref === "function") {
          ref(node);
          return;
        }

        if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const updateMetrics = React.useCallback(() => {
      const node = localRef.current;
      if (!node) return;

      const verticalEnabled = isAxisEnabled(orientation, "vertical");
      const horizontalEnabled = isAxisEnabled(orientation, "horizontal");
      const hasVerticalOverflow = verticalEnabled
        ? node.scrollHeight > node.clientHeight
        : false;
      const hasHorizontalOverflow = horizontalEnabled
        ? node.scrollWidth > node.clientWidth
        : false;

      const nextMetrics = {
        vertical: verticalEnabled
          ? getAxisMetrics(node, "vertical", hasHorizontalOverflow)
          : emptyAxisMetrics(),
        horizontal: horizontalEnabled
          ? getAxisMetrics(node, "horizontal", hasVerticalOverflow)
          : emptyAxisMetrics(),
      } satisfies ScrollMetrics;

      if (areScrollMetricsEqual(metricsRef.current, nextMetrics)) {
        return;
      }

      metricsRef.current = nextMetrics;
      setMetrics(nextMetrics);
    }, [orientation]);

    const scheduleMetricsUpdate = React.useCallback(() => {
      if (typeof window === "undefined") return;
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        updateMetrics();
      });
    }, [updateMetrics]);

    const clearHideChromeTimeout = React.useCallback(() => {
      if (
        hideChromeTimeoutRef.current === null ||
        typeof window === "undefined"
      )
        return;

      window.clearTimeout(hideChromeTimeoutRef.current);
      hideChromeTimeoutRef.current = null;
    }, []);

    const revealChrome = React.useCallback(() => {
      if (typeof window === "undefined") return;

      setIsChromeVisible(true);
      clearHideChromeTimeout();
      hideChromeTimeoutRef.current = window.setTimeout(() => {
        if (dragStateRef.current) {
          revealChrome();
          return;
        }

        hideChromeTimeoutRef.current = null;
        setIsChromeVisible(false);
      }, SCROLLBAR_IDLE_DELAY);
    }, [clearHideChromeTimeout]);

    useIsomorphicLayoutEffect(() => {
      scheduleMetricsUpdate();
    });

    React.useEffect(() => {
      if (typeof window === "undefined") return;

      revealChrome();

      return () => {
        clearHideChromeTimeout();
      };
    }, [clearHideChromeTimeout, revealChrome]);

    React.useEffect(() => {
      const node = localRef.current;
      if (!node || typeof window === "undefined") return;

      scheduleMetricsUpdate();

      const handleScroll = () => {
        revealChrome();
        scheduleMetricsUpdate();
      };

      const resizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver(() => {
              scheduleMetricsUpdate();
            });
      resizeObserver?.observe(node);

      node.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("resize", scheduleMetricsUpdate);
      window.visualViewport?.addEventListener("resize", scheduleMetricsUpdate);

      return () => {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        clearHideChromeTimeout();
        dragStateRef.current = null;
        resizeObserver?.disconnect();
        node.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", scheduleMetricsUpdate);
        window.visualViewport?.removeEventListener(
          "resize",
          scheduleMetricsUpdate,
        );
      };
    }, [clearHideChromeTimeout, revealChrome, scheduleMetricsUpdate]);

    const updateScrollFromPointer = React.useCallback(
      (axis: Axis, coordinate: number, trackRect: DOMRect) => {
        const node = localRef.current;
        const dragState = dragStateRef.current;
        if (!node || !dragState || dragState.axis !== axis) return;

        revealChrome();

        const axisMetrics = metricsRef.current[axis];
        const maxThumbOffset = Math.max(
          axisMetrics.trackSize - axisMetrics.thumbSize,
          0,
        );
        if (axisMetrics.maxScroll <= 0 || maxThumbOffset <= 0) return;

        const pointerOffset =
          axis === "vertical"
            ? coordinate - trackRect.top
            : coordinate - trackRect.left;
        const thumbOffset = clamp(
          pointerOffset - dragState.thumbPointerOffset,
          0,
          maxThumbOffset,
        );
        const scrollOffset =
          (thumbOffset / maxThumbOffset) * axisMetrics.maxScroll;

        if (axis === "vertical") {
          node.scrollTop = scrollOffset;
        } else {
          node.scrollLeft = scrollOffset;
        }

        scheduleMetricsUpdate();
      },
      [revealChrome, scheduleMetricsUpdate],
    );

    React.useEffect(() => {
      if (typeof window === "undefined") return;

      const handlePointerMove = (event: PointerEvent) => {
        const dragState = dragStateRef.current;
        if (!dragState || dragState.pointerId !== event.pointerId) return;

        const track =
          dragState.axis === "vertical"
            ? verticalTrackRef.current
            : horizontalTrackRef.current;
        if (!track) return;

        revealChrome();
        updateScrollFromPointer(
          dragState.axis,
          dragState.axis === "vertical" ? event.clientY : event.clientX,
          track.getBoundingClientRect(),
        );
      };

      const handlePointerEnd = (event: PointerEvent) => {
        const dragState = dragStateRef.current;
        if (!dragState || dragState.pointerId !== event.pointerId) return;

        dragStateRef.current = null;
        revealChrome();
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerEnd);
      window.addEventListener("pointercancel", handlePointerEnd);

      return () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerEnd);
        window.removeEventListener("pointercancel", handlePointerEnd);
      };
    }, [revealChrome, updateScrollFromPointer]);

    const createTrackPointerDownHandler = React.useCallback(
      (axis: Axis) => (event: React.PointerEvent<HTMLDivElement>) => {
        const axisMetrics = metricsRef.current[axis];
        if (!axisMetrics.visible) return;
        event.preventDefault();
        revealChrome();

        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        const track = event.currentTarget;
        const isThumb = target.dataset.scrollbarThumb === axis;
        const pointerOffset =
          axis === "vertical"
            ? event.clientY - track.getBoundingClientRect().top
            : event.clientX - track.getBoundingClientRect().left;
        const thumbPointerOffset = isThumb
          ? pointerOffset - axisMetrics.thumbOffset
          : axisMetrics.thumbSize / 2;

        dragStateRef.current = {
          axis,
          pointerId: event.pointerId,
          thumbPointerOffset,
        };

        try {
          track.setPointerCapture(event.pointerId);
        } catch {
          // Pointer capture can fail for synthetic events; window listeners cover dragging.
        }
        updateScrollFromPointer(
          axis,
          axis === "vertical" ? event.clientY : event.clientX,
          track.getBoundingClientRect(),
        );
      },
      [revealChrome, updateScrollFromPointer],
    );

    const createTrackPointerMoveHandler = React.useCallback(
      (axis: Axis) => (event: React.PointerEvent<HTMLDivElement>) => {
        const dragState = dragStateRef.current;
        if (!dragState || dragState.axis !== axis) return;
        if (dragState.pointerId !== event.pointerId) return;

        revealChrome();
        updateScrollFromPointer(
          axis,
          axis === "vertical" ? event.clientY : event.clientX,
          event.currentTarget.getBoundingClientRect(),
        );
      },
      [revealChrome, updateScrollFromPointer],
    );

    const createTrackPointerEndHandler = React.useCallback(
      (axis: Axis) => (event: React.PointerEvent<HTMLDivElement>) => {
        const dragState = dragStateRef.current;
        if (!dragState || dragState.axis !== axis) return;
        if (dragState.pointerId !== event.pointerId) return;

        dragStateRef.current = null;
        revealChrome();

        try {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        } catch {
          // Ignore release failures when capture was never established.
        }
      },
      [revealChrome],
    );

    const showVertical = metrics.vertical.visible;
    const showHorizontal = metrics.horizontal.visible;

    return (
      <div
        data-scroll-area-root=""
        className="relative"
        onFocusCapture={revealChrome}
        onPointerDownCapture={revealChrome}
        onPointerEnter={revealChrome}
        onPointerMoveCapture={revealChrome}
        onWheelCapture={revealChrome}
      >
        <div
          ref={setRefs}
          data-orientation={orientation}
          tabIndex={tabIndex ?? 0}
          className={scrollAreaVariant(variantProps)}
          {...otherPropsExtracted}
        >
          {children}
        </div>

        {showVertical ? (
          <div
            aria-hidden="true"
            data-scrollbar-track="vertical"
            data-scrollbar-state={isChromeVisible ? "visible" : "hidden"}
            ref={verticalTrackRef}
            className="absolute z-10 bg-transparent transition-opacity duration-150 ease-out"
            style={{
              bottom: TRACK_INSET + (showHorizontal ? TRACK_CORNER_GAP : 0),
              opacity: isChromeVisible ? 1 : 0,
              pointerEvents: isChromeVisible ? "auto" : "none",
              right: TRACK_INSET,
              top: TRACK_INSET,
              touchAction: "none",
              width: TRACK_THICKNESS,
            }}
            onPointerCancel={createTrackPointerEndHandler("vertical")}
            onPointerDown={createTrackPointerDownHandler("vertical")}
            onPointerMove={createTrackPointerMoveHandler("vertical")}
            onPointerUp={createTrackPointerEndHandler("vertical")}
          >
            <div
              aria-hidden="true"
              data-scrollbar-thumb="vertical"
              className="absolute left-0 right-0 rounded-full bg-neutral-500 dark:bg-neutral-400"
              style={{
                height: metrics.vertical.thumbSize,
                transform: `translateY(${metrics.vertical.thumbOffset}px)`,
              }}
            />
          </div>
        ) : null}

        {showHorizontal ? (
          <div
            aria-hidden="true"
            data-scrollbar-track="horizontal"
            data-scrollbar-state={isChromeVisible ? "visible" : "hidden"}
            ref={horizontalTrackRef}
            className="absolute z-10 bg-transparent transition-opacity duration-150 ease-out"
            style={{
              bottom: TRACK_INSET,
              height: TRACK_THICKNESS,
              left: TRACK_INSET,
              opacity: isChromeVisible ? 1 : 0,
              pointerEvents: isChromeVisible ? "auto" : "none",
              right: TRACK_INSET + (showVertical ? TRACK_CORNER_GAP : 0),
              touchAction: "none",
            }}
            onPointerCancel={createTrackPointerEndHandler("horizontal")}
            onPointerDown={createTrackPointerDownHandler("horizontal")}
            onPointerMove={createTrackPointerMoveHandler("horizontal")}
            onPointerUp={createTrackPointerEndHandler("horizontal")}
          >
            <div
              aria-hidden="true"
              data-scrollbar-thumb="horizontal"
              className="absolute bottom-0 top-0 rounded-full bg-neutral-500 dark:bg-neutral-400"
              style={{
                transform: `translateX(${metrics.horizontal.thumbOffset}px)`,
                width: metrics.horizontal.thumbSize,
              }}
            />
          </div>
        ) : null}
      </div>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };

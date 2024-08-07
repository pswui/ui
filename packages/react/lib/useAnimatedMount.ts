import { type MutableRefObject, useCallback, useEffect, useState } from "react";

function getCalculatedTransitionDuration(
  ref: MutableRefObject<HTMLElement>,
): number {
  let transitionDuration: {
    value: number;
    unit: string;
  } | null;
  if (ref.current.computedStyleMap !== undefined) {
    transitionDuration = ref.current
      .computedStyleMap()
      .get("transition-duration") as { value: number; unit: string };
  } else {
    const style = /(\d+(\.\d+)?)(.+)/.exec(
      window.getComputedStyle(ref.current).transitionDuration,
    );
    if (!style) return 0;
    transitionDuration = {
      value: Number.parseFloat(style[1] ?? "0"),
      unit: style[3] ?? style[2] ?? "s",
    };
  }

  return (
    transitionDuration.value *
    ({
      s: 1000,
      ms: 1,
    }[transitionDuration.unit] ?? 1)
  );
}

/*
 * isMounted: true     isRendered: true         isRendered: false        isMounted: false
 * Component Mount     Component Appear         Component Disappear      Component Unmount
 * v                   v                        v                        v
 * |-|=================|------------------------|======================|-|
 */

function useAnimatedMount(
  visible: boolean,
  ref: MutableRefObject<HTMLElement | null>,
  callbacks?: { onMount: () => void; onUnmount: () => void },
) {
  const [state, setState] = useState<{
    isMounted: boolean;
    isRendered: boolean;
  }>({ isMounted: visible, isRendered: visible });

  const umountCallback = useCallback(() => {
    setState((p) => ({ ...p, isRendered: false }));

    const calculatedTransitionDuration = ref.current
      ? getCalculatedTransitionDuration(ref as MutableRefObject<HTMLElement>)
      : 0;

    setTimeout(() => {
      setState((p) => ({ ...p, isMounted: false }));
      callbacks?.onUnmount?.();
    }, calculatedTransitionDuration);
  }, [ref, callbacks]);

  const mountCallback = useCallback(() => {
    setState((p) => ({ ...p, isMounted: true }));
    callbacks?.onMount?.();
    requestAnimationFrame(function onMount() {
      if (!ref.current) return requestAnimationFrame(onMount);
      setState((p) => ({ ...p, isRendered: true }));
    });
  }, [ref.current, callbacks]);

  useEffect(() => {
    console.log(state);
    if (!visible && state.isRendered) {
      umountCallback();
    } else if (visible && !state.isMounted) {
      mountCallback();
    }
  }, [state, visible, mountCallback, umountCallback]);

  return state;
}

export { getCalculatedTransitionDuration, useAnimatedMount };

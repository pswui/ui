import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Merges the react props.
 * Basically childProps will override parentProps.
 * But if it is a event handler, style, or className, it will be merged.
 *
 * @param parentProps - The parent props.
 * @param childProps - The child props.
 * @returns The merged props.
 */
function mergeReactProps(
  parentProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const parentPropValue = parentProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (
        childPropValue &&
        parentPropValue &&
        typeof childPropValue === "function" &&
        typeof parentPropValue === "function"
      ) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue?.(...args);
          parentPropValue?.(...args);
        };
      } else if (parentPropValue) {
        overrideProps[propName] = parentPropValue;
      }
    } else if (
      propName === "style" &&
      typeof parentPropValue === "object" &&
      typeof childPropValue === "object"
    ) {
      overrideProps[propName] = { ...parentPropValue, ...childPropValue };
    } else if (
      propName === "className" &&
      typeof parentPropValue === "string" &&
      typeof childPropValue === "string"
    ) {
      overrideProps[propName] = twMerge(parentPropValue, childPropValue);
    }
  }

  return { ...parentProps, ...overrideProps };
}

/**
 * Takes an array of refs, and returns a single ref.
 *
 * @param refs - The array of refs.
 * @returns The single ref.
 */
function combinedRef<I>(refs: React.Ref<I | null>[]) {
  return (instance: I | null) => {
    for (const ref of refs) {
      if (ref instanceof Function) {
        ref(instance);
      } else if (ref) {
        (ref as React.MutableRefObject<I | null>).current = instance;
      }
    }
  };
}

interface SlotProps {
  children?: React.ReactNode;
}
export const Slot = React.forwardRef<
  HTMLElement,
  SlotProps & Record<string, unknown>
>((props, ref) => {
  const { children, ...slotProps } = props;
  const { asChild: _1, ...safeSlotProps } = slotProps;
  if (!React.isValidElement(children)) {
    console.warn(`given children "${children}" is not valid for asChild`);
    return null;
  }
  return React.cloneElement(children, {
    ...mergeReactProps(
      safeSlotProps,
      children.props as Record<string, unknown>,
    ),
    ref: combinedRef([
      ref,
      (children as unknown as { ref: React.Ref<HTMLElement> }).ref,
    ]),
  } as never);
});

export interface AsChild {
  asChild?: boolean;
}

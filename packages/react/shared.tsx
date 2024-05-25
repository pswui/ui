import React from "react";
import { twMerge } from "tailwind-merge";

/**
 * Takes a string, and returns boolean if it is "true" or "false".
 * Otherwise, returns the string.
 *
 * @example
 * ```
 * type BooleanString = BooleanString<"true" | "false" | "other">
 * // BooleanString = true | false | "other" = boolean | "other"
 * ```
 */
type BooleanString<T extends string> = T extends "true"
  ? true
  : T extends "false"
    ? false
    : T;

/**
 * A type that represents a variant object.
 *
 * @example
 * ```
 * const variant: VariantType = {
 *   opened: {
 *     true: "opacity-100",
 *     false: "opacity-0",
 *   }
 *   size: {
 *     sm: "small",
 *     md: "medium",
 *     lg: "large",
 *   },
 *   color: {
 *     red: "#ff0000",
 *     green: "#00ff00",
 *     blue: "#0000ff",
 *   },
 * }
 * ```
 */
type VariantType = Record<string, Record<string, string>>;

/**
 * Takes VariantType, and returns a type that represents the variant object.
 *
 * @example
 * ```
 * const kvs: VariantKV<VariantType> = {
 *   opened: true  // BooleanString<"true" | "false"> = boolean;
 *   size: "sm"    // BooleanString<"sm" | "md" | "lg"> = "sm" | "md" | "lg";
 *   color: "red"  // BooleanString<"red" | "green" | "blue"> = "red" | "green" | "blue";
 * }
 * ```
 */
type VariantKV<V extends VariantType> = {
  [VariantKey in keyof V]: BooleanString<keyof V[VariantKey] & string>;
};

/**
 * Takes VariantType, and returns a type that represents the preset object.
 *
 * @example
 * ```
 * const presets: PresetType<VariantType> = {
 *   preset1: {
 *     opened: true,
 *     size: "sm",
 *     color: "red",
 *   },
 *   preset2: {
 *     opened: false,
 *     size: "md",
 *     color: "green",
 *     className: "transition-opacity",
 *   },
 * }
 * ```
 */
type PresetType<V extends VariantType> = {
  [PresetName: string]: Partial<VariantKV<V>> & { className?: string };
};

/**
 * A utility function to provide variants and presets to the component
 *
 * @param config - Variant Configuration
 * @returns function (variantProps) -> class name,
 * @returns function (anyProps) -> [variantProps, otherProps]
 */
export function vcn<V extends VariantType>(param: {
  base?: string | undefined;
  variants: V;
  defaults: VariantKV<V>;
  presets?: undefined;
}): [
  (
    variantProps: Partial<VariantKV<V>> & {
      className?: string;
    }
  ) => string,
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve
  ) => [
    Partial<VariantKV<V>> & {
      className?: string;
    },
    Omit<AnyPropBeforeResolve, keyof Partial<VariantKV<V>> | "className">,
  ],
];
export function vcn<V extends VariantType, P extends PresetType<V>>(param: {
  base?: string | undefined;
  variants: V /* VariantType */;
  defaults: VariantKV<V>;
  presets: P;
}): [
  (
    variantProps: Partial<VariantKV<V>> & {
      className?: string;
      preset?: keyof P;
    }
  ) => string,
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve
  ) => [
    Partial<VariantKV<V>> & {
      className?: string;
      preset?: keyof P;
    },
    Omit<
      AnyPropBeforeResolve,
      keyof Partial<VariantKV<V>> | "preset" | "className"
    >,
  ],
];
export function vcn<
  V extends VariantType,
  P extends PresetType<V> | undefined,
>({
  base,
  variants,
  defaults,
  presets,
}: {
  base?: string | undefined;
  variants: V;
  defaults: VariantKV<V>;
  presets?: P;
}) {
  return [
    /**
     * Takes any props (including className), and returns the class name.
     * If there is no variant specified in props, then it will fallback to preset, and then default.
     *
     * @param variantProps - The variant props including className.
     * @returns The class name.
     */
    ({
      className,
      preset,
      ...variantProps
    }: { className?: string; preset?: keyof P } & Partial<VariantKV<V>>) => {
      const currentPreset: P[keyof P] | null =
        presets && preset ? (presets as NonNullable<P>)[preset] ?? null : null;
      const presetVariantKeys: (keyof V)[] = Object.keys(currentPreset ?? {});
      return twMerge(
        base,
        ...(
          Object.entries(defaults) as [keyof V, keyof V[keyof V]][]
        ).map<string>(
          ([variantKey, defaultValue]) =>
            variants[variantKey][
              (variantProps as unknown as Partial<VariantKV<V>>)[variantKey] ??
                (!!currentPreset && presetVariantKeys.includes(variantKey)
                  ? (currentPreset as Partial<VariantKV<V>>)[variantKey] ??
                    defaultValue
                  : defaultValue)
            ]
        ),
        (currentPreset as Partial<VariantKV<V>> | null)?.className, // preset's classname comes after user's variant props? huh..
        className
      );
    },
    /**
     * Takes any props, parse variant props and other props.
     * If `options.excludeA` is true, then it will parse `A` as "other" props.
     * Otherwise, it will parse A as variant props.
     *
     * @param anyProps - Any props that have passed to the component.
     * @returns [variantProps, otherProps]
     */
    <AnyPropBeforeResolve extends Record<string, any>>(
      anyProps: AnyPropBeforeResolve
    ) => {
      const variantKeys = Object.keys(variants) as (keyof V)[];

      return Object.entries(anyProps).reduce(
        ([variantProps, otherProps], [key, value]) => {
          if (
            variantKeys.includes(key) ||
            key === "className" ||
            key === "preset"
          ) {
            return [{ ...variantProps, [key]: value }, otherProps];
          }
          return [variantProps, { ...otherProps, [key]: value }];
        },
        [{}, {}]
      ) as [
        Partial<VariantKV<V>> & {
          className?: string;
          preset?: keyof P;
        },
        Omit<
          typeof anyProps,
          keyof Partial<VariantKV<V>> | "preset" | "className"
        >,
      ];
    },
  ];
}

/**
 * Extract the props type from return value of `vcn` function.
 *
 * @example
 * ```
 * const [variantProps, otherProps] = vcn({ ... })
 * interface Props
 *   extends VariantProps<typeof variantProps>, OtherProps { ... }
 *
 * function Component(props: Props) {
 *   ...
 * }
 * ```
 */
export type VariantProps<F extends (props: any) => string> = F extends (
  props: infer P
) => string
  ? P
  : never;

function mergeReactProps(
  parentProps: Record<string, any>,
  childProps: Record<string, any>
) {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const parentPropValue = parentProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (childPropValue && parentPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue?.(...args);
          parentPropValue?.(...args);
        };
      } else if (parentPropValue) {
        overrideProps[propName] = parentPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...parentPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = twMerge(parentPropValue, childPropValue);
    }
  }

  return { ...parentProps, ...overrideProps };
}

function combinedRef<I>(refs: React.Ref<I | null>[]) {
  return (instance: I | null) =>
    refs.forEach((ref) => {
      if (ref instanceof Function) {
        ref(instance);
      } else if (!!ref) {
        (ref as React.MutableRefObject<I | null>).current = instance;
      }
    });
}

interface SlotProps {
  children?: React.ReactNode;
}
export const Slot = React.forwardRef<any, SlotProps>((props, ref) => {
  const { children, ...slotProps } = props;
  if (!React.isValidElement(children)) {
    return null;
  }
  return React.cloneElement(children, {
    ...mergeReactProps(slotProps, children.props),
    ref: combinedRef([ref, (children as any).ref]),
  } as any);
});

export interface AsChild {
  asChild?: boolean;
}

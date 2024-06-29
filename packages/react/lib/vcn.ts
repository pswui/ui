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
 * Used for safely casting `Object.entries(<VariantKV>)`
 */
type VariantKVEntry<V extends VariantType> = [keyof V, BooleanString<keyof V[keyof V] & string>][]

/**
 * Takes VariantKV as parameter, return className string.
 *
 * @example
 * vcn({
 *   /* ... *\/
 *   dynamics: [
 *     ({ a, b }) => {
 *       return a === "something" ? "asdf" : b
 *     },
 *   ]
 * })
 */
type DynamicClassName<V extends VariantType> = (variantProps: VariantKV<V>) => string

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
 * @param param - Variant Configuration
 * @returns function (variantProps) -> class name,
 * @returns function (anyProps) -> [variantProps, otherProps]
 */
export function vcn<V extends VariantType>(param: {
  /**
   * First definition: without presets
   */
  base?: string | undefined;
  variants: V;
  dynamics?: DynamicClassName<V>[];
  defaults: VariantKV<V>;
  presets?: undefined;
}): [
  /**
   * Variant Props -> Class Name
   */
  (
    variantProps: Partial<VariantKV<V>> & {
      className?: string;
    },
  ) => string,
  /**
   * Any Props -> Variant Props, Other Props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve,
  ) => [
    Partial<VariantKV<V>> & {
      className?: string;
    },
    Omit<AnyPropBeforeResolve, keyof Partial<VariantKV<V>> | "className">,
  ],
];
export function vcn<V extends VariantType, P extends PresetType<V>>(param: {
  /**
   * Second definition: with presets
   */
  base?: string | undefined;
  variants: V /* VariantType */;
  dynamics?: DynamicClassName<V>[];
  defaults: VariantKV<V>;
  presets: P;
}): [
  /**
   * Variant Props -> Class Name
   */
  (
    variantProps: Partial<VariantKV<V>> & {
      className?: string;
      preset?: keyof P;
    },
  ) => string,
  /**
   * Any Props -> Variant Props, Other Props
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve,
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
  dynamics = [],
  defaults,
  presets,
}: {
  base?: string | undefined;
  variants: V;
  dynamics?: DynamicClassName<V>[];
  defaults: VariantKV<V>;
  presets?: P;
}) {
  /**
   * --Internal utility function--
   * After transforming props to final version (which means "after overriding default, preset, and variant props sent via component props")
   * It turns final version of variant props to className
   */
  function __transformer__(final: VariantKV<V>, dynamics: string[], propClassName?: string): string {
    const classNames: string[] = [];

    for (const [variantName, variantKey] of (Object.entries(final) as VariantKVEntry<V>)) {
      classNames.push(variants[variantName][variantKey.toString()])
    }

    return twMerge(
      base,
      ...classNames,
      ...dynamics,
      propClassName,
    )
  }

  return [
    /**
     * Takes any props (including className), and returns the class name.
     * If there is no variant specified in props, then it will fallback to preset, and then default.
     *
     * @param variantProps - The variant props including className.
     * @returns The class name.
     */
    (
      variantProps: { className?: string; preset?: keyof P } & Partial<
        VariantKV<V>
      >,
    ) => {
      const { className, preset, ..._otherVariantProps } = variantProps;

      // Omit<Partial<VariantKV<V>> & { className; preset; }, className | preset> = Partial<VariantKV<V>> (safe to cast)
      // We all know `keyof V` = string, right? (but typescript says it's not, so.. attacking typescript with unknown lol)
      const otherVariantProps = _otherVariantProps as unknown as Partial<VariantKV<V>>

      const kv: VariantKV<V> = { ...defaults };

      // Preset Processing
      if (presets && preset && preset in presets) {
        for (const [variantName, variantKey] of (Object.entries((presets)[preset]) as VariantKVEntry<V>)) {
          kv[variantName] = variantKey
        }
      }

      // VariantProps Processing
      for (const [variantName, variantKey] of (Object.entries(otherVariantProps) as VariantKVEntry<V>)) {
        kv[variantName] = variantKey
      }

      // make dynamics result
      const dynamicClasses: string[] = []
      for (const dynamicFunction of dynamics) {
        dynamicClasses.push(dynamicFunction(kv));
      }

      return __transformer__(kv, dynamicClasses, className);
    },

    /**
     * Takes any props, parse variant props and other props.
     * If `options.excludeA` is true, then it will parse `A` as "other" props.
     * Otherwise, it will parse A as variant props.
     *
     * @param anyProps - Any props that have passed to the component.
     * @returns [variantProps, otherProps]
     */
    <AnyPropBeforeResolve extends Record<string, unknown>>(
      anyProps: AnyPropBeforeResolve,
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
        [{}, {}],
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
export type VariantProps<F extends (props: Record<string, unknown>) => string> =
  F extends (props: infer P) => string ? { [key in keyof P]: P[key] } : never;

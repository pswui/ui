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
 *   },
 * }
 * ```
 */
type PresetType<V extends VariantType, N extends string> = {
  [PresetName in N]: Partial<VariantKV<V>> & { className?: string };
};

export function vcn<V extends VariantType, N extends string>({
  base,
  variants,
  defaults,
  presets,
}: {
  base?: string | undefined;
  variants: V /* VariantType */;
  defaults: VariantKV<V>;
  presets?: PresetType<V, N>;
}): [
  (
    variantProps: Partial<VariantKV<V>> & {
      className?: string;
      preset?: N | undefined;
    }
  ) => string,
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve,
  ) => [
    Partial<VariantKV<V>>,
    Omit<
      AnyPropBeforeResolve,
      keyof Partial<VariantKV<V>> | "preset" | "className"
    >,
  ],
] {
  return [
    /**
     * Takes any props (including className), and returns the class name.
     * If there is no variant specified in props, then it will fallback to preset, and then default.
     *
     * @param variantProps - The variant props including className.
     * @returns The class name.
     */
    ({ className, preset, ...variantProps }) => {
      const currentPreset: PresetType<V, N>[N] | null =
        presets && preset ? presets[preset] ?? null : null;
      const presetVariantKeys: (keyof V)[] = Object.keys(currentPreset ?? {});
      return twMerge(
        base,
        ...(
          Object.entries(defaults) as [keyof V, keyof V[keyof V]][]
        ).map<string>(
          ([variantKey, defaultValue]) =>
            variants[variantKey][
              (variantProps as unknown as Partial<VariantKV<V>>)[variantKey] ??
                (currentPreset !== null &&
                presetVariantKeys.includes(variantKey)
                  ? currentPreset[variantKey] ?? defaultValue
                  : defaultValue)
            ]
        ),
        currentPreset?.className,
        className
      );
    },
    /**
     * Takes any props, parse variant props and other props.
     * If `options.excludeA` is true, then it will parse `A` as "other" props.
     * Otherwise, it will parse A as variant props.
     *
     * @param anyProps - Any props that have passed to the component.
     * @param options - Options.
     * @returns [variantProps, otherProps]
     */
    (anyProps, options = {}) => {
      const variantKeys = Object.keys(variants) as (keyof V)[];

      return Object.entries(anyProps).reduce(
        ([variantProps, otherProps], [key, value]) => {
          if (
            variantKeys.includes(key) ||
            (!options.excludeClassName && key === "className") ||
            (!options.excludePreset && key === "preset")
          ) {
            return [{ ...variantProps, [key]: value }, otherProps];
          }
          return [variantProps, { ...otherProps, [key]: value }];
        },
        [{}, {}]
      ) as [
        Partial<VariantKV<V>> & { className?: string },
        Omit<typeof anyProps, keyof Partial<VariantKV<V>> | "className">,
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

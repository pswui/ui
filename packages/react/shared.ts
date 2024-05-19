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
 * type VariantKV = VariantKV<VariantType>
 * // VariantKV = {
 * //   opened: BooleanString<"true" | "false"> = boolean;
 * //   size: BooleanString<"sm" | "md" | "lg">;
 * //   color: BooleanString<"red" | "green" | "blue">;
 * // }
 * ```
 */
type VariantKV<V extends VariantType> = {
  [VariantKey in keyof V]: BooleanString<keyof V[VariantKey] & string>;
};

export function vcn<V extends VariantType>({
  base,
  variants,
  defaults,
}: {
  base?: string | undefined;
  variants: V /* VariantType */;
  defaults: VariantKV<V>;
}): [
  (variantProps: Partial<VariantKV<V>> & { className?: string }) => string,
  <AnyPropBeforeResolve extends Record<string, any>>(
    anyProps: AnyPropBeforeResolve,
    options?: {
      excludeClassName?: boolean;
    }
  ) => [
    Partial<VariantKV<V>> & { className?: string },
    Omit<AnyPropBeforeResolve, keyof Partial<VariantKV<V>> | "className">,
  ],
] {
  return [
    /**
     * Takes any props (including className), and returns the class name.
     * If there is no variant specified in props, then it will fallback to default.
     *
     * @param variantProps - The variant props including className.
     * @returns The class name.
     */
    ({ className, ...variantProps }) => {
      return twMerge(
        base,
        ...(
          Object.entries(defaults) as [keyof V, keyof V[keyof V]][]
        ).map<string>(
          ([variantKey, defaultValue]) =>
            variants[variantKey][
              (variantProps as unknown as Partial<VariantKV<V>>)[variantKey] ??
                defaultValue
            ]
        ),
        className
      );
    },
    /**
     * Takes any props, parse variant props and other props.
     * If `options.excludeClassName` is true, then it will parse className as "other" props.
     * Otherwise, it will parse className as variant props.
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
            (!options.excludeClassName && key === "className")
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
export type VariantProps<F extends ReturnType<typeof vcn>[0]> = F extends (
  props: infer P
) => string
  ? P
  : never;

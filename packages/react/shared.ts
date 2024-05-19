import { twMerge } from "tailwind-merge";

type BooleanString<T extends string> = T extends "true"
  ? true
  : T extends "false"
    ? false
    : T;

type RawVariantProps<V extends Record<string, Record<string, string>>> = {
  [VariantKey in keyof V]?: BooleanString<keyof V[VariantKey] & string>;
};

export function vcn<V extends Record<string, Record<string, string>>>({
  base,
  variants,
  defaults,
}: {
  base?: string | undefined;
  variants: V;
  defaults: {
    [VariantKey in keyof V]: BooleanString<keyof V[VariantKey] & string>;
  };
}): (variantProps: RawVariantProps<V> & { className?: string }) => string {
  return ({ className, ...variantProps }) => {
    return twMerge(
      base,
      ...(
        Object.entries(defaults) as [keyof V, keyof V[keyof V]][]
      ).map<string>(
        ([variantKey, defaultValue]) =>
          variants[variantKey][
            (variantProps as unknown as RawVariantProps<V>)[variantKey] ??
              defaultValue
          ]
      ),
      className
    );
  };
}

export type VariantProps<F extends ReturnType<typeof vcn>> = F extends (
  props: infer P
) => string
  ? P
  : never;

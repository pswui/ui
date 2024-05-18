import { twMerge } from "tailwind-merge";

export function vcn<V extends Record<string, Record<string, string>>>({
  base,
  variants,
  defaults,
}: {
  base: string;
  variants: V;
  defaults: { [VariantKey in keyof V]: keyof V[VariantKey] };
}): (
  variantProps: Partial<typeof defaults> & { className?: string }
) => string {
  return ({ className, ...variantProps }) => {
    return twMerge(
      base,
      ...(
        Object.entries(defaults) as [keyof V, keyof V[keyof V]][]
      ).map<string>(
        ([variantKey, defaultValue]) =>
          variants[variantKey][
            (variantProps as unknown as Partial<typeof defaults>)[variantKey] ??
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

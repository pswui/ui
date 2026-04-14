import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [sliderVariants, resolveSliderVariantProps] = vcn({
  base: "w-full cursor-pointer accent-neutral-900 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black/20 dark:accent-neutral-100 dark:focus-visible:outline-white/30",
  variants: {
    size: {
      sm: "h-3",
      md: "h-4",
      lg: "h-5",
    },
  },
  defaults: {
    size: "md",
  },
});

interface SliderProps
  extends VariantProps<typeof sliderVariants>,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "type" | "className" | "size"
    > {}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const [variantProps, otherPropsExtracted] = resolveSliderVariantProps(props);

  return (
    <input
      {...otherPropsExtracted}
      ref={ref}
      type="range"
      className={sliderVariants(variantProps)}
    />
  );
});
Slider.displayName = "Slider";

export { Slider };

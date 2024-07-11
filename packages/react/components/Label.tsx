import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [labelVariant, resolveLabelVariantProps] = vcn({
  base: "has-[input[disabled]]:brightness-75 has-[input[disabled]]:cursor-not-allowed has-[input:invalid]:text-red-500",
  variants: {
    direction: {
      vertical: "flex flex-col gap-2 justify-center items-start",
      horizontal: "flex flex-row gap-2 justify-start items-center",
    },
  },
  defaults: {
    direction: "vertical",
  },
});

interface LabelProps
  extends VariantProps<typeof labelVariant>,
    React.ComponentPropsWithoutRef<"label"> {}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveLabelVariantProps(props);

  return (
    <label
      ref={ref}
      {...otherPropsCompressed}
      className={labelVariant(variantProps)}
    />
  );
});
Label.displayName = "Label";

export { Label };

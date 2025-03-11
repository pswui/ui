import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const inputColors = {
  background: {
    default: "bg-neutral-50 dark:bg-neutral-900",
    hover:
      "hover:bg-neutral-100 dark:hover:bg-neutral-800 has-[input:hover]:bg-neutral-100 dark:has-[input:hover]:bg-neutral-800",
    invalid:
      "invalid:bg-red-100 dark:invalid:bg-red-900 has-[input:invalid]:bg-red-100 dark:has-[input:invalid]:bg-red-900",
    invalidHover:
      "hover:invalid:bg-red-200 dark:hover:invalid:bg-red-800 has-[input:invalid:hover]:bg-red-200 dark:has-[input:invalid:hover]:bg-red-800",
  },
  border: {
    default: "border-neutral-400 dark:border-neutral-600",
    invalid:
      "invalid:border-red-400 dark:invalid:border-red-600 has-[input:invalid]:border-red-400 dark:has-[input:invalid]:border-red-600",
  },
  ring: {
    default: "ring-transparent focus-within:ring-current",
    invalid:
      "invalid:focus-within:ring-red-400 dark:invalid:focus-within:ring-red-600 has-[input:invalid]:focus-within:ring-red-400 dark:has-[input:invalid]:focus-within:ring-red-600",
  },
};

const [inputVariant, resolveInputVariantProps] = vcn({
  base: `rounded-md p-2 border ring-1 outline-hidden transition-all duration-200 [appearance:textfield] disabled:brightness-50 disabled:saturate-0 disabled:cursor-not-allowed ${inputColors.background.default} ${inputColors.background.hover} ${inputColors.border.default} ${inputColors.ring.default} ${inputColors.background.invalid} ${inputColors.background.invalidHover} ${inputColors.border.invalid} ${inputColors.ring.invalid} [&:has(input)]:flex`,
  variants: {
    unstyled: {
      true: "bg-transparent border-none p-0 ring-0 hover:bg-transparent invalid:hover:bg-transparent invalid:focus-within:bg-transparent invalid:focus-within:ring-0",
      false: "",
    },
    full: {
      true: "[&:has(input)]:w-full w-full",
      false: "[&:has(input)]:w-fit w-fit",
    },
  },
  defaults: {
    unstyled: false,
    full: false,
  },
});

interface InputFrameProps
  extends VariantProps<typeof inputVariant>,
    React.ComponentPropsWithoutRef<"label">,
    AsChild {
  children?: React.ReactNode;
}

const InputFrame = React.forwardRef<HTMLLabelElement, InputFrameProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveInputVariantProps(props);
    const { children, asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "label";

    return (
      <Comp
        ref={ref}
        className={`group/input-frame ${inputVariant(variantProps)}`}
        {...otherPropsExtracted}
      >
        {children}
      </Comp>
    );
  },
);
InputFrame.displayName = "InputFrame";

interface InputProps
  extends VariantProps<typeof inputVariant>,
    React.ComponentPropsWithoutRef<"input"> {
  type: Exclude<
    React.InputHTMLAttributes<HTMLInputElement>["type"],
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "file"
    | "radio"
    | "range"
    | "reset"
    | "image"
    | "submit"
    | "time"
  >;
  invalid?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveInputVariantProps(props);
  const { type, invalid, ...otherPropsExtracted } = otherPropsCompressed;

  const innerRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (innerRef?.current) {
      innerRef.current.setCustomValidity(invalid ?? "");
    }
  }, [invalid]);

  return (
    <input
      type={type}
      ref={(el) => {
        innerRef.current = el;
        if (typeof ref === "function") {
          ref(el);
        } else if (ref) {
          ref.current = el;
        }
      }}
      className={inputVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
Input.displayName = "Input";

export { InputFrame, Input };

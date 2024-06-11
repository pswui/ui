import React from "react";
import { VariantProps, vcn } from "../lib/shared@1.0.0";

const inputColors = {
  background: {
    default: "bg-neutral-50 dark:bg-neutral-900",
    hover: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
    invalid:
      "invalid:bg-red-100 invalid:dark:bg-red-900 has-[input:invalid]:bg-red-100 dark:has-[input:invalid]:bg-red-900",
    invalidHover:
      "hover:invalid:bg-red-200 dark:hover:invalid:bg-red-800 has-[input:invalid:hover]:bg-red-200 dark:has-[input:invalid:hover]:bg-red-800",
  },
  border: {
    default: "border-neutral-400 dark:border-neutral-600",
    invalid:
      "invalid:border-red-400 invalid:dark:border-red-600 has-[input:invalid]:border-red-400 dark:has-[input:invalid]:border-red-600",
  },
  ring: {
    default: "ring-transparent focus-within:ring-current",
    invalid:
      "invalid:focus-within:ring-red-400 invalid:focus-within:dark:ring-red-600 has-[input:invalid]:focus-within:ring-red-400 dark:has-[input:invalid]:focus-within:ring-red-600",
  },
};

const [inputVariant, resolveInputVariantProps] = vcn({
  base: `rounded-md p-2 border ring-1 outline-none transition-all duration-200 [appearance:textfield] disabled:brightness-50 disabled:saturate-0 disabled:cursor-not-allowed ${inputColors.background.default} ${inputColors.background.hover} ${inputColors.border.default} ${inputColors.ring.default} ${inputColors.background.invalid} ${inputColors.background.invalidHover} ${inputColors.border.invalid} ${inputColors.ring.invalid} [&:has(input)]:flex [&:has(input)]:w-fit`,
  variants: {
    unstyled: {
      true: "bg-transparent border-none p-0 ring-0 hover:bg-transparent invalid:hover:bg-transparent invalid:focus-within:bg-transparent invalid:focus-within:ring-0",
      false: "",
    },
    full: {
      true: "w-full",
      false: "w-fit",
    },
  },
  defaults: {
    unstyled: false,
    full: false,
  },
});

interface InputFrameProps
  extends VariantProps<typeof inputVariant>,
    React.ComponentPropsWithoutRef<"label"> {
  children?: React.ReactNode;
}

const InputFrame = React.forwardRef<HTMLLabelElement, InputFrameProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveInputVariantProps(props);
    const { children, ...otherPropsExtracted } = otherPropsCompressed;

    return (
      <label
        ref={ref}
        className={`group/input-frame ${inputVariant(variantProps)}`}
        {...otherPropsExtracted}
      >
        {children}
      </label>
    );
  },
);

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
    if (innerRef && innerRef.current) {
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

export { InputFrame, Input };

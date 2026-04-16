import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const dateTimeInputColors = {
  background: {
    default: "bg-neutral-50 dark:bg-neutral-900",
    hover: "hover:bg-neutral-100 dark:hover:bg-neutral-800",
    invalid: "invalid:bg-red-100 dark:invalid:bg-red-900",
    invalidHover: "hover:invalid:bg-red-200 dark:hover:invalid:bg-red-800",
  },
  border: {
    default: "border-neutral-400 dark:border-neutral-600",
    invalid: "invalid:border-red-400 dark:invalid:border-red-600",
  },
  ring: {
    default: "ring-transparent focus-within:ring-current",
    invalid:
      "invalid:focus-within:ring-red-400 dark:invalid:focus-within:ring-red-600",
  },
};

const [dateTimeInputVariant, resolveDateTimeInputVariantProps] = vcn({
  base: `block rounded-md border p-2 text-sm ring-1 outline-hidden transition-all duration-200 disabled:cursor-not-allowed disabled:brightness-50 disabled:saturate-0 ${dateTimeInputColors.background.default} ${dateTimeInputColors.background.hover} ${dateTimeInputColors.background.invalid} ${dateTimeInputColors.background.invalidHover} ${dateTimeInputColors.border.default} ${dateTimeInputColors.border.invalid} ${dateTimeInputColors.ring.default} ${dateTimeInputColors.ring.invalid}`,
  variants: {
    unstyled: {
      true: "border-none bg-transparent p-0 ring-0 hover:bg-transparent invalid:hover:bg-transparent invalid:focus-within:bg-transparent invalid:focus-within:ring-0",
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

interface DateTimeInputProps
  extends VariantProps<typeof dateTimeInputVariant>,
    Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  invalid?: string;
}

const DateTimeInput = React.forwardRef<HTMLInputElement, DateTimeInputProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveDateTimeInputVariantProps(props);
    const {
      invalid,
      "aria-invalid": ariaInvalid,
      ...otherPropsExtracted
    } = otherPropsCompressed;
    const isInvalid = Boolean(invalid);
    const resolvedAriaInvalid = isInvalid ? true : ariaInvalid;

    const innerRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (innerRef.current) {
        innerRef.current.setCustomValidity(invalid ?? "");
      }
    }, [invalid]);

    return (
      <input
        type="datetime-local"
        aria-invalid={resolvedAriaInvalid}
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={dateTimeInputVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
DateTimeInput.displayName = "DateTimeInput";

export { DateTimeInput };

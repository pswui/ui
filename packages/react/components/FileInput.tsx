import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const fileInputColors = {
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
  file: {
    default:
      "file:bg-neutral-200 dark:file:bg-neutral-800 file:text-neutral-950 dark:file:text-neutral-50",
    hover: "hover:file:bg-neutral-300 dark:hover:file:bg-neutral-700",
  },
};

const [fileInputVariant, resolveFileInputVariantProps] = vcn({
  base: `block rounded-md border p-1.5 text-sm ring-1 outline-hidden transition-all duration-200 file:mr-3 file:cursor-pointer file:rounded-sm file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-medium disabled:cursor-not-allowed disabled:brightness-50 disabled:saturate-0 disabled:file:cursor-not-allowed ${fileInputColors.background.default} ${fileInputColors.background.hover} ${fileInputColors.background.invalid} ${fileInputColors.background.invalidHover} ${fileInputColors.border.default} ${fileInputColors.border.invalid} ${fileInputColors.ring.default} ${fileInputColors.ring.invalid} ${fileInputColors.file.default} ${fileInputColors.file.hover}`,
  variants: {
    unstyled: {
      true: "border-none bg-transparent p-0 ring-0 hover:bg-transparent invalid:hover:bg-transparent invalid:focus-within:bg-transparent invalid:focus-within:ring-0 file:mr-0 file:rounded-none file:bg-transparent file:px-0 file:py-0 hover:file:bg-transparent",
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

interface FileInputProps
  extends VariantProps<typeof fileInputVariant>,
    Omit<React.ComponentPropsWithoutRef<"input">, "type"> {
  invalid?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveFileInputVariantProps(props);
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
        type="file"
        aria-invalid={resolvedAriaInvalid}
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={fileInputVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
FileInput.displayName = "FileInput";

export { FileInput };

import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const textareaColors = {
  background: {
    default: "bg-neutral-50 dark:bg-neutral-900",
    hover:
      "hover:bg-neutral-100 dark:hover:bg-neutral-800 has-[textarea:hover]:bg-neutral-100 dark:has-[textarea:hover]:bg-neutral-800",
    invalid:
      "invalid:bg-red-100 dark:invalid:bg-red-900 has-[textarea:invalid]:bg-red-100 dark:has-[textarea:invalid]:bg-red-900",
    invalidHover:
      "hover:invalid:bg-red-200 dark:hover:invalid:bg-red-800 has-[textarea:invalid:hover]:bg-red-200 dark:has-[textarea:invalid:hover]:bg-red-800",
  },
  border: {
    default: "border-neutral-400 dark:border-neutral-600",
    invalid:
      "invalid:border-red-400 dark:invalid:border-red-600 has-[textarea:invalid]:border-red-400 dark:has-[textarea:invalid]:border-red-600",
  },
  ring: {
    default: "ring-transparent focus-within:ring-current",
    invalid:
      "invalid:focus-within:ring-red-400 dark:invalid:focus-within:ring-red-600 has-[textarea:invalid]:focus-within:ring-red-400 dark:has-[textarea:invalid]:focus-within:ring-red-600",
  },
};

const [textareaVariant, resolveTextareaVariantProps] = vcn({
  base: `rounded-md p-2 border ring-1 outline-hidden transition-all duration-200 disabled:brightness-50 disabled:saturate-0 disabled:cursor-not-allowed ${textareaColors.background.default} ${textareaColors.background.hover} ${textareaColors.border.default} ${textareaColors.ring.default} ${textareaColors.background.invalid} ${textareaColors.background.invalidHover} ${textareaColors.border.invalid} ${textareaColors.ring.invalid} [&:has(textarea)]:flex`,
  variants: {
    unstyled: {
      true: "bg-transparent border-none p-0 ring-0 hover:bg-transparent invalid:hover:bg-transparent invalid:focus-within:bg-transparent invalid:focus-within:ring-0",
      false: "",
    },
    full: {
      true: "[&:has(textarea)]:w-full w-full",
      false: "[&:has(textarea)]:w-fit w-fit",
    },
  },
  defaults: {
    unstyled: false,
    full: false,
  },
});

interface TextareaFrameProps
  extends VariantProps<typeof textareaVariant>,
    React.ComponentPropsWithoutRef<"label">,
    AsChild {
  children?: React.ReactNode;
}

const TextareaFrame = React.forwardRef<HTMLLabelElement, TextareaFrameProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveTextareaVariantProps(props);
    const { children, asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "label";

    return (
      <Comp
        ref={ref}
        className={`group/textarea-frame ${textareaVariant(variantProps)}`}
        {...otherPropsExtracted}
      >
        {children}
      </Comp>
    );
  },
);
TextareaFrame.displayName = "TextareaFrame";

interface TextareaProps
  extends VariantProps<typeof textareaVariant>,
    React.ComponentPropsWithoutRef<"textarea"> {
  invalid?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveTextareaVariantProps(props);
    const { invalid, ...otherPropsExtracted } = otherPropsCompressed;

    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    React.useEffect(() => {
      if (innerRef?.current) {
        innerRef.current.setCustomValidity(invalid ?? "");
      }
    }, [invalid]);

    return (
      <textarea
        ref={(el) => {
          innerRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={textareaVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { TextareaFrame, Textarea };

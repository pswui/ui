import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const toggleColors = {
  disabled: "disabled:cursor-not-allowed disabled:opacity-50",
  outline: "focus-visible:outline-black/10 dark:focus-visible:outline-white/20",
  border: "border-neutral-300 dark:border-neutral-700",
  background:
    "bg-white hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-900",
  pressed:
    "aria-pressed:bg-neutral-900 aria-pressed:text-white aria-pressed:hover:bg-neutral-800 dark:aria-pressed:bg-neutral-100 dark:aria-pressed:text-black dark:aria-pressed:hover:bg-neutral-200",
};

const [toggleVariants, resolveToggleVariantProps] = vcn({
  base: `inline-flex w-fit items-center justify-center rounded-md border outline outline-1 outline-offset-2 outline-transparent transition-all ${toggleColors.border} ${toggleColors.background} ${toggleColors.pressed} ${toggleColors.outline} ${toggleColors.disabled}`,
  variants: {
    size: {
      sm: "px-2 py-1 text-sm",
      md: "px-3 py-2 text-base",
      lg: "px-4 py-2 text-lg",
    },
  },
  defaults: {
    size: "md",
  },
});

export interface ToggleProps
  extends Omit<
      React.ComponentPropsWithoutRef<"button">,
      "aria-pressed" | "className"
    >,
    VariantProps<typeof toggleVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveToggleVariantProps(props);
    const {
      defaultPressed = false,
      pressed: propPressed,
      onClick,
      onPressedChange,
      type,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const [uncontrolledPressed, setUncontrolledPressed] =
      React.useState(defaultPressed);
    const isControlled = typeof propPressed === "boolean";
    const pressed = propPressed ?? uncontrolledPressed;

    return (
      <button
        {...otherPropsExtracted}
        ref={ref}
        type={type ?? "button"}
        aria-pressed={pressed}
        className={toggleVariants(variantProps)}
        onClick={(event) => {
          onClick?.(event);

          if (event.defaultPrevented) return;

          const nextPressed = !pressed;
          if (!isControlled) {
            setUncontrolledPressed(nextPressed);
          }
          onPressedChange?.(nextPressed);
        }}
      />
    );
  },
);
Toggle.displayName = "Toggle";

export { Toggle };

import React from "react";
import { VariantProps, vcn } from "../lib/shared@1.0.0";

const switchColors = {
  background: {
    default: "bg-neutral-200 dark:bg-neutral-700",
    hover: "hover:bg-neutral-300 dark:hover:bg-neutral-600",
    checked:
      "has-[input[type=checkbox]:checked]:bg-neutral-700 dark:has-[input[type=checkbox]:checked]:bg-neutral-300",
    checkedHover:
      "has-[input[type=checkbox]:checked]:hover:bg-black dark:has-[input[type=checkbox]:checked]:hover:bg-white",
    disabled:
      "has-[input[type=checkbox]:disabled]:bg-neutral-100 dark:has-[input[type=checkbox]:disabled]:bg-neutral-800",
    disabledHover:
      "has-[input[type=checkbox]:disabled]:hover:bg-neutral-100 dark:has-[input[type=checkbox]:disabled]:hover:bg-neutral-800",
    disabledChecked:
      "has-[input[type=checkbox]:disabled:checked]:bg-neutral-300 dark:has-[input[type=checkbox]:disabled:checked]:bg-neutral-700",
    disabledCheckedHover:
      "has-[input[type=checkbox]:disabled:checked]:hover:bg-neutral-300 dark:has-[input[type=checkbox]:disabled:checked]:hover:bg-neutral-700",
  },
  button: {
    default: "bg-white dark:bg-black",
  },
};

const [switchVariant, resolveSwitchVariantProps] = vcn({
  base: `relative inline-block group/switch rounded-full p-1 has-[input[type=checkbox]:not(:checked)]:pr-5 has-[input[type=checkbox]:checked]:pl-5 ${switchColors.background.default} ${switchColors.background.hover} ${switchColors.background.checked} ${switchColors.background.checkedHover} ${switchColors.background.disabled} ${switchColors.background.disabledHover} ${switchColors.background.disabledChecked} ${switchColors.background.disabledCheckedHover} has-[input[type=checkbox]:disabled]:cursor-not-allowed transition-all duration-200 ease-in-out`,
  variants: {},
  defaults: {},
});

interface SwitchProps
  extends VariantProps<typeof switchVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "type" | "className" | "size"
    > {}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveSwitchVariantProps(props);
  const {
    defaultChecked,
    checked: propChecked,
    onChange,
    ...otherPropsExtracted
  } = otherPropsCompressed;

  // internally handles checked, so we can use checked value without prop
  const [checked, setChecked] = React.useState(defaultChecked ?? false);
  React.useEffect(() => {
    if (typeof propChecked === "boolean") {
      setChecked(propChecked);
    }
  }, [propChecked]);

  const internalRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <label className={switchVariant(variantProps)}>
      <input
        {...otherPropsExtracted}
        defaultChecked={defaultChecked}
        checked={typeof defaultChecked === "boolean" ? undefined : checked}
        type="checkbox"
        className="hidden"
        onChange={(e) => {
          setChecked(e.currentTarget.checked);
          onChange?.(e);
        }}
        ref={(el) => {
          internalRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
      />
      <div className={`w-4 h-4 rounded-full ${switchColors.button.default}`} />
    </label>
  );
});

export { Switch };

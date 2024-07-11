import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const checkboxColors = {
  background: {
    default: "bg-neutral-200 dark:bg-neutral-700",
    hover: "hover:bg-neutral-300 dark:hover:bg-neutral-600",
    checked:
      "has-[input[type=checkbox]:checked]:bg-neutral-300 dark:has-[input[type=checkbox]:checked]:bg-neutral-400",
    checkedHover:
      "has-[input[type=checkbox]:checked]:hover:bg-neutral-400 dark:has-[input[type=checkbox]:checked]:hover:bg-neutral-300",
    disabled:
      'has-[input[type="checkbox"]:disabled]:bg-neutral-100 dark:has-[input[type="checkbox"]:disabled]:bg-neutral-800',
    disabledHover:
      "has-[input[type='checkbox']:disabled]:hover:bg-neutral-100 dark:has-[input[type='checkbox']:disabled]:hover:bg-neutral-800",
    disabledChecked:
      "has-[input[type='checkbox']:disabled:checked]:bg-neutral-300 dark:has-[input[type='checkbox']:disabled:checked]:bg-neutral-700",
    disabledCheckedHover:
      "has-[input[type='checkbox']:disabled:checked]:hover:bg-neutral-300 dark:has-[input[type='checkbox']:disabled:checked]:hover:bg-neutral-700",
  },
};

const [checkboxVariant, resolveCheckboxVariantProps] = vcn({
  base: `inline-block rounded-md ${checkboxColors.background.disabled} ${checkboxColors.background.default} ${checkboxColors.background.hover} ${checkboxColors.background.checked} ${checkboxColors.background.checkedHover} ${checkboxColors.background.disabledChecked} ${checkboxColors.background.disabledCheckedHover} has-[input[type="checkbox"]:disabled]:cursor-not-allowed transition-colors duration-75 ease-in-out`,
  variants: {
    size: {
      base: "size-[1em] p-0 [&>svg]:size-[1em]",
      md: "size-[1.5em] p-0.5 [&>svg]:size-[1.25em]",
      lg: "size-[1.75em] p-1 [&>svg]:size-[1.25em]",
    },
  },
  defaults: {
    size: "md",
  },
});

interface CheckboxProps
  extends VariantProps<typeof checkboxVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "type" | "className" | "size"
    > {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCheckboxVariantProps(props);
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
      <>
        <label className={checkboxVariant(variantProps)}>
          <input
            {...otherPropsExtracted}
            defaultChecked={defaultChecked}
            checked={
              typeof defaultChecked === "boolean"
                ? undefined
                : checked /* should be either uncontrolled (defaultChecked set) or controlled (checked set) */
            }
            onChange={(e) => {
              setChecked(e.currentTarget.checked);
              if (onChange) {
                onChange(e);
              }
            }}
            type="checkbox"
            className="hidden"
            ref={(el) => {
              internalRef.current = el;
              if (typeof ref === "function") {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
          />
        </label>
      </>
    );
  },
);
Checkbox.displayName = "Checkbox";

export { Checkbox };

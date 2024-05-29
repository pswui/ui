import React from "react";
import { VariantProps, vcn } from "../shared";

const checkboxColors = {
  background: {
    default: "bg-neutral-200 dark:bg-neutral-700",
    checked: "bg-neutral-300 dark:bg-neutral-400",
    disabled:
      'has-[input[type="checkbox"]:disabled]:bg-neutral-100 dark:has-[input[type="checkbox"]:disabled]:bg-neutral-800',
  },
  checkmark: "text-black dark:text-white",
};

const [checkboxVariant, resolveCheckboxVariantProps] = vcn({
  base: `inline-block rounded-md p-1 size-6 ${checkboxColors.checkmark} ${checkboxColors.background.disabled} has-[input[type="checkbox"]:disabled]:cursor-not-allowed transition-colors duration-75 ease-in-out`,
  variants: {
    checked: {
      true: `${checkboxColors.background.checked}`,
      false: `${checkboxColors.background.default}`,
    },
  },
  defaults: {
    checked: false,
  },
});

interface CheckboxProps
  extends VariantProps<typeof checkboxVariant>,
    Omit<React.ComponentPropsWithoutRef<"input">, "type" | "className"> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCheckboxVariantProps(props);
    const { defaultChecked, onChange, ...otherPropsExtracted } =
      otherPropsCompressed;

    // internally handles checked, so we can use checked value without prop
    const [checked, setChecked] = React.useState(defaultChecked ?? false);
    React.useEffect(() => {
      if (typeof variantProps.checked === "boolean") {
        setChecked(variantProps.checked);
      }
    }, [variantProps.checked]);

    const internalRef = React.useRef<HTMLInputElement | null>(null);

    return (
      <>
        <label className={checkboxVariant({ ...variantProps, checked })}>
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
            className="hidden peer/checkbox"
            ref={(el) => {
              internalRef.current = el;
              if (typeof ref === "function") {
                ref(el);
              } else if (ref) {
                ref.current = el;
              }
            }}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            className={`${checked ? "opacity-100" : "opacity-0"} transition-opacity duration-75 ease-in-out`}
          >
            <path
              fill="currentColor"
              d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"
            ></path>
          </svg>
        </label>
      </>
    );
  }
);

export { Checkbox };

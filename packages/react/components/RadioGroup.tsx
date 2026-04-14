import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [radioGroupVariant, resolveRadioGroupVariantProps] = vcn({
  base: "flex",
  variants: {
    orientation: {
      vertical: "flex-col items-start gap-3",
      horizontal: "flex-row flex-wrap items-center gap-4",
    },
  },
  defaults: {
    orientation: "vertical",
  },
});

const [radioGroupItemVariant, resolveRadioGroupItemVariantProps] = vcn({
  base: "relative inline-flex w-fit items-center gap-3 rounded-md text-sm outline outline-2 outline-offset-2 outline-transparent transition-colors duration-150 has-[input:focus-visible]:outline-black/10 dark:has-[input:focus-visible]:outline-white/20 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60",
  variants: {},
  defaults: {},
});

interface RadioGroupContextValue {
  disabled?: boolean;
  name: string;
  setValue: (value: string) => void;
  value?: string;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
);

const useRadioGroupContext = () => {
  const context = React.useContext(RadioGroupContext);

  if (!context) {
    throw new Error("RadioGroupItem must be used within RadioGroup.");
  }

  return context;
};

interface RadioGroupProps
  extends VariantProps<typeof radioGroupVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"div">,
      "children" | "className" | "defaultValue" | "onChange"
    > {
  children?: React.ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  name?: string;
  onValueChange?: (value: string) => void;
  value?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveRadioGroupVariantProps(props);
    const {
      children,
      defaultValue,
      disabled,
      name,
      onValueChange,
      value: propValue,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const generatedName = React.useId();
    const resolvedName = name ?? generatedName;
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const isControlled = typeof propValue === "string";
    const value = isControlled ? propValue : uncontrolledValue;

    const orientation = variantProps.orientation ?? "vertical";
    const contextValue = {
      disabled,
      name: resolvedName,
      setValue: (nextValue: string) => {
        if (!isControlled) {
          setUncontrolledValue(nextValue);
        }

        onValueChange?.(nextValue);
      },
      value,
    };

    return (
      <RadioGroupContext.Provider value={contextValue}>
        <div
          {...otherPropsExtracted}
          ref={ref}
          role="radiogroup"
          aria-disabled={disabled ? true : undefined}
          aria-orientation={orientation}
          className={radioGroupVariant(variantProps)}
        >
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

interface RadioGroupItemProps
  extends VariantProps<typeof radioGroupItemVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"input">,
      "checked" | "className" | "defaultChecked" | "name" | "size" | "type"
    > {
  children?: React.ReactNode;
  value: string;
}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveRadioGroupItemVariantProps(props);
    const { children, disabled, onChange, value, ...otherPropsExtracted } =
      otherPropsCompressed;

    const group = useRadioGroupContext();
    const isDisabled = group.disabled || disabled;
    const isChecked = group.value === value;

    return (
      <label className={radioGroupItemVariant(variantProps)}>
        <input
          {...otherPropsExtracted}
          ref={ref}
          type="radio"
          name={group.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          className="peer absolute inset-0 z-10 m-0 h-full w-full cursor-inherit opacity-0 disabled:cursor-not-allowed"
          onChange={(event) => {
            if (event.currentTarget.checked) {
              group.setValue(value);
            }

            onChange?.(event);
          }}
        />
        <span
          aria-hidden
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-neutral-400 bg-white text-white transition-colors duration-150 after:block after:size-2 after:scale-0 after:rounded-full after:bg-current after:transition-transform after:duration-150 after:content-[''] peer-checked:border-neutral-900 peer-checked:bg-neutral-900 peer-checked:after:scale-100 peer-disabled:border-neutral-300 peer-disabled:bg-neutral-100 dark:border-neutral-600 dark:bg-black dark:text-black dark:peer-checked:border-white dark:peer-checked:bg-white dark:peer-disabled:border-neutral-700 dark:peer-disabled:bg-neutral-900"
        />
        {children ? <span>{children}</span> : null}
      </label>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

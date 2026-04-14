import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

import { Toggle, type ToggleProps } from "./Toggle";

const [toggleGroupVariants, resolveToggleGroupVariantProps] = vcn({
  base: "flex w-fit gap-2",
  variants: {
    orientation: {
      horizontal: "flex-row flex-wrap items-center",
      vertical: "flex-col items-start",
    },
  },
  defaults: {
    orientation: "horizontal",
  },
});

interface ToggleGroupContextValue {
  disabled?: boolean;
  isItemPressed: (value: string) => boolean;
  onItemPressedChange: (value: string, pressed: boolean) => void;
  size?: ToggleProps["size"];
}

const ToggleGroupContext = React.createContext<ToggleGroupContextValue | null>(
  null,
);

const useToggleGroupContext = () => {
  const context = React.useContext(ToggleGroupContext);

  if (!context) {
    throw new Error("ToggleGroupItem must be used within ToggleGroup.");
  }

  return context;
};

interface ToggleGroupSharedProps
  extends VariantProps<typeof toggleGroupVariants>,
    Omit<
      React.ComponentPropsWithoutRef<"div">,
      "children" | "className" | "defaultValue" | "onChange" | "value"
    > {
  children?: React.ReactNode;
  disabled?: boolean;
  size?: ToggleProps["size"];
}

interface ToggleGroupSingleProps extends ToggleGroupSharedProps {
  defaultValue?: string;
  onValueChange?: (value: string | undefined) => void;
  type?: "single";
  value?: string;
}

interface ToggleGroupMultipleProps extends ToggleGroupSharedProps {
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  type: "multiple";
  value?: string[];
}

type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps;

const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveToggleGroupVariantProps(props);
    const {
      children,
      defaultValue: _defaultValue,
      disabled,
      onValueChange: _onValueChange,
      role,
      size,
      type = "single",
      value: _value,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const isMultiple = type === "multiple";
    const singleProps = props as ToggleGroupSingleProps;
    const multipleProps = props as ToggleGroupMultipleProps;

    const defaultValue = isMultiple
      ? multipleProps.defaultValue ?? []
      : singleProps.defaultValue;
    const propValue = isMultiple ? multipleProps.value : singleProps.value;
    const [uncontrolledValue, setUncontrolledValue] = React.useState<
      string | string[] | undefined
    >(defaultValue);
    const isControlled = Object.prototype.hasOwnProperty.call(props, "value");
    const value = isControlled ? propValue : uncontrolledValue;

    const setValue = (nextValue: string | string[] | undefined) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      if (isMultiple) {
        multipleProps.onValueChange?.(
          Array.isArray(nextValue) ? nextValue : [],
        );
        return;
      }

      singleProps.onValueChange?.(
        typeof nextValue === "string" ? nextValue : undefined,
      );
    };

    const contextValue = {
      disabled,
      isItemPressed: (itemValue: string) => {
        if (isMultiple) {
          return Array.isArray(value) ? value.includes(itemValue) : false;
        }

        return value === itemValue;
      },
      onItemPressedChange: (itemValue: string, pressed: boolean) => {
        if (isMultiple) {
          const currentValue = Array.isArray(value) ? value : [];
          const nextValue = pressed
            ? [...currentValue, itemValue]
            : currentValue.filter(
                (currentItemValue) => currentItemValue !== itemValue,
              );

          setValue(nextValue);
          return;
        }

        setValue(pressed ? itemValue : undefined);
      },
      size,
    } satisfies ToggleGroupContextValue;

    const orientation = variantProps.orientation ?? "horizontal";

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          {...otherPropsExtracted}
          ref={ref}
          role={role ?? "toolbar"}
          aria-disabled={disabled ? true : undefined}
          aria-orientation={orientation}
          className={toggleGroupVariants(variantProps)}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    );
  },
);
ToggleGroup.displayName = "ToggleGroup";

interface ToggleGroupItemProps
  extends Omit<ToggleProps, "defaultPressed" | "pressed"> {
  value: string;
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>((props, ref) => {
  const { disabled, onPressedChange, size, value, ...otherPropsExtracted } =
    props;
  const group = useToggleGroupContext();

  return (
    <Toggle
      {...otherPropsExtracted}
      ref={ref}
      disabled={group.disabled || disabled}
      pressed={group.isItemPressed(value)}
      size={size ?? group.size}
      onPressedChange={(pressed) => {
        group.onItemPressedChange(value, pressed);
        onPressedChange?.(pressed);
      }}
    />
  );
});
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };

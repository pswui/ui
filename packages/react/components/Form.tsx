import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from "react";

/**
Form Item Context
**/
interface IFormItemContext {
  invalid?: string | null | undefined;
}
const FormItemContext = createContext<IFormItemContext>({});

/**
FormItem
**/
const [formItemVariant, resolveFormItemVariantProps] = vcn({
  base: "flex flex-col gap-2 items-start w-full",
  variants: {},
  defaults: {},
});

interface FormItemProps
  extends VariantProps<typeof formItemVariant>,
    AsChild,
    ComponentPropsWithoutRef<"label"> {
  invalid?: string | null | undefined;
}

const FormItem = forwardRef<HTMLLabelElement, FormItemProps>((props, ref) => {
  const [variantProps, restPropsCompressed] =
    resolveFormItemVariantProps(props);
  const { asChild, children, invalid, ...restPropsExtracted } =
    restPropsCompressed;
  const innerRef = useRef<HTMLLabelElement | null>(null);

  useEffect(() => {
    const invalidAsString = invalid ? invalid : "";

    const input = innerRef.current?.querySelector?.("input");
    if (!input) return;

    input.setCustomValidity(invalidAsString);
  }, [invalid]);

  const Comp = asChild ? Slot : "label";

  return (
    <FormItemContext.Provider value={{ invalid }}>
      <Comp
        ref={(el: HTMLLabelElement | null) => {
          innerRef.current = el;
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
        }}
        className={formItemVariant(variantProps)}
        {...restPropsExtracted}
      >
        {children}
      </Comp>
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

/**
FormLabel
**/
const [formLabelVariant, resolveFormLabelVariantProps] = vcn({
  base: "text-sm font-bold",
  variants: {},
  defaults: {},
});

interface FormLabelProps
  extends VariantProps<typeof formLabelVariant>,
    AsChild,
    ComponentPropsWithoutRef<"span"> {}

const FormLabel = forwardRef<HTMLSpanElement, FormLabelProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveFormLabelVariantProps(props);
  const { children, asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      className={formLabelVariant(variantProps)}
      {...otherPropsExtracted}
    >
      {children}
    </Comp>
  );
});
FormLabel.displayName = "FormLabel";

/**
FormHelper
**/
const [formHelperVariant, resolveFormHelperVariantProps] = vcn({
  base: "opacity-75 text-sm font-light",
  variants: {},
  defaults: {},
});

interface FormHelperProps
  extends VariantProps<typeof formHelperVariant>,
    AsChild,
    ComponentPropsWithoutRef<"span"> {
  hiddenOnInvalid?: boolean;
}

const FormHelper = forwardRef<HTMLSpanElement, FormHelperProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveFormHelperVariantProps(props);
    const { asChild, children, hiddenOnInvalid, ...otherPropsExtracted } =
      otherPropsCompressed;
    const item = useContext(FormItemContext);

    if (item.invalid && hiddenOnInvalid) return null;

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        className={formHelperVariant(variantProps)}
        {...otherPropsExtracted}
      >
        {children}
      </Comp>
    );
  },
);
FormHelper.displayName = "FormHelper";

/**
FormError
**/
const [formErrorVariant, resolveFormErrorVariantProps] = vcn({
  base: "text-sm text-red-500",
  variants: {},
  defaults: {},
});

interface FormErrorProps
  extends VariantProps<typeof formErrorVariant>,
    AsChild,
    Omit<ComponentPropsWithoutRef<"span">, "children"> {}

const FormError = forwardRef<HTMLSpanElement, FormErrorProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveFormErrorVariantProps(props);
  const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const item = useContext(FormItemContext);

  const Comp = asChild ? Slot : "span";

  return item.invalid ? (
    <Comp
      ref={ref}
      className={formErrorVariant(variantProps)}
      {...otherPropsExtracted}
    >
      {item.invalid}
    </Comp>
  ) : null;
});
FormError.displayName = "FormError";

export { FormItem, FormLabel, FormHelper, FormError };

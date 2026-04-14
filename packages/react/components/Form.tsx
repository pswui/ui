import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useRef,
} from "react";

/**
Form Item Context
**/
interface IFormItemContext {
  invalid?: string | null | undefined;
  labelId?: string;
  helperId?: string;
  errorId?: string;
}
const FormItemContext = createContext<IFormItemContext>({});

const mergeIds = (...parts: Array<string | null | undefined>) => {
  const ids = parts.flatMap((part) => part?.split(/\s+/) ?? []).filter(Boolean);

  return ids.length ? Array.from(new Set(ids)).join(" ") : undefined;
};

const setOrRemoveAttribute = (
  element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  name: string,
  value?: string,
) => {
  if (value) {
    element.setAttribute(name, value);
    return;
  }

  element.removeAttribute(name);
};

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
  const labelId = useId();
  const helperId = useId();
  const errorId = useId();
  const initialAriaLabelledBy = useRef<string | null | undefined>(undefined);
  const initialAriaDescribedBy = useRef<string | null | undefined>(undefined);
  const initialAriaErrorMessage = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const invalidAsString = invalid ? invalid : "";

    const field = innerRef.current?.querySelector?.<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >("input, textarea, select");
    if (!field) return;

    if (initialAriaLabelledBy.current === undefined) {
      initialAriaLabelledBy.current = field.getAttribute("aria-labelledby");
    }
    if (initialAriaDescribedBy.current === undefined) {
      initialAriaDescribedBy.current = field.getAttribute("aria-describedby");
    }
    if (initialAriaErrorMessage.current === undefined) {
      initialAriaErrorMessage.current = field.getAttribute("aria-errormessage");
    }

    const label =
      innerRef.current?.querySelector<HTMLElement>("[data-form-label]");
    const helper =
      innerRef.current?.querySelector<HTMLElement>("[data-form-helper]");
    const error =
      innerRef.current?.querySelector<HTMLElement>("[data-form-error]");

    field.setCustomValidity(invalidAsString);
    setOrRemoveAttribute(
      field,
      "aria-labelledby",
      mergeIds(initialAriaLabelledBy.current, label?.id),
    );
    setOrRemoveAttribute(
      field,
      "aria-describedby",
      mergeIds(initialAriaDescribedBy.current, helper?.id, error?.id),
    );
    setOrRemoveAttribute(
      field,
      "aria-errormessage",
      invalid
        ? mergeIds(initialAriaErrorMessage.current, error?.id)
        : initialAriaErrorMessage.current ?? undefined,
    );

    if (invalid) {
      field.setAttribute("aria-invalid", "true");
      return;
    }

    field.removeAttribute("aria-invalid");
  }, [invalid]);

  const Comp = asChild ? Slot : "label";

  return (
    <FormItemContext.Provider value={{ invalid, labelId, helperId, errorId }}>
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
  const item = useContext(FormItemContext);

  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      id={otherPropsExtracted.id ?? item.labelId}
      data-form-label=""
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
        id={otherPropsExtracted.id ?? item.helperId}
        data-form-helper=""
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
      id={otherPropsExtracted.id ?? item.errorId}
      data-form-error=""
      className={formErrorVariant(variantProps)}
      {...otherPropsExtracted}
    >
      {item.invalid}
    </Comp>
  ) : null;
});
FormError.displayName = "FormError";

export { FormItem, FormLabel, FormHelper, FormError };

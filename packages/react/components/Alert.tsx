import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [alertVariant, resolveAlertVariantProps] = vcn({
  base: "flex flex-col gap-2 rounded-lg border p-4 text-neutral-950 shadow-sm dark:text-neutral-50",
  variants: {
    status: {
      default:
        "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black",
      success:
        "border-green-400 bg-green-50 dark:border-green-600 dark:bg-green-950/40",
      warning:
        "border-yellow-400 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-950/40",
      danger: "border-red-400 bg-red-50 dark:border-red-600 dark:bg-red-950/40",
    },
  },
  defaults: {
    status: "default",
  },
});

interface AlertProps
  extends VariantProps<typeof alertVariant>,
    React.ComponentPropsWithoutRef<"section">,
    AsChild {}

const Alert = React.forwardRef<HTMLElement, AlertProps>((props, ref) => {
  const { className } = props;
  const [variantProps, otherPropsCompressed] = resolveAlertVariantProps(props);
  const { asChild, role, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "section";

  return (
    <Comp
      ref={ref}
      role={role ?? "alert"}
      {...otherPropsExtracted}
      className={alertVariant({ ...variantProps, className })}
    />
  );
});
Alert.displayName = "Alert";

const [alertTitleVariant, resolveAlertTitleVariantProps] = vcn({
  base: "text-base font-semibold leading-none tracking-tight",
  variants: {},
  defaults: {},
});

interface AlertTitleProps
  extends VariantProps<typeof alertTitleVariant>,
    React.ComponentPropsWithoutRef<"h5">,
    AsChild {}

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveAlertTitleVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "h5";

    return (
      <Comp
        ref={ref}
        className={alertTitleVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
AlertTitle.displayName = "AlertTitle";

const [alertDescriptionVariant, resolveAlertDescriptionVariantProps] = vcn({
  base: "text-sm text-neutral-600 dark:text-neutral-300",
  variants: {},
  defaults: {},
});

interface AlertDescriptionProps
  extends VariantProps<typeof alertDescriptionVariant>,
    React.ComponentPropsWithoutRef<"p">,
    AsChild {}

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  AlertDescriptionProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveAlertDescriptionVariantProps(props);
  const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      className={alertDescriptionVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };

import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [cardVariant, resolveCardVariantProps] = vcn({
  base: "flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-6 text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-50",
  variants: {},
  defaults: {},
});

interface CardProps
  extends VariantProps<typeof cardVariant>,
    React.ComponentPropsWithoutRef<"article">,
    AsChild {}

const Card = React.forwardRef<HTMLElement, CardProps>((props, ref) => {
  const [variantProps, otherPropsCompressed] = resolveCardVariantProps(props);
  const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "article";

  return (
    <Comp
      ref={ref}
      className={cardVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
Card.displayName = "Card";

const [cardHeaderVariant, resolveCardHeaderVariantProps] = vcn({
  base: "flex flex-col gap-1.5",
  variants: {},
  defaults: {},
});

interface CardHeaderProps
  extends VariantProps<typeof cardHeaderVariant>,
    React.ComponentPropsWithoutRef<"header">,
    AsChild {}

const CardHeader = React.forwardRef<HTMLElement, CardHeaderProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCardHeaderVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "header";

    return (
      <Comp
        ref={ref}
        className={cardHeaderVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
CardHeader.displayName = "CardHeader";

const [cardTitleVariant, resolveCardTitleVariantProps] = vcn({
  base: "text-xl font-semibold leading-none",
  variants: {},
  defaults: {},
});

interface CardTitleProps
  extends VariantProps<typeof cardTitleVariant>,
    React.ComponentPropsWithoutRef<"h3">,
    AsChild {}

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCardTitleVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "h3";

    return (
      <Comp
        ref={ref}
        className={cardTitleVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
CardTitle.displayName = "CardTitle";

const [cardDescriptionVariant, resolveCardDescriptionVariantProps] = vcn({
  base: "text-sm text-neutral-500 dark:text-neutral-400",
  variants: {},
  defaults: {},
});

interface CardDescriptionProps
  extends VariantProps<typeof cardDescriptionVariant>,
    React.ComponentPropsWithoutRef<"p">,
    AsChild {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveCardDescriptionVariantProps(props);
  const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

  const Comp = asChild ? Slot : "p";

  return (
    <Comp
      ref={ref}
      className={cardDescriptionVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
CardDescription.displayName = "CardDescription";

const [cardContentVariant, resolveCardContentVariantProps] = vcn({
  base: "flex flex-col gap-2",
  variants: {},
  defaults: {},
});

interface CardContentProps
  extends VariantProps<typeof cardContentVariant>,
    React.ComponentPropsWithoutRef<"div">,
    AsChild {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCardContentVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "div";

    return (
      <Comp
        ref={ref}
        className={cardContentVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
CardContent.displayName = "CardContent";

const [cardFooterVariant, resolveCardFooterVariantProps] = vcn({
  base: "flex flex-row items-center gap-2",
  variants: {},
  defaults: {},
});

interface CardFooterProps
  extends VariantProps<typeof cardFooterVariant>,
    React.ComponentPropsWithoutRef<"footer">,
    AsChild {}

const CardFooter = React.forwardRef<HTMLElement, CardFooterProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveCardFooterVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "footer";

    return (
      <Comp
        ref={ref}
        className={cardFooterVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};

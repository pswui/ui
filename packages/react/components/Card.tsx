import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

function mergeAriaIds(...values: Array<string | undefined>) {
  const ids = new Set<string>();

  for (const value of values) {
    if (!value) continue;

    for (const token of value.split(/\s+/)) {
      if (token) ids.add(token);
    }
  }

  return ids.size > 0 ? Array.from(ids).join(" ") : undefined;
}

function resolveSlottedId(children: React.ReactNode) {
  if (!React.isValidElement(children)) return undefined;

  const { id } = children.props as { id?: unknown };
  return typeof id === "string" && id.length > 0 ? id : undefined;
}

interface CardContextValue {
  titleId?: string;
  descriptionId?: string;
  registerTitle: (id: string) => () => void;
  registerDescription: (id: string) => () => void;
}

const CardContext = React.createContext<CardContextValue | null>(null);

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
  const [titleId, setTitleId] = React.useState<string>();
  const [descriptionId, setDescriptionId] = React.useState<string>();
  const registerTitle = React.useRef((id: string) => {
    setTitleId(id);

    return () => {
      setTitleId((currentId) => (currentId === id ? undefined : currentId));
    };
  }).current;
  const registerDescription = React.useRef((id: string) => {
    setDescriptionId(id);

    return () => {
      setDescriptionId((currentId) =>
        currentId === id ? undefined : currentId,
      );
    };
  }).current;
  const [variantProps, otherPropsCompressed] = resolveCardVariantProps(props);
  const {
    asChild,
    "aria-describedby": ariaDescribedBy,
    "aria-labelledby": ariaLabelledBy,
    ...otherPropsExtracted
  } = otherPropsCompressed;

  const Comp = asChild ? Slot : "article";

  return (
    <CardContext.Provider
      value={{
        titleId,
        descriptionId,
        registerTitle,
        registerDescription,
      }}
    >
      <Comp
        ref={ref}
        className={cardVariant(variantProps)}
        aria-labelledby={mergeAriaIds(ariaLabelledBy, titleId)}
        aria-describedby={mergeAriaIds(ariaDescribedBy, descriptionId)}
        {...otherPropsExtracted}
      />
    </CardContext.Provider>
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
    const cardContext = React.useContext(CardContext);
    const generatedId = React.useId();
    const [variantProps, otherPropsCompressed] =
      resolveCardTitleVariantProps(props);
    const { asChild, id, ...otherPropsExtracted } = otherPropsCompressed;
    const registerTitle = cardContext?.registerTitle;
    const resolvedId =
      id ??
      (asChild ? resolveSlottedId(otherPropsExtracted.children) : undefined) ??
      (cardContext ? generatedId : undefined);

    const Comp = asChild ? Slot : "h3";

    React.useEffect(() => {
      if (!registerTitle || !resolvedId) return undefined;

      return registerTitle(resolvedId);
    }, [registerTitle, resolvedId]);

    return (
      <Comp
        ref={ref}
        id={resolvedId}
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
  const cardContext = React.useContext(CardContext);
  const generatedId = React.useId();
  const [variantProps, otherPropsCompressed] =
    resolveCardDescriptionVariantProps(props);
  const { asChild, id, ...otherPropsExtracted } = otherPropsCompressed;
  const registerDescription = cardContext?.registerDescription;
  const resolvedId =
    id ??
    (asChild ? resolveSlottedId(otherPropsExtracted.children) : undefined) ??
    (cardContext ? generatedId : undefined);

  const Comp = asChild ? Slot : "p";

  React.useEffect(() => {
    if (!registerDescription || !resolvedId) return undefined;

    return registerDescription(resolvedId);
  }, [registerDescription, resolvedId]);

  return (
    <Comp
      ref={ref}
      id={resolvedId}
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

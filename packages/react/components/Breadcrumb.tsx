import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [breadcrumbVariant, resolveBreadcrumbVariantProps] = vcn({
  base: "w-full",
  variants: {},
  defaults: {},
});

interface BreadcrumbProps
  extends VariantProps<typeof breadcrumbVariant>,
    React.ComponentPropsWithoutRef<"nav"> {}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveBreadcrumbVariantProps(props);
    const { "aria-label": ariaLabel, ...otherPropsExtracted } =
      otherPropsCompressed;

    return (
      <nav
        ref={ref}
        aria-label={ariaLabel ?? "Breadcrumb"}
        className={breadcrumbVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
Breadcrumb.displayName = "Breadcrumb";

const [breadcrumbListVariant, resolveBreadcrumbListVariantProps] = vcn({
  base: "flex flex-wrap items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400",
  variants: {},
  defaults: {},
});

interface BreadcrumbListProps
  extends VariantProps<typeof breadcrumbListVariant>,
    React.ComponentPropsWithoutRef<"ol"> {}

const BreadcrumbList = React.forwardRef<HTMLOListElement, BreadcrumbListProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveBreadcrumbListVariantProps(props);

    return (
      <ol
        ref={ref}
        className={breadcrumbListVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
BreadcrumbList.displayName = "BreadcrumbList";

const [breadcrumbItemVariant, resolveBreadcrumbItemVariantProps] = vcn({
  base: "inline-flex items-center gap-1.5",
  variants: {},
  defaults: {},
});

interface BreadcrumbItemProps
  extends VariantProps<typeof breadcrumbItemVariant>,
    React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveBreadcrumbItemVariantProps(props);

    return (
      <li
        ref={ref}
        className={breadcrumbItemVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const [breadcrumbLinkVariant, resolveBreadcrumbLinkVariantProps] = vcn({
  base: "transition-colors hover:text-neutral-950 focus-visible:text-neutral-950 focus-visible:underline focus-visible:outline-none dark:hover:text-neutral-50 dark:focus-visible:text-neutral-50",
  variants: {},
  defaults: {},
});

interface BreadcrumbLinkProps
  extends VariantProps<typeof breadcrumbLinkVariant>,
    Omit<React.ComponentPropsWithoutRef<"a">, "className">,
    AsChild {}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveBreadcrumbLinkVariantProps(props);
    const { asChild, ...otherPropsExtracted } = otherPropsCompressed;

    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={breadcrumbLinkVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const [breadcrumbPageVariant, resolveBreadcrumbPageVariantProps] = vcn({
  base: "font-medium text-neutral-950 dark:text-neutral-50",
  variants: {},
  defaults: {},
});

interface BreadcrumbPageProps
  extends VariantProps<typeof breadcrumbPageVariant>,
    Omit<React.ComponentPropsWithoutRef<"span">, "className">,
    AsChild {}

const BreadcrumbPage = React.forwardRef<HTMLElement, BreadcrumbPageProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveBreadcrumbPageVariantProps(props);
    const {
      asChild,
      "aria-current": ariaCurrent,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const Comp = asChild ? Slot : "span";

    return (
      <Comp
        ref={ref}
        aria-current={ariaCurrent ?? "page"}
        className={breadcrumbPageVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const [breadcrumbSeparatorVariant, resolveBreadcrumbSeparatorVariantProps] =
  vcn({
    base: "inline-flex items-center text-neutral-400 dark:text-neutral-600",
    variants: {},
    defaults: {},
  });

interface BreadcrumbSeparatorProps
  extends VariantProps<typeof breadcrumbSeparatorVariant>,
    Omit<React.ComponentPropsWithoutRef<"li">, "className"> {}

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  BreadcrumbSeparatorProps
>((props, ref) => {
  const [variantProps, otherPropsExtracted] =
    resolveBreadcrumbSeparatorVariantProps(props);

  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      className={breadcrumbSeparatorVariant(variantProps)}
      {...otherPropsExtracted}
    >
      {props.children ?? "/"}
    </li>
  );
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};

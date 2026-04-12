import { type AsChild, Slot, vcn } from "@pswui-lib";
import React from "react";

const paginationColors = {
  border: "border-neutral-300 dark:border-neutral-700",
  background: {
    default: "bg-white dark:bg-black",
    hover: "hover:bg-neutral-100 dark:hover:bg-neutral-900",
    active:
      "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900",
  },
  text: "text-neutral-700 dark:text-neutral-200",
  muted: "text-neutral-500 dark:text-neutral-400",
  outline: "focus-visible:outline-black/10 dark:focus-visible:outline-white/20",
};

const [paginationLinkVariants] = vcn({
  base: `inline-flex min-h-9 min-w-9 items-center justify-center gap-1 rounded-md border px-3 text-sm font-medium outline outline-1 outline-transparent outline-offset-2 transition-colors ${paginationColors.outline}`,
  variants: {
    current: {
      true: `border-transparent ${paginationColors.background.active}`,
      false: `${paginationColors.border} ${paginationColors.background.default} ${paginationColors.background.hover} ${paginationColors.text}`,
    },
    disabledStyle: {
      true: "cursor-not-allowed opacity-50",
      false: "cursor-pointer",
    },
  },
  defaults: {
    current: false,
    disabledStyle: false,
  },
});

interface PaginationProps
  extends React.ComponentPropsWithoutRef<"nav">,
    AsChild {}

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (props, ref) => {
    const {
      asChild,
      className,
      "aria-label": ariaLabel,
      ...otherProps
    } = props;
    const Comp = asChild ? Slot : "nav";

    return (
      <Comp
        ref={ref}
        aria-label={ariaLabel ?? "Pagination"}
        className={`flex w-full justify-center ${className ?? ""}`.trim()}
        {...otherProps}
      />
    );
  },
);
Pagination.displayName = "Pagination";

interface PaginationContentProps
  extends React.ComponentPropsWithoutRef<"ul">,
    AsChild {}

const PaginationContent = React.forwardRef<
  HTMLUListElement,
  PaginationContentProps
>((props, ref) => {
  const { asChild, className, ...otherProps } = props;
  const Comp = asChild ? Slot : "ul";

  return (
    <Comp
      ref={ref}
      className={`m-0 flex flex-wrap items-center gap-1 p-0 list-none ${className ?? ""}`.trim()}
      {...otherProps}
    />
  );
});
PaginationContent.displayName = "PaginationContent";

interface PaginationItemProps
  extends React.ComponentPropsWithoutRef<"li">,
    AsChild {}

const PaginationItem = React.forwardRef<HTMLLIElement, PaginationItemProps>(
  (props, ref) => {
    const { asChild, className, ...otherProps } = props;
    const Comp = asChild ? Slot : "li";

    return (
      <Comp
        ref={ref}
        className={className}
        {...otherProps}
      />
    );
  },
);
PaginationItem.displayName = "PaginationItem";

interface PaginationLinkProps
  extends React.ComponentPropsWithoutRef<"a">,
    AsChild {
  active?: boolean;
  disabled?: boolean;
}

const PaginationLink = React.forwardRef<HTMLAnchorElement, PaginationLinkProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      className,
      active,
      disabled,
      href,
      onClick,
      role,
      tabIndex,
      "aria-current": ariaCurrent,
      "aria-disabled": ariaDisabled,
      ...otherProps
    } = props;
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        href={disabled ? undefined : href}
        role={role ?? "link"}
        aria-current={active ? ariaCurrent ?? "page" : ariaCurrent}
        aria-disabled={disabled ? true : ariaDisabled}
        tabIndex={disabled ? -1 : tabIndex}
        className={paginationLinkVariants({
          current: active,
          disabledStyle: disabled,
          className,
        })}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          if (disabled) {
            event.preventDefault();
            return;
          }

          onClick?.(event);
        }}
        {...otherProps}
      >
        {children}
      </Comp>
    );
  },
);
PaginationLink.displayName = "PaginationLink";

interface PaginationPreviousProps
  extends Omit<PaginationLinkProps, "children"> {
  children?: React.ReactNode;
}

const PaginationPrevious = React.forwardRef<
  HTMLAnchorElement,
  PaginationPreviousProps
>((props, ref) => {
  const { children, "aria-label": ariaLabel, ...otherProps } = props;

  return (
    <PaginationLink
      ref={ref}
      aria-label={ariaLabel ?? "Previous page"}
      {...otherProps}
    >
      <span aria-hidden="true">&lt;</span>
      <span>{children ?? "Previous"}</span>
    </PaginationLink>
  );
});
PaginationPrevious.displayName = "PaginationPrevious";

interface PaginationNextProps extends Omit<PaginationLinkProps, "children"> {
  children?: React.ReactNode;
}

const PaginationNext = React.forwardRef<HTMLAnchorElement, PaginationNextProps>(
  (props, ref) => {
    const { children, "aria-label": ariaLabel, ...otherProps } = props;

    return (
      <PaginationLink
        ref={ref}
        aria-label={ariaLabel ?? "Next page"}
        {...otherProps}
      >
        <span>{children ?? "Next"}</span>
        <span aria-hidden="true">&gt;</span>
      </PaginationLink>
    );
  },
);
PaginationNext.displayName = "PaginationNext";

interface PaginationEllipsisProps
  extends React.ComponentPropsWithoutRef<"span">,
    AsChild {}

const PaginationEllipsis = React.forwardRef<
  HTMLSpanElement,
  PaginationEllipsisProps
>((props, ref) => {
  const {
    asChild,
    className,
    "aria-hidden": ariaHidden,
    children,
    ...otherProps
  } = props;
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      ref={ref}
      aria-hidden={ariaHidden ?? true}
      className={`inline-flex min-h-9 min-w-9 items-center justify-center text-sm ${paginationColors.muted} ${className ?? ""}`.trim()}
      {...otherProps}
    >
      {children ?? "..."}
    </Comp>
  );
});
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};

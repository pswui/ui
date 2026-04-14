import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

import {
  AccordionContext,
  AccordionItemContext,
  useAccordionContext,
  useAccordionItemContext,
} from "./Context";

const [accordionVariant, resolveAccordionVariantProps] = vcn({
  base: "overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-950 shadow-sm dark:border-neutral-800 dark:bg-black dark:text-neutral-50",
  variants: {},
  defaults: {},
});

interface AccordionProps
  extends VariantProps<typeof accordionVariant>,
    React.ComponentPropsWithoutRef<"div"> {
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveAccordionVariantProps(props);
    const {
      defaultValue,
      value,
      onValueChange,
      collapsible = false,
      ...otherPropsExtracted
    } = otherPropsCompressed;
    const [internalValue, setInternalValue] = React.useState<string | null>(
      defaultValue ?? null,
    );

    const currentValue = value !== undefined ? value : internalValue;

    function onItemToggle(nextValue: string) {
      const resolvedValue =
        currentValue === nextValue
          ? collapsible
            ? null
            : nextValue
          : nextValue;

      if (value === undefined) {
        setInternalValue(resolvedValue);
      }

      onValueChange?.(resolvedValue);
    }

    return (
      <AccordionContext.Provider
        value={{
          value: currentValue,
          collapsible,
          onItemToggle,
        }}
      >
        <div
          {...otherPropsExtracted}
          ref={ref}
          className={accordionVariant(variantProps)}
        />
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = "Accordion";

const [accordionItemVariant, resolveAccordionItemVariantProps] = vcn({
  base: "overflow-hidden border-b border-neutral-200 last:border-b-0 dark:border-neutral-800",
  variants: {},
  defaults: {},
});

interface AccordionItemProps
  extends VariantProps<typeof accordionItemVariant>,
    React.ComponentPropsWithoutRef<"div"> {
  value: string;
  disabled?: boolean;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveAccordionItemVariantProps(props);
    const {
      value,
      disabled = false,
      ...otherPropsExtracted
    } = otherPropsCompressed;
    const { value: activeValue, onItemToggle } = useAccordionContext();
    const triggerId = React.useId();
    const contentId = React.useId();
    const open = activeValue === value;

    return (
      <AccordionItemContext.Provider
        value={{
          value,
          open,
          disabled,
          triggerId,
          contentId,
          onToggle: () => {
            if (disabled) {
              return;
            }

            onItemToggle(value);
          },
        }}
      >
        <div
          {...otherPropsExtracted}
          ref={ref}
          data-disabled={disabled ? "" : undefined}
          data-state={open ? "open" : "closed"}
          className={accordionItemVariant(variantProps)}
        />
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = "AccordionItem";

const [accordionTriggerVariant, resolveAccordionTriggerVariantProps] = vcn({
  base: "flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium transition-colors outline outline-1 outline-transparent outline-offset-2 hover:bg-neutral-50 focus-visible:outline-black/10 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-950 dark:focus-visible:outline-white/20",
  variants: {
    open: {
      true: "bg-neutral-50 dark:bg-neutral-950",
      false: "",
    },
  },
  defaults: {
    open: false,
  },
});

interface AccordionTriggerProps
  extends Omit<VariantProps<typeof accordionTriggerVariant>, "open">,
    Omit<React.ComponentPropsWithoutRef<"button">, "type"> {}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveAccordionTriggerVariantProps(props);
  const { onClick, children, ...otherPropsExtracted } = otherPropsCompressed;
  const { open, disabled, triggerId, contentId, onToggle } =
    useAccordionItemContext();

  return (
    <h3 className="flex">
      <button
        {...otherPropsExtracted}
        ref={ref}
        id={triggerId}
        type="button"
        disabled={disabled}
        aria-controls={contentId}
        aria-expanded={open}
        className={accordionTriggerVariant({
          ...variantProps,
          open,
        })}
        onClick={(event) => {
          onToggle();
          onClick?.(event);
        }}
      >
        <span>{children}</span>
        <span
          aria-hidden="true"
          className="text-lg leading-none"
        >
          {open ? "-" : "+"}
        </span>
      </button>
    </h3>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const [accordionContentVariant, resolveAccordionContentVariantProps] = vcn({
  base: "px-4 pb-4 text-sm text-neutral-600 dark:text-neutral-300",
  variants: {},
  defaults: {},
});

interface AccordionContentProps
  extends VariantProps<typeof accordionContentVariant>,
    React.ComponentPropsWithoutRef<"div"> {}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>((props, ref) => {
  const [variantProps, otherPropsCompressed] =
    resolveAccordionContentVariantProps(props);
  const { open, triggerId, contentId } = useAccordionItemContext();

  return (
    <div
      {...otherPropsCompressed}
      ref={ref}
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!open}
      data-state={open ? "open" : "closed"}
      className={accordionContentVariant(variantProps)}
    />
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

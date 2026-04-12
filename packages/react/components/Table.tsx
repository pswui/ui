import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [tableVariant, resolveTableVariantProps] = vcn({
  base: "w-full caption-bottom text-sm",
  variants: {},
  defaults: {},
});

interface TableProps
  extends VariantProps<typeof tableVariant>,
    React.ComponentPropsWithoutRef<"table"> {}

const Table = React.forwardRef<HTMLTableElement, TableProps>((props, ref) => {
  const [variantProps, otherPropsExtracted] = resolveTableVariantProps(props);

  return (
    <table
      ref={ref}
      className={tableVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
Table.displayName = "Table";

const [tableHeaderVariant, resolveTableHeaderVariantProps] = vcn({
  base: "[&_tr]:border-b [&_tr]:border-neutral-200 dark:[&_tr]:border-neutral-800",
  variants: {},
  defaults: {},
});

interface TableHeaderProps
  extends VariantProps<typeof tableHeaderVariant>,
    React.ComponentPropsWithoutRef<"thead"> {}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableHeaderVariantProps(props);

    return (
      <thead
        ref={ref}
        className={tableHeaderVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableHeader.displayName = "TableHeader";

const [tableBodyVariant, resolveTableBodyVariantProps] = vcn({
  base: "[&_tr:last-child]:border-0",
  variants: {},
  defaults: {},
});

interface TableBodyProps
  extends VariantProps<typeof tableBodyVariant>,
    React.ComponentPropsWithoutRef<"tbody"> {}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableBodyVariantProps(props);

    return (
      <tbody
        ref={ref}
        className={tableBodyVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableBody.displayName = "TableBody";

const [tableFooterVariant, resolveTableFooterVariantProps] = vcn({
  base: "border-t border-neutral-200 bg-neutral-50/50 font-medium dark:border-neutral-800 dark:bg-neutral-950/50 [&>tr]:last:border-b-0",
  variants: {},
  defaults: {},
});

interface TableFooterProps
  extends VariantProps<typeof tableFooterVariant>,
    React.ComponentPropsWithoutRef<"tfoot"> {}

const TableFooter = React.forwardRef<HTMLTableSectionElement, TableFooterProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableFooterVariantProps(props);

    return (
      <tfoot
        ref={ref}
        className={tableFooterVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableFooter.displayName = "TableFooter";

const [tableRowVariant, resolveTableRowVariantProps] = vcn({
  base: "border-b border-neutral-200 transition-colors hover:bg-neutral-50/50 data-[state=selected]:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900/50 dark:data-[state=selected]:bg-neutral-900",
  variants: {},
  defaults: {},
});

interface TableRowProps
  extends VariantProps<typeof tableRowVariant>,
    React.ComponentPropsWithoutRef<"tr"> {}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableRowVariantProps(props);

    return (
      <tr
        ref={ref}
        className={tableRowVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableRow.displayName = "TableRow";

const [tableHeadVariant, resolveTableHeadVariantProps] = vcn({
  base: "h-10 px-4 text-left align-middle font-medium text-neutral-500 dark:text-neutral-400 [&:has([role=checkbox])]:pr-0",
  variants: {},
  defaults: {},
});

interface TableHeadProps
  extends VariantProps<typeof tableHeadVariant>,
    React.ComponentPropsWithoutRef<"th"> {}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableHeadVariantProps(props);

    return (
      <th
        ref={ref}
        className={tableHeadVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableHead.displayName = "TableHead";

const [tableCellVariant, resolveTableCellVariantProps] = vcn({
  base: "p-4 align-middle [&:has([role=checkbox])]:pr-0",
  variants: {},
  defaults: {},
});

interface TableCellProps
  extends VariantProps<typeof tableCellVariant>,
    React.ComponentPropsWithoutRef<"td"> {}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  (props, ref) => {
    const [variantProps, otherPropsExtracted] =
      resolveTableCellVariantProps(props);

    return (
      <td
        ref={ref}
        className={tableCellVariant(variantProps)}
        {...otherPropsExtracted}
      />
    );
  },
);
TableCell.displayName = "TableCell";

const [tableCaptionVariant, resolveTableCaptionVariantProps] = vcn({
  base: "mt-4 text-sm text-neutral-500 dark:text-neutral-400",
  variants: {},
  defaults: {},
});

interface TableCaptionProps
  extends VariantProps<typeof tableCaptionVariant>,
    React.ComponentPropsWithoutRef<"caption"> {}

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>((props, ref) => {
  const [variantProps, otherPropsExtracted] =
    resolveTableCaptionVariantProps(props);

  return (
    <caption
      ref={ref}
      className={tableCaptionVariant(variantProps)}
      {...otherPropsExtracted}
    />
  );
});
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};

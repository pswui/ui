import { type AsChild, Slot, type VariantProps, vcn } from "@pswui-lib";
import React from "react";

import { type Tab, TabContext, type TabContextBody } from "./Context";

interface TabProviderProps {
  defaultName: string;
  children: React.ReactNode;
}

const TabProvider = ({ defaultName, children }: TabProviderProps) => {
  const state = React.useState<TabContextBody>({
    tabs: [],
    active: [0, defaultName],
  });

  return <TabContext.Provider value={state}>{children}</TabContext.Provider>;
};

const [TabListVariant, resolveTabListVariantProps] = vcn({
  base: "flex flex-row bg-gray-100 dark:bg-neutral-800 rounded-lg p-1.5 gap-1",
  variants: {},
  defaults: {},
});

interface TabListProps
  extends VariantProps<typeof TabListVariant>,
    React.HTMLAttributes<HTMLDivElement> {}

const TabList = (props: TabListProps) => {
  const [variantProps, restProps] = resolveTabListVariantProps(props);

  return (
    <div
      className={TabListVariant(variantProps)}
      {...restProps}
    />
  );
};

const [TabTriggerVariant, resolveTabTriggerVariantProps] = vcn({
  base: "py-1.5 rounded-md flex-grow transition-all text-sm",
  variants: {
    active: {
      true: "bg-white/100 dark:bg-black/100 text-black dark:text-white",
      false:
        "bg-white/0 dark:bg-black/0 text-black dark:text-white hover:bg-white/50 dark:hover:bg-black/50",
    },
  },
  defaults: {
    active: false,
  },
});

interface TabTriggerProps
  extends Omit<VariantProps<typeof TabTriggerVariant>, "active">,
    React.HTMLAttributes<HTMLButtonElement>,
    Tab,
    AsChild {}

const TabTrigger = (props: TabTriggerProps) => {
  const [variantProps, restPropsBeforeParse] =
    resolveTabTriggerVariantProps(props);
  const { name, ...restProps } = restPropsBeforeParse;
  const [context, setContext] = React.useContext(TabContext);

  React.useEffect(() => {
    setContext((prev) => {
      return {
        ...prev,
        tabs: [...prev.tabs, { name }],
      };
    });

    return () => {
      setContext((prev) => {
        return {
          ...prev,
          tabs: prev.tabs.filter((tab) => tab.name !== name),
        };
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, setContext]);

  const Comp = props.asChild ? Slot : "button";

  return (
    <Comp
      className={TabTriggerVariant({
        ...variantProps,
        active: context.active[1] === name,
      })}
      onClick={() =>
        setContext((prev) => {
          return {
            ...prev,
            active: [prev.tabs.findIndex((tab) => tab.name === name), name],
          };
        })
      }
      {...restProps}
    />
  );
};

const [tabContentVariant, resolveTabContentVariantProps] = vcn({
  base: "",
  variants: {},
  defaults: {},
});

interface TabContentProps extends VariantProps<typeof tabContentVariant> {
  name: string;
  children: Exclude<
    React.ReactNode,
    string | number | boolean | Iterable<React.ReactNode> | null | undefined
  >;
}

const TabContent = (props: TabContentProps) => {
  const [variantProps, restPropsBeforeParse] =
    resolveTabContentVariantProps(props);
  const { name, ...restProps } = restPropsBeforeParse;
  const [context] = React.useContext(TabContext);

  if (context.active[1] !== name) {
    return null;
  }

  return (
    <Slot
      className={tabContentVariant({
        ...variantProps,
      })}
      {...restProps}
    />
  );
};

export { TabProvider, TabList, TabTrigger, TabContent };

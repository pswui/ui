import { AsChild, Slot, VariantProps, vcn } from "../lib/shared@1.0.0";
import React from "react";

interface Tab {
  name: string;
}

interface TabContextBody {
  tabs: Tab[];
  active: [number, string] /* index, name */;
}

const TabContext = React.createContext<
  [TabContextBody, React.Dispatch<React.SetStateAction<TabContextBody>>]
>([
  {
    tabs: [],
    active: [0, ""],
  },
  () => {
    if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
      console.warn(
        "It seems like you're using TabContext outside of provider.",
      );
    }
  },
]);

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

/**
 * Provides current state for tab, using context.
 * Also provides functions to control state.
 */
const useTabState = () => {
  const [state, setState] = React.useContext(TabContext);

  function getActiveTab() {
    return state.active;
  }

  function setActiveTab(name: string): void;
  function setActiveTab(index: number): void;
  function setActiveTab(param: string | number) {
    if (typeof param === "number") {
      if (param < 0 || param >= state.tabs.length) {
        if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
          console.error(
            `Invalid index passed to setActiveTab: ${param}, valid indices are 0 to ${
              state.tabs.length - 1
            }`,
          );
        }
        return;
      }

      setState((prev) => {
        return {
          ...prev,
          active: [param, prev.tabs[param].name],
        };
      });
    } else if (typeof param === "string") {
      const index = state.tabs.findIndex((tab) => tab.name === param);
      if (index === -1) {
        if (process.env.NODE_ENV && process.env.NODE_ENV === "development") {
          console.error(
            `Invalid name passed to setActiveTab: ${param}, valid names are ${state.tabs
              .map((tab) => tab.name)
              .join(", ")}`,
          );
        }
        return;
      }

      setActiveTab(index);
    }
  }

  function setPreviousActive() {
    if (state.active[0] === 0) {
      return;
    }
    setActiveTab(state.active[0] - 1);
  }

  function setNextActive() {
    if (state.active[0] === state.tabs.length - 1) {
      return;
    }
    setActiveTab(state.active[0] + 1);
  }

  return {
    getActiveTab,
    setActiveTab,
    setPreviousActive,
    setNextActive,
  };
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

  return <div className={TabListVariant(variantProps)} {...restProps} />;
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
  }, [name]);

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

  if (context.active[1] === name) {
    return (
      <Slot
        className={tabContentVariant({
          ...variantProps,
        })}
        {...restProps}
      />
    );
  } else {
    return null;
  }
};

export { TabProvider, useTabState, TabList, TabTrigger, TabContent };

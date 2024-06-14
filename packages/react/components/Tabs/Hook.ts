import React from "react";

import { TabContext } from "./Context";

/**
 * Provides current state for tab, using context.
 * Also provides functions to control state.
 */
export const useTabState = () => {
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

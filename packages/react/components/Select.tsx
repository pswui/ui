import { type VariantProps, vcn } from "@pswui-lib";
import React from "react";

const [selectTriggerVariant, resolveSelectTriggerVariantProps] = vcn({
  base: "group/select inline-flex min-h-10 items-center justify-between gap-3 rounded-md border border-neutral-400 bg-neutral-50 px-3 py-2 text-left text-sm ring-1 ring-transparent outline-hidden transition-all duration-200 hover:bg-neutral-100 focus-visible:ring-current disabled:cursor-not-allowed disabled:brightness-50 disabled:saturate-0 dark:border-neutral-600 dark:bg-neutral-900 dark:hover:bg-neutral-800",
  variants: {
    full: {
      true: "w-full",
      false: "min-w-56 w-fit",
    },
  },
  defaults: {
    full: false,
  },
});

const [selectContentVariant] = vcn({
  base: "absolute left-0 top-[calc(100%+0.375rem)] z-20 w-full overflow-hidden rounded-md border border-neutral-200 bg-white p-1 shadow-lg transition-all duration-150 dark:border-neutral-800 dark:bg-black",
  variants: {
    opened: {
      true: "visible translate-y-0 opacity-100",
      false: "invisible -translate-y-1 opacity-0 pointer-events-none",
    },
  },
  defaults: {
    opened: false,
  },
});

interface SelectOption {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
}

const getFirstEnabledIndex = (options: SelectOption[]) =>
  options.findIndex((option) => !option.disabled);

const getLastEnabledIndex = (options: SelectOption[]) => {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

const getNextEnabledIndex = (
  options: SelectOption[],
  currentIndex: number,
  direction: 1 | -1,
) => {
  for (
    let index = currentIndex + direction;
    index >= 0 && index < options.length;
    index += direction
  ) {
    if (!options[index]?.disabled) {
      return index;
    }
  }

  return -1;
};

export interface SelectProps
  extends VariantProps<typeof selectTriggerVariant>,
    Omit<
      React.ComponentPropsWithoutRef<"button">,
      "children" | "defaultValue" | "name" | "onChange" | "type" | "value"
    > {
  defaultValue?: string;
  name?: string;
  onValueChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: React.ReactNode;
  value?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (props, ref) => {
    const [variantProps, otherPropsCompressed] =
      resolveSelectTriggerVariantProps(props);
    const {
      defaultValue,
      disabled,
      id,
      name,
      onClick,
      onKeyDown,
      onValueChange,
      options,
      placeholder = "Select an option",
      value: propValue,
      ...otherPropsExtracted
    } = otherPropsCompressed;

    const generatedId = React.useId();
    const buttonId = id ?? generatedId;
    const listboxId = `${buttonId}-listbox`;
    const isControlled = propValue !== undefined;
    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(defaultValue);
    const [opened, setOpened] = React.useState(false);
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const listboxRef = React.useRef<HTMLDivElement | null>(null);
    const rootRef = React.useRef<HTMLDivElement | null>(null);

    const value = isControlled ? propValue : uncontrolledValue;
    const selectedIndex = options.findIndex((option) => option.value === value);
    const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;
    const firstEnabledIndex = getFirstEnabledIndex(options);
    const lastEnabledIndex = getLastEnabledIndex(options);
    const [highlightedIndex, setHighlightedIndex] = React.useState(() =>
      selectedIndex >= 0 ? selectedIndex : firstEnabledIndex,
    );

    React.useEffect(() => {
      if (!opened) {
        setHighlightedIndex(
          selectedIndex >= 0 ? selectedIndex : getFirstEnabledIndex(options),
        );
      }
    }, [opened, options, selectedIndex]);

    React.useEffect(() => {
      if (!opened) {
        return;
      }

      listboxRef.current?.focus();

      const handleOutsideMouseDown = (event: MouseEvent) => {
        if (rootRef.current?.contains(event.target as Node)) {
          return;
        }

        setOpened(false);
      };

      document.addEventListener("mousedown", handleOutsideMouseDown);

      return () => {
        document.removeEventListener("mousedown", handleOutsideMouseDown);
      };
    }, [opened]);

    const setRefs = (element: HTMLButtonElement | null) => {
      buttonRef.current = element;
      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    const openSelect = (nextHighlightedIndex: number) => {
      setHighlightedIndex(nextHighlightedIndex);
      setOpened(true);
    };

    const closeSelect = () => {
      setOpened(false);
      buttonRef.current?.focus();
    };

    const commitValue = (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      onValueChange?.(nextValue);
      closeSelect();
    };

    const moveHighlightedIndex = (direction: 1 | -1) => {
      const nextIndex = getNextEnabledIndex(
        options,
        highlightedIndex,
        direction,
      );
      if (nextIndex >= 0) {
        setHighlightedIndex(nextIndex);
      }
    };

    const resolvedFull = variantProps.full ?? false;
    const activeDescendant =
      highlightedIndex >= 0
        ? `${buttonId}-option-${highlightedIndex}`
        : undefined;

    return (
      <div
        ref={rootRef}
        data-state={opened ? "open" : "closed"}
        className={`relative ${resolvedFull ? "w-full" : "w-fit"}`}
      >
        {name ? (
          <input
            type="hidden"
            name={name}
            value={selectedOption?.value ?? ""}
            disabled={disabled}
          />
        ) : null}
        <button
          {...otherPropsExtracted}
          ref={setRefs}
          id={buttonId}
          type="button"
          disabled={disabled}
          aria-controls={listboxId}
          aria-expanded={opened}
          aria-haspopup="listbox"
          className={selectTriggerVariant(variantProps)}
          onClick={(event) => {
            onClick?.(event);

            if (event.defaultPrevented || disabled) {
              return;
            }

            if (opened) {
              setOpened(false);
              return;
            }

            openSelect(selectedIndex >= 0 ? selectedIndex : firstEnabledIndex);
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);

            if (event.defaultPrevented || disabled) {
              return;
            }

            switch (event.key) {
              case "ArrowDown":
                event.preventDefault();
                if (opened) {
                  moveHighlightedIndex(1);
                  break;
                }
                openSelect(
                  selectedIndex >= 0
                    ? selectedIndex
                    : getFirstEnabledIndex(options),
                );
                break;
              case "ArrowUp":
                event.preventDefault();
                if (opened) {
                  moveHighlightedIndex(-1);
                  break;
                }
                openSelect(
                  selectedIndex >= 0
                    ? selectedIndex
                    : getLastEnabledIndex(options),
                );
                break;
              case "Home":
                event.preventDefault();
                if (opened) {
                  setHighlightedIndex(firstEnabledIndex);
                  break;
                }
                openSelect(firstEnabledIndex);
                break;
              case "End":
                event.preventDefault();
                if (opened) {
                  setHighlightedIndex(lastEnabledIndex);
                  break;
                }
                openSelect(lastEnabledIndex);
                break;
              case "Enter":
              case " ":
                if (!opened) {
                  break;
                }
                event.preventDefault();
                if (
                  highlightedIndex >= 0 &&
                  options[highlightedIndex] &&
                  !options[highlightedIndex]?.disabled
                ) {
                  commitValue(options[highlightedIndex].value);
                }
                break;
              case "Escape":
                if (!opened) {
                  break;
                }
                event.preventDefault();
                closeSelect();
                break;
            }
          }}
        >
          <span className={selectedOption ? "" : "opacity-60"}>
            {selectedOption?.label ?? placeholder}
          </span>
          <span
            aria-hidden
            className={`size-4 shrink-0 opacity-60 transition-transform duration-150 ${
              opened ? "rotate-180" : ""
            }`}
          >
            v
          </span>
        </button>
        <div
          className={selectContentVariant({ opened })}
          aria-hidden={opened ? undefined : true}
        >
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            tabIndex={-1}
            aria-activedescendant={activeDescendant}
            aria-labelledby={buttonId}
            className="max-h-60 overflow-y-auto outline-hidden"
            onKeyDown={(event) => {
              switch (event.key) {
                case "ArrowDown": {
                  event.preventDefault();
                  moveHighlightedIndex(1);
                  break;
                }
                case "ArrowUp": {
                  event.preventDefault();
                  moveHighlightedIndex(-1);
                  break;
                }
                case "Home":
                  event.preventDefault();
                  setHighlightedIndex(firstEnabledIndex);
                  break;
                case "End":
                  event.preventDefault();
                  setHighlightedIndex(lastEnabledIndex);
                  break;
                case "Enter":
                case " ": {
                  event.preventDefault();
                  const option = options[highlightedIndex];
                  if (option && !option.disabled) {
                    commitValue(option.value);
                  }
                  break;
                }
                case "Escape":
                  event.preventDefault();
                  closeSelect();
                  break;
                case "Tab":
                  setOpened(false);
                  break;
              }
            }}
          >
            {options.map((option, index) => {
              const isHighlighted = index === highlightedIndex;
              const isSelected = option.value === selectedOption?.value;

              return (
                <div
                  key={option.value}
                  id={`${buttonId}-option-${index}`}
                  role="option"
                  aria-disabled={option.disabled ? true : undefined}
                  aria-selected={isSelected}
                  tabIndex={-1}
                  data-highlighted={isHighlighted ? "" : undefined}
                  data-selected={isSelected ? "" : undefined}
                  className={`flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                    option.disabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  } ${
                    isHighlighted ? "bg-neutral-100 dark:bg-neutral-900" : ""
                  } ${
                    isSelected
                      ? "font-medium text-neutral-950 dark:text-neutral-50"
                      : ""
                  }`}
                  onMouseMove={() => {
                    if (!option.disabled) {
                      setHighlightedIndex(index);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (!option.disabled) {
                        commitValue(option.value);
                      }
                    }
                  }}
                  onClick={() => {
                    if (!option.disabled) {
                      commitValue(option.value);
                    }
                  }}
                >
                  {option.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";

export type { SelectOption };
export { Select };

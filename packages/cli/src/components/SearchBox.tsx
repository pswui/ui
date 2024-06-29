import { Box, type Key, Text, useApp, useInput } from "ink";
import Input from "ink-text-input";
import React, { useEffect, useState } from "react";
import { getSuggestion } from "../helpers/search.js";
import { Divider } from "./Divider.js";

export function SearchBox<T extends { key: string; displayName: string }>({
  components,
  helper,
  initialQuery,
  onKeyDown,
  onChange,
  onSubmit,
}: {
  components: T[];
  helper: string;
  initialQuery?: string;
  onKeyDown?: (i: string, k: Key, app: ReturnType<typeof useApp>) => void;
  onChange?: (item: T) => void;
  onSubmit?: (item: T) => void;
}) {
  const [query, setQuery] = useState<string>(initialQuery ?? "");
  const [queryMode, setQueryMode] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selected, setSelected] = useState<number>(-1);

  useEffect(() => {
    if (queryMode) {
      setLoading(true);
      getSuggestion(
        components.map(({ key }) => key),
        query,
      ).then((result) => {
        setSuggestions(result);
        setSelected(-1);
      });
    }
  }, [query, queryMode, components]);

  useEffect(() => {
    if (onChange) {
      const found = components.find(({ key }) => key === suggestions[selected]);
      found && onChange(found);
    }
  }, [selected, suggestions, onChange, components]);

  const app = useApp();

  useInput((i, k) => {
    if (k.downArrow) {
      setSelected((p) => (p >= suggestions.length - 1 ? 0 : p + 1));
      setQueryMode(false);
    }
    if (k.upArrow) {
      setSelected((p) => (p <= 0 ? suggestions.length - 1 : p - 1));
      setQueryMode(false);
    }
    onKeyDown?.(i, k, app);
  });

  useEffect(() => {
    if (!queryMode && suggestions[selected]) {
      setQuery(suggestions[selected]);
    }
  }, [queryMode, selected, suggestions]);

  return (
    <Box
      width={50}
      display={"flex"}
      flexDirection={"column"}
    >
      <Text color={"gray"}>{helper}</Text>
      <Box
        display={"flex"}
        flexDirection={"row"}
      >
        <Box
          marginRight={1}
          display={"flex"}
          flexDirection={"row"}
        >
          <Text color={"greenBright"}>Search?</Text>
        </Box>
        <Input
          value={query}
          onChange={(v) => {
            setQueryMode(true);
            setQuery(v);
          }}
          showCursor
          placeholder={" query"}
          onSubmit={() => {
            const found = components.find(
              ({ key }) => key === suggestions[selected],
            );
            found && onSubmit?.(found);
          }}
        />
      </Box>
      <Divider
        title={
          isLoading ? "Loading..." : `${suggestions.length} components found.`
        }
      />
      <Box
        display={"flex"}
        flexDirection={"column"}
      >
        {suggestions.map((name, index) => {
          return (
            <Box key={name}>
              <Text color={selected === index ? undefined : "gray"}>
                {
                  components[components.findIndex(({ key }) => key === name)]
                    .displayName
                }
              </Text>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

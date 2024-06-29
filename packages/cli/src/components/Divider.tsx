import { Box, Text } from "ink";
import React from "react";

export function Divider({
  width = 50,
  padding = 1,
  title,
}: { width?: number; padding?: number; title: string }) {
  const length = Math.floor((width - title.length - padding * 2) / 2);

  return (
    <Box>
      {Array.from(Array(length)).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: there's nothing to be key except index
        <Text key={i}>─</Text>
      ))}
      {Array.from(Array(padding)).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: there's nothing to be key except index
        <Text key={i}> </Text>
      ))}
      <Text>{title}</Text>
      {Array.from(Array(padding)).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: there's nothing to be key except index
        <Text key={i}> </Text>
      ))}
      {Array.from(Array(length)).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: there's nothing to be key except index
        <Text key={i}>─</Text>
      ))}
    </Box>
  );
}

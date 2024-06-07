import React from 'react'
import {Box, Text} from 'ink'

export function Divider({width = 50, padding = 1, title}: {width?: number; padding?: number; title: string}) {
  const length = Math.floor((width - title.length - padding * 2) / 2)

  return (
    <Box>
      {Array.from(Array(length)).map((_, i) => (
        <Text key={i}>─</Text>
      ))}
      {Array.from(Array(padding)).map((_, i) => (
        <Text key={i}> </Text>
      ))}
      <Text>{title}</Text>
      {Array.from(Array(padding)).map((_, i) => (
        <Text key={i}> </Text>
      ))}
      {Array.from(Array(length)).map((_, i) => (
        <Text key={i}>─</Text>
      ))}
    </Box>
  )
}

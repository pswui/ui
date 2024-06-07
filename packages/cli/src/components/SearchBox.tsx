import React, {useEffect, useState} from 'react'
import {getSuggestion} from '../helpers/search.js'
import Input from 'ink-text-input'
import {Divider} from './Divider.js'
import Spinner from 'ink-spinner'
import {Box, Text, useInput, useApp, type Key} from 'ink'

export function SearchBox<T extends {key: string; displayName: string}>({
  components,
  helper,
  initialQuery,
  onKeyDown,
  onChange,
}: {
  components: T[]
  helper: string
  initialQuery?: string
  onKeyDown?: (i: string, k: Key, app: ReturnType<typeof useApp>) => void
  onChange?: (item: T) => void
}) {
  const [query, setQuery] = useState<string>(initialQuery ?? '')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [selected, setSelected] = useState<number>(0)

  useEffect(() => {
    setLoading(true)
    getSuggestion(
      components.map(({key}) => key),
      query,
    ).then((result) => {
      setSuggestions(result)
      setLoading(false)
      if (result.length >= selected) {
        setSelected(result.length - 1)
      }
    })
  }, [query])

  useEffect(() => {
    if (onChange) {
      const found = components.find(({key}) => key === suggestions[selected])
      found && onChange(found)
    }
  }, [selected, onChange])

  const app = useApp()

  useInput((i, k) => {
    if (k.downArrow) {
      setSelected((p) => (p >= suggestions.length - 1 ? 0 : p + 1))
    }
    if (k.upArrow) {
      setSelected((p) => (p <= 0 ? suggestions.length - 1 : p - 1))
    }
    onKeyDown?.(i, k, app)
  })

  return (
    <Box width={50} display={'flex'} flexDirection={'column'} columnGap={4}>
      <Text color={'gray'}>{helper}</Text>
      <Box display={'flex'} flexDirection={'row'} borderStyle={'double'}>
        <Box marginRight={2}>
          <Text color={'greenBright'}>?</Text>
        </Box>
        <Input value={query} onChange={(v) => setQuery(v)} />
      </Box>
      <Divider title={isLoading ? 'Loading...' : `${suggestions.length} components found.`} />
      {isLoading ? (
        <Spinner />
      ) : (
        <Box display={'flex'} flexDirection={'column'} columnGap={1}>
          {suggestions.map((name, index) => {
            return (
              <Box borderStyle={'round'} key={name}>
                <Text backgroundColor={selected === index ? 'white' : undefined}>
                  {components[components.findIndex(({key}) => key === name)].displayName}
                </Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

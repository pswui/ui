import React, {useEffect, useState} from 'react'
import {getSuggestion} from '../helpers/search.js'
import Input from 'ink-text-input'
import {Divider} from './Divider.js'
import Spinner from 'ink-spinner'
import {Box, Text} from 'ink'

export function SearchBox({components}: {components: string[]}) {
  const [query, setQuery] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    setLoading(true)
    getSuggestion(components, query).then((result) => {
      setSuggestions(result)
      setLoading(false)
    })
  }, [query])

  return (
    <Box width={50} display={'flex'} flexDirection={'column'} columnGap={4}>
      <Box display={'flex'} flexDirection={'row'}>
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
          {suggestions.map((name) => {
            return (
              <Box borderStyle={'round'} key={name}>
                <Text>{name}</Text>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

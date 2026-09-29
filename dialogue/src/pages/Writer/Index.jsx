import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../../store.js'
import SinglePick from '../../components/SinglePick.jsx'

const list = [
  { label: 'Filesystem', id: 'filesystem', description: 'Pages as individual files' },
  { label: 'DuckDb', id: 'duckdb' },
  { label: 'Sqlite', id: 'sqlite' },
  { label: 'None', id: 'none' }
]

const Page = () => {
  return (
    <Box flexDirection="column">
      <SinglePick
        title="Writer"
        description="Where the output should be written"
        list={list}
        onSelect={(id) => (store.userState.writer = id)}
      />
    </Box>
  )
}

export default Page

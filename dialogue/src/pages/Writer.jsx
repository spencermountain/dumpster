import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'

const list = [
  { label: 'Filesystem', id: 'filesystem' },
  { label: 'DuckDb', id: 'duckdb' },
  { label: 'Sqlite', id: 'sqlite' }
]

const Project = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Writer</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.writer = id)} />
    </Box>
  )
}

export default Project

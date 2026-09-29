import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'

const list = [
  { label: 'Download from wikimedia.org', id: 'wikimedia' },
  { label: 'Local Dump File', id: 'local' },
  { label: 'Third-party Wiki', id: 'third-party' }
]

const Page = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Source</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.source = id)} />
    </Box>
  )
}

export default Page

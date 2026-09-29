import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'

const list = [
  { label: 'Json', id: 'json' },
  { label: 'Text', id: 'text' },
  { label: 'Html', id: 'html' },
  { label: 'Markdown', id: 'markdown' }
]

const Page = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Format</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.format = id)} />
    </Box>
  )
}

export default Page

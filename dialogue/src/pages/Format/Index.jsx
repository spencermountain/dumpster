import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../../store.js'
import SinglePick from '../../components/SinglePick.jsx'

const list = [
  { label: 'Json-sm', id: 'json-sm' },
  { label: 'Json-md', id: 'json-md', isDefault: true },
  { label: 'Json-lg', id: 'json-lg' },
  { label: 'Text', id: 'text' },
  { label: 'Html', id: 'html' },
  { label: 'Markdown', id: 'markdown' }
]

const Page = () => {
  return (
    <Box flexDirection="column">
      <SinglePick
        title="Output Format"
        description="What shape should the output be in?"
        list={list}
        onSelect={(id) => (store.userState.format = id)}
      />
    </Box>
  )
}

export default Page

import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'

const list = [
  { id: 'fr', label: 'fr' },
  { id: 'en', label: 'en' },
  { id: 'es', label: 'es' }
]

const Project = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Lang</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.lang = id)} />
    </Box>
  )
}

export default Project

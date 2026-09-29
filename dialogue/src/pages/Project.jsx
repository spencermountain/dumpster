import React from 'react'
import { Box, Text } from 'ink'
import { useSnapshot } from 'valtio'
import { store } from '../store.js'
import SinglePick from '../components/Single.jsx'

const Project = () => {
  const { project } = useSnapshot(store.userState)
  return (
    <Box flexDirection="column">
      <Text>project {project}</Text>
      <SinglePick />
    </Box>
  )
}

export default Project

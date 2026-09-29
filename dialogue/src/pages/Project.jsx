import React from 'react'
import { Box, Text } from 'ink'
import { useStore } from '../store.js'
import SinglePick from '../components/Single.jsx'

const Project = () => {
  const project = useStore((store) => store.userState.project)
  return (
    <Box flexDirection="column">
      <Text>project {project}</Text>
      <SinglePick />
    </Box>
  )
}

export default Project

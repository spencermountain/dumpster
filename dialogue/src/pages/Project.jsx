import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'
import projects from './data/projects.js'

const list = projects.map((obj) => {
  return {
    label: obj.name,
    id: obj.id
  }
})

const Page = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Project</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.project = id)} />
    </Box>
  )
}

export default Page

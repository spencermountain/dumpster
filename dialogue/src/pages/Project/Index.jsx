import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../../store.js'

import SinglePick from '../../components/SinglePick.jsx'
import projects from './projects.js'

const list = projects.map((obj) => {
  return {
    label: obj.name,
    id: obj.id
  }
})

const Page = () => {
  return (
    <Box flexDirection="column">
      <SinglePick
        title="Project"
        description="Select which project you'd like to parse"
        list={list}
        onSelect={(id) => (store.userState.project = id)}
      />
    </Box>
  )
}

export default Page

import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../store.js'
import SinglePick from '../components/SinglePick.jsx'
import langs from './data/langs.js'

const list = langs.map((obj) => {
  return {
    label: `${obj.id} - ${obj.name}`,
    id: obj.id
  }
})
const Project = () => {
  return (
    <Box flexDirection="column">
      <Text underline>Lang</Text>
      <SinglePick list={list} onSelect={(id) => (store.userState.lang = id)} />
    </Box>
  )
}

export default Project

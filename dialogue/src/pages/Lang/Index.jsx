import React from 'react'
import { Box, Text } from 'ink'
import { store } from '../../store.js'
import SinglePick from '../../components/SinglePick.jsx'
import langs from './langs.js'

const round = (num) => {
  if (num > 1_000_000) {
    let n = Math.round(num / 100_000) / 10
    return n.toLocaleString() + 'm'
  }
  if (num > 1_000) {
    let n = Math.round(num / 1_000)
    return n.toLocaleString() + 'k'
  }
  return num
}

const Page = () => {
  const list = langs.map((obj) => {
    let desc = obj.name
    if (store.userState.project === 'wikipedia') {
      desc += ' (' + round(obj.count) + ')'
    }
    return {
      id: obj.id,
      label: obj.id,
      description: desc
    }
  })
  return (
    <Box flexDirection="column">
      <SinglePick
        title="Language"
        description="Not all projects have all languages"
        list={list}
        onSelect={(id) => (store.userState.lang = id)}
      />
    </Box>
  )
}

export default Page

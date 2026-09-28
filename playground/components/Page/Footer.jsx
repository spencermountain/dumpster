import React from 'react'
import { Box } from 'ink'
import Slot from './Slot.jsx'

// Page's flexible body positions this borderless bar below the content.
export default function Footer({ left, right }) {
  return (
    <Box justifyContent="space-between" alignItems="center" flexShrink={0}>
      <Box flexShrink={1} minWidth={0} overflow="hidden">
        <Slot>{left}</Slot>
      </Box>
      <Box flexShrink={1} minWidth={0} marginLeft={1} overflow="hidden">
        <Slot>{right}</Slot>
      </Box>
    </Box>
  )
}

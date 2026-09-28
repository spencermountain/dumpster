import React from 'react'
import { Box } from 'ink'
import Slot from './Slot.jsx'

// The top bar stays above the body and draws only its bottom border.
export default function Nav({ left, right }) {
  return (
    <Box
      justifyContent="space-between"
      alignItems="center"
      flexShrink={0}
      borderStyle="single"
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      borderColor="gray"
    >
      <Box flexShrink={1} minWidth={0} overflow="hidden">
        <Slot>{left}</Slot>
      </Box>
      <Box flexShrink={1} minWidth={0} marginLeft={1} overflow="hidden">
        <Slot>{right}</Slot>
      </Box>
    </Box>
  )
}

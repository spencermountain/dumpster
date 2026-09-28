// Run from the workspace root: pnpm --filter ./pool playground
import React from 'react'
import { Box, Text, render, useApp, useInput } from 'ink'

function Playground() {
  const { exit } = useApp()
  useInput((input, key) => {
    if (key.escape) exit()
  })

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>pool playground</Text>
      <Text>Edit pool/scratch.jsx to try Ink components.</Text>
      <Text dimColor>Press Esc or Ctrl+C to exit.</Text>
    </Box>
  )
}

const app = render(<Playground />)
try {
  await app.waitUntilExit()
} finally {
  app.unmount()
  app.cleanup()
}

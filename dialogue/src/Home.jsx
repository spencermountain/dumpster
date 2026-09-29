import React from 'react'
import { Box, Text } from 'ink'
import { useSnapshot } from 'valtio'
import { store } from './store.js'
import useKeyboard from './keyboard.js'
import Project from './pages/Project.jsx'

const App = function ({ clearPrompt }) {
  const { page, doublePage } = useSnapshot(store)
  useKeyboard(clearPrompt)
  return (
    <Box width="100%" overflow="hidden" flexDirection="column">
      <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} overflow="hidden">
        <Text>
          page {page} {doublePage}
        </Text>
        <Project />
      </Box>
    </Box>
  )
}

export default App

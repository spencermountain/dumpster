import React from 'react'
import { Box, Text } from 'ink'
import { useStore } from './store.js'
import useKeyboard from './keyboard.js'
import Project from './pages/Project.jsx'

const App = function ({ clearPrompt }) {
  const userState = useStore((store) => store.userState)
  const page = useStore((store) => store.page)
  const doublePage = useStore((store) => store.doublePage())
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

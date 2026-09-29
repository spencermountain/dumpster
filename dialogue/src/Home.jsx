import React from 'react'
import { Box, Text, useApp } from 'ink'
import { snapshot, subscribe, useSnapshot } from 'valtio'
import { store } from './store.js'
import useKeyboard from './keyboard.js'
import { Show } from './components/lib.jsx'
import Lang from './pages/Lang.jsx'
import Project from './pages/Project.jsx'

const pages = {
  project: Project,
  lang: Lang
}

const App = function ({}) {
  const { livePage } = useSnapshot(store)
  const { exit } = useApp()
  const PageComponent = pages[livePage]
  useKeyboard()

  const unsubscribe = subscribe(store, () => {
    let state = structuredClone(snapshot(store.userState))
    if (!store.livePage) {
      unsubscribe()
      exit(state)
    }
  })

  if (!livePage) return null
  return (
    <Box width="100%" overflow="hidden" flexDirection="column">
      <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} overflow="hidden">
        <Text>page {livePage} </Text>
        <Show if={PageComponent} fallback={<Text dimColor>done</Text>}>
          <PageComponent />
        </Show>
      </Box>
    </Box>
  )
}

export default App

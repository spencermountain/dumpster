// Edit this file to try Ink components. From the workspace root, run: pnpm dialogue
import React from 'react'
import { Box, Text, render, useApp, useInput, useWindowSize } from 'ink'
import Page from './components/Page/Page.jsx'
import preserveScrollback from './lib/preserveScrollback.js'
// For an isolated screen instead, use Fullscreen with renderFullscreen:
// import Fullscreen, { renderFullscreen } from './components/Fullscreen.jsx'
// import { Box, Text } from 'ink'
// import { RowSpread } from './components/_lib.jsx'
import Colors from './components/misc/colors.jsx'
import Chart from './components/misc/Chart.jsx'
import Interaction from './components/misc/Interaction.jsx'
import SimpleSelect from './components/Select/Simple.jsx'
// import Table from './components/Table/Index.jsx'

const choices = [
  { label: 'Plain text', id: 'text', description: 'Just the article text' },
  { label: 'Markdown', id: 'markdown', description: 'Text with formatting' },
  { label: 'HTML', id: 'html', description: 'Ready for a web page' }
]
const opts = {
  exitOnCtrlC: true,
  // Optional workaround for Ink's erase-scrollback behavior during resize/overflow.
  stdout: preserveScrollback(process.stdout)
}

function Scratch() {
  const { exit } = useApp()
  const { columns, rows } = useWindowSize()
  useInput((input, key) => {
    if (key.escape) exit()
  })

  return (
    <Page
      minHeight={20}
      navLeft={<Text bold>dumpster</Text>}
      navRight={<Text dimColor>{columns} × {rows}</Text>}
      footerLeft="Ready"
      footerRight={<Text dimColor>Esc to exit</Text>}
    >
      <Box padding={1} flexDirection="column">
        <Interaction />
        {/* <Colors />*/}
        <SimpleSelect title={'simple-select'} description={'try this out'} choices={choices} />
        <Chart />
      </Box>
    </Page>
  )
  // return (
  //   <Box flexDirection="column" gap={1}>
  //     <RowSpread >
  //       <Text backgroundColor="green" bold padding={2} color="white">dumpster-dive</Text>
  //       <Text>hello</Text>
  //     </RowSpread>
  //     <Colors />
  //     <Chart/>
  //   </Box>
  // )
}

const app = render(<Scratch />, opts)
try {
  await app.waitUntilExit()
} finally {
  app.unmount()
  app.cleanup()
}

// Edit this file to try Ink components. From the workspace root, run: pnpm dialogue
import React from 'react'
import { Box, Text, useApp, useInput, useWindowSize } from 'ink'
import Page, { renderPage } from './components/Page/Page.jsx'
// For an isolated screen instead, use Fullscreen with renderFullscreen:
// import Fullscreen, { renderFullscreen } from './components/Fullscreen.jsx'
// import { Box, Text } from 'ink'
// import { RowSpread } from './components/_lib.jsx'
import Colors from './components/misc/colors.jsx'
import Chart from './components/misc/Chart.jsx'
import Interaction from './components/misc/Interaction.jsx'
// import SimpleSelect from './components/SimpleSelect.jsx'
// import Table from './components/Table/Index.jsx'




// import SingleSelect from './components/single-select.jsx'
// import Spinner from './components/Spinner.jsx'
// await singleSelect({
//   title: 'Choose an output format',
//   description: 'Select the format for your Wikipedia dump.',
//   choices: [
//     { label: 'Plain text', id: 'text', description: 'Just the article text' },
//     { label: 'Markdown', id: 'markdown', description: 'Text with formatting' },
//     { label: 'HTML', id: 'html', description: 'Ready for a web page' }
//   ]
// })

// <SingleSelect
//   title={title}
//   description={description}
//   choices={choices}
//   clearPrompt={() => app.clear()}
// />

const opts = {
  exitOnCtrlC: true
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
        <Colors />
        <Colors />
        <Colors />
        <Colors />
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

const app = renderPage(<Scratch />, opts)
try {
  await app.waitUntilExit()
} finally {
  app.unmount()
  app.cleanup()
}

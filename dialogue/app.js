import { createElement } from 'react'
import { render } from 'ink'
import Home from './src/Home.jsx'

try {
  const app = render(createElement(Home, { clearPrompt: () => app.clear(), mouseEnabled: true }), {
    alternateScreen: false
  })
} catch (error) {
  console.error(`dumpster-lib: ${error.message}`) //eslint-disable-line
  process.exitCode = 1
}

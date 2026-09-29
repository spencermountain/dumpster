import { createElement } from 'react'
import { render } from 'ink'
import Home from './src/Home.jsx'
const opts = {
  alternateScreen: true
}

const app = render(createElement(Home, {}), opts)
let out
try {
  out = await app.waitUntilExit()
} finally {
  app.unmount()
  app.cleanup()
}

export default out

import { createElement } from 'react'
import { render } from 'ink'
import Home from './Home.jsx'
import { resetStore } from './store.js'

let running = false

const dialogue = async function () {
  if (running) throw new Error('A dialogue is already running')
  running = true
  let app
  try {
    resetStore({})
    app = render(createElement(Home, { clear: () => app?.clear() }), {
      alternateScreen: false,
      exitOnCtrlC: false
    })
    return await app.waitUntilExit()
  } finally {
    app?.unmount()
    app?.cleanup()
    running = false
  }
}
export default dialogue

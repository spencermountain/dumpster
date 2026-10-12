import { createElement as h } from 'react'
import { render, renderToString } from 'ink'
import { red } from '../lib/colors.js'
import SetupSheet from './components/SetupSheet.js'
import Dashboard from './components/Dashboard.js'
import ResultsReport from './components/ResultsReport.js'
import TerminalTheme from './ui/TerminalTheme.js'
import { progressSnapshot, plainProgress } from './ui/progress.js'

// One renderer per pool. Components know only their props; this adapter owns IO.
const createDashboard = (stdout = process.stdout) => {
  let app
  const print = (component) => stdout.write(renderToString(component, { columns: stdout.columns || 80 }) + '\n')
  return {
    preRun(info) { print(h(SetupSheet, { info })) },
    beat(pool) {
      const frame = progressSnapshot(pool)
      if (!stdout.isTTY) {
        stdout.write(plainProgress(frame) + '\n')
        return
      }
      const component = h(TerminalTheme, null, h(Dashboard, { frame }))
      if (app) {
        app.rerender(component)
      } else {
        app = render(component, { stdout, exitOnCtrlC: false })
      }
    },
    stop() {
      if (!app) {
        return
      }
      app.unmount()
      app.cleanup()
      app = undefined
    },
    warn(line) {
      if (!stdout.isTTY) {
        stdout.write(red(line) + '\n')
      }
    },
    report(stats) { print(h(ResultsReport, { stats })) }
  }
}

export default createDashboard

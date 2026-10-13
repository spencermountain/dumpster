import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'node:events'

const green = (str) => '\x1b[32m' + str + '\x1b[0m'
const yellow = (str) => '\x1b[33m' + str + '\x1b[0m'

class Manager extends EventEmitter {
  constructor(opts) {
    super()
    this.opts = opts
    this.index = opts.index
    this.w = this.init()
    this.totals = {
      pages: 0,
      skipped: 0,
      complete: 0,
      errors: 0
    }
    this.state = {
      alive: true,
      idle: true
    }
  }
  init() {
    const w = new Worker(new URL('./worker/worker.js', import.meta.url), {
      type: 'module',
      workerData: this.opts
    })
    w.on('error', (err) => console.error('worker error:', err))
    w.on('exit', (code) => {
      this.state.alive = false
      console.log('worker exited with', code)
    })
    // listen to worker messages
    w.on('message', (msg) => {
      const { type } = msg
      if (type === 'status') {
        const { state } = msg
        console.log(`[w${this.index}]`, state)
        this.state = state
      } else if (type === 'payload') {
        const { state, counts } = msg
        this.state = state
        console.log(`[w${this.index}]: ${green(counts.complete)} pages of ${yellow(counts.pages)}`)
      }
    })
    return w
  }
  assign(task) {
    this.w.postMessage({ type: 'task', task }, [task])
  }
  calmExit() {
    const { w } = this
    return new Promise((resolve) => {
      const timer = setTimeout(() => w.terminate(), 5000)
      w.once('exit', (code) => {
        clearTimeout(timer)
        resolve(code)
      })
      // this fires first
      w.postMessage({ type: 'shutdown' })
    })
  }
}

export default Manager

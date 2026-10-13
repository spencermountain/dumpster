import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'node:events'

class Manager extends EventEmitter {
  constructor(opts) {
    super()
    this.index = opts.index
    this.w = this.init()
    this.state = {
      alive: true,
      idle: true
    }
  }
  init() {
    const w = new Worker(new URL('./worker/index.js', import.meta.url), {
      type: 'module',
      workerData: { index: this.index }
    })
    w.on('error', (err) => console.error('worker error:', err))
    w.on('exit', (code) => {
      this.state.alive = false
      console.log('worker exited with', code)
    })
    return w
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

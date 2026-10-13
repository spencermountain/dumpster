import Manager from './Manager.js'
import splitStream from './lib/split-stream.js'
import makeGate from '../stream/lib/Gate.js'
import { EventEmitter } from 'node:events'
import { availableParallelism } from 'node:os'

class Boss extends EventEmitter {
  constructor(opts, stream) {
    super()
    this.opts = opts || {}
    this.stream = stream
    this.gate = makeGate() //pause/resume control
    this.managers = []
    this.workQueue = []
    this.init()
  }
  init() {
    const numWorkers = this.opts.workerCount || availableParallelism()
    for (let i = 0; i < numWorkers; i++) {
      const manager = new Manager({ index: i, opts: this.opts })
      manager.on('error', (err) => {
        this.emit('error', err)
      })
      this.managers.push(manager)
    }
  }
  pause() {
    console.log('pausing boss')
    this.gate.pause()
  }
  resume() {
    console.log('resuming boss')
    this.gate.resume()
  }
  // pick a random worker, for now
  assignTask(batch) {
    const r = Math.floor(Math.random() * this.managers.length)
    // console.log(`assigning batch to worker ${r}`)
    this.managers[r].assign(batch)
  }
  async startStream() {
    const p = splitStream(this.stream, this.gate, (batch) => this.assignTask(batch))
    p.catch((err) => this.emit('error', err))
    p.finally(() => this.close())
    return p
  }
  pause() {
    this.gate.pause()
  }
  resume() {
    this.gate.resume()
  }
  async close() {
    console.log('calmly closing worker-pool')
    await Promise.all(this.managers.map((manager) => manager.calmExit()))
    this.emit('close')
  }
}

export default Boss

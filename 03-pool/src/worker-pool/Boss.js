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
  smallestQueue() {
    const sorted = [...this.managers].sort((a, b) => a.state.queueLength - b.state.queueLength)
    const lowestQueueLength = sorted[0].state.queueLength
    return lowestQueueLength
  }
  // Pick the lowest reported queue without reordering the pool.
  async assignTask(batch) {
    if (this.smallestQueue() >= 15) {
      this.impatientPause()
      // Hold this batch until capacity returns instead of dropping it.
      await this.gate.wait()
    }
    const sorted = [...this.managers].sort((a, b) => a.state.queueLength - b.state.queueLength)
    sorted[0].assign(batch)
  }
  async startStream() {
    // Keep stream errors and worker cleanup on the same promise chain.
    try {
      await splitStream(this.stream, this.gate, (batch) => this.assignTask(batch))
    } finally {
      await this.close()
    }
  }
  pause() {
    console.log('\n   ╭ pausing')
    this.gate.pause()
  }
  // pause, but try to resume
  impatientPause() {
    this.pause()
    const waiting = setInterval(() => {
      const queue = this.smallestQueue()
      console.log('   | still busy - queue:', queue)
      if (queue <= 1) {
        clearInterval(waiting)
        this.resume()
      }
    }, 1000)
  }
  resume() {
    console.log('   ╰ resuming')
    this.gate.resume()
  }
  async close() {
    console.log('\n\n-- Stream complete --\n  calmly closing worker-pool')
    await Promise.all(this.managers.map((manager) => manager.calmExit()))
    console.log('worker-pool closed')
    this.emit('close')
  }
}

export default Boss

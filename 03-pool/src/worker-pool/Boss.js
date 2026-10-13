import Manager from './Manager.js'
import { EventEmitter } from 'node:events'
import { availableParallelism } from 'node:os'

class Boss extends EventEmitter {
  constructor(opts, stream) {
    super()
    this.opts = opts || {}
    this.stream = stream
    this.managers = []
  }
  init() {
    const numWorkers = this.opts.workerCount || availableParallelism()
    for (let i = 0; i < numWorkers; i++) {
      const manager = new Manager({ index: i })
      this.managers.push(manager)
    }
  }
}

export default Boss

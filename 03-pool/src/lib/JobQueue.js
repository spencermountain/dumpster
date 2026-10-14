import { setImmediate } from 'node:timers/promises'
import Queue from './Queue.js'

export class JobQueue {
  constructor(doWork, opts = {}) {
    this.doWork = doWork // function called for each job
    this.queue = new Queue() // jobs waiting to be handled
    this.active = 0 // jobs currently being handled
    this.total = 0
    this.errors = 0
    // settings
    this.maxActive = opts.maxActive ?? 1 // max jobs in progress at once
    this.queueWarning = opts.queueWarning // queue size threshold
    // events
    this.onDrain = null // one-time callback for when everything finishes
    this.onWarning = null //
  }
  // Adds one task and starts work if there's a free slot.
  push(task) {
    this.queue.add(task)
    // are we worried now about the queue getting too big?
    if (this.onWarning && this.queueWarning && this.queue.length > this.queueWarning) {
      this.onWarning(this.status)
    }
    this.next()
  }
  // is the queue idle?
  get isIdle() {
    return this.active <= 0 && this.queue.length === 0
  }
  get status() {
    return {
      idle: this.isIdle,
      queueLength: this.queue.length,
      total: this.total,
      errors: this.errors
    }
  }

  // Starts the next job if there's room, then keeps going until the queue is empty.
  async next() {
    // are we already running the max number of jobs?
    if (this.active >= this.maxActive || !this.queue.length) {
      return
    }
    this.active += 1
    try {
      const task = this.queue.get()
      await this.doWork(task)
      this.total += 1
    } catch (e) {
      this.errors += 1
      console.error(e)
    }
    this.active -= 1
    // is queue empty now?
    if (this.isIdle && this.onDrain) {
      const drainCb = this.onDrain
      this.onDrain = null
      drainCb(this.status)
    }
    // Let the event loop handle I/O and other events before the next job.
    await setImmediate()
    this.next()
  }
}

// const queue = new JobQueue(doTask, { maxActive: 2, queueWarning: 3 })
// queue.onWarning = (status) => console.log('Queue warning',status)
// queue.onDrain = (status) => console.log('Queue drained:', status)

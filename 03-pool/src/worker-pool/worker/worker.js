// worker.js
import { parentPort, workerData } from 'node:worker_threads'
import handleErorrs from './errors.js'
import { sendStatus } from './send-msg.js'
import doTask from './task.js'

const opts = workerData.opts || {}
const index = workerData.index
handleErorrs(opts)

const queue = []

const makeState = () => {
  return {
    index: workerData.index,
    alive: true,
    queueLength: queue.length
  }
}

const next = () => {
  const task = queue.shift()
  doTask(task, opts) //synchronous
  if (queue.length) {
    setImmediate(next)
  }
}

// listen for all messages
parentPort.on('message', (message) => {
  const { type } = message

  if (type === 'task') {
    // are we building up a queue at all?
    if (queue.length > 0) {
      console.log(`[w${index}] queue length: ${queue.length}`)
      const state = makeState()
      sendStatus(state)
    }
    queue.push(message.task)
    if (queue.length === 1) {
      setImmediate(next)
    }
    return
  }
  if (type === 'ping') {
    const state = makeState()
    sendStatus(state)
    return
  }
  if (type === 'shutdown') {
    console.log(`[w${state.index}] shutting down`)
    state.alive = false
    sendStatus({ ...state, reason: 'shutdown' })
    parentPort.close()
    return
  }
})

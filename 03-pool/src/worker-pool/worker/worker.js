// worker.js
import { parentPort, workerData } from 'node:worker_threads'
import handleErorrs from './errors.js'
import { sendStatus, sendPayload } from './send-msg.js'
import doTask from './task.js'

const state = {
  index: workerData.index,
  alive: true,
  queueSize: 0
}
const opts = workerData.opts || {}
handleErorrs(state)

const queue = []

const next = () => {
  const task = queue.shift()
  doTask(task, opts) //synchronous
  // const { counts, payload } = doTask(task, opts)
  // sendPayload(payload, counts)
  if (queue.length) {
    setImmediate(next)
  }
}

// listen for all messages
parentPort.on('message', (message) => {
  const { type } = message

  if (type === 'task') {
    // are we building up?
    if (queue.length > 0) {
      console.log(`[w${state.index}] queue length: ${queue.length}`)
    }
    queue.push(message.task)
    if (queue.length === 1) {
      setImmediate(next)
    }
  }
  if (type === 'ping') {
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

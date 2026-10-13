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

// listen for all messages
parentPort.on('message', (message) => {
  const { type } = message

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
  if (type === 'task') {
    const { counts, payload } = doTask(message.task, opts)
    sendPayload(payload, counts)
  }
})

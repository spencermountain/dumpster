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

const queue = []

handleErorrs(state)

const nextTask = () => {
  const task = queue.shift()
  const payload = doTask(task, state) // sync work
  sendPayload(payload, state)
  if (queue.length) {
    setImmediate(nextTask) //recurse
  }
}

// listen for all messages
parentPort.on('message', (message) => {
  const { type } = message

  if (type === 'ping') {
    send.sendStatus(state)
    return
  }
  if (type === 'shutdown') {
    console.log(`[w${state.index}] shutting down`)
    state.alive = false
    sendStatus({ ...state, reason: 'shutdown' })
    setImmediate(parentPort.close())
    // process.exit(0)
    return
  }
  if (type === 'task') {
    queue.push(task)
    if (queue.length === 1) {
      setImmediate(nextTask)
    }
  }
})

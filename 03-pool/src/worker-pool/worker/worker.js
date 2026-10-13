import { threadId, parentPort } from 'node:worker_threads'
console.log(`[w${threadId}]`, 'started')

parentPort.on('message', (obj) => {
  console.log(`[w${threadId}] message`, obj)
})

const log = (...a) => console.log(`[w${threadId}]`, ...a)
// From the parent
parentPort.on('messageerror', (err) => log(`messageerror: ${err}`))
parentPort.on('close', () => log(`port closed`))
// Unexpected failures: report, then exit. Don't keep running in an unknown state.
process.on('uncaughtException', (err) => {
  report(err, { fatal: true })
  process.exit(1)
})
process.on('unhandledRejection', (reason) => {
  report(reason, { fatal: true })
  process.exit(1)
})

process.on('warning', (w) => log('warning:', w.message))
process.on('exit', (code) => code && log('exiting with code', code))

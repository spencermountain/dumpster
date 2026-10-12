import startStream from './src/index.js'
import { Writable } from 'node:stream'

const devNull = new Writable({
  write(chunk, _, cb) {
    cb()
  }
})

const opts = {
  // lang: 'fr',
  lang: 'af',
  project: 'wikipedia',
  date: '2026-10-01',
  host: 'https://dumps.wikimedia.org'
}
const stream = await startStream(opts)
// stream.pipe(process.stdout)
stream.pipe(devNull)

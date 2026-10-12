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
  // decoder: 'javascript'
  // localFile: '/Users/spencer/Desktop/afwiki-2026-10-01-p2p470034.xml.bz2'
}
const stream = await startStream(opts)
// stream.pipe(process.stdout)
stream.pipe(devNull)

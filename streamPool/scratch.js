import startStream from './src/index.js'
import { Writable } from 'node:stream'

const devNull = new Writable({
  write(chunk, _, cb) {
    cb()
  }
})

const opts = {
  lang: 'af',
  // lang: 'fr',
  project: 'wikipedia',
  date: '2026-10-01',
  host: 'https://dumps.wikimedia.org',

  maxThreads: 1,
  // decoder: 'passthrough',
  // decoder: 'javascript',
  // decoder: 'bzip2',
  // decoder: 'pbzip2',
  // localFile: '/Users/spencer/Desktop/afwiki-2026-10-01-p2p470034.xml.bz2'
  localFile: '/Users/spencer/Desktop/frwiki-2026-10-01-p13159990p17639014.xml.bz2'
}
const stream = await startStream(opts)
// stream.pipe(process.stdout)
stream.pipe(devNull)

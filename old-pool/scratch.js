// Run the parser against a sample or real dump with pnpm smoke.
import dumpster from './src/index.js'

const sleep = async function () {
  await new Promise((resolve) => {
    const ms = (Math.floor(Math.random() * 20))
    setTimeout(resolve, ms)
  })
}
const file = '/Volumes/4TB/wikipedia/swwiki-latest-pages-articles.xml'
// const file = '/Volumes/4TB/wikipedia/lawiki-latest-pages-articles.xml'
const pool = dumpster({
  project: 'wikipedia',
  lang: 'sw',
  batchPageCount: 100,
  heartbeat: 1000,
  format: 'text',
  file: file
})
// writeFiles returns a promise, so the pool waits until a batch is on disk before handing over the next
pool.on('batch', async (pages) => {
  await sleep()
  // console.log(pages.length)
})
// Attach a writer with pool.on('batch', (pages) => { ... }).
await pool.done
console.log('done')

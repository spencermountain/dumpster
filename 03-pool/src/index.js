import startStream from './stream/index.js'
import Boss from './worker-pool/Boss.js'

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const startPool = async function (opts) {
  const stream = await startStream(opts)
  const boss = new Boss(opts, stream)
  boss.startStream()
  await wait(1000)
  boss.pause()
  await wait(5000)
  boss.resume()
  return stream
}

export default startPool

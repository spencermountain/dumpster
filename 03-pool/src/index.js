import startStream from './stream/index.js'
import Boss from './worker-pool/Boss.js'

const startPool = async function (opts) {
  const stream = await startStream(opts)
  const boss = new Boss(opts, stream)
  boss.init()

  return stream
}

export default startPool

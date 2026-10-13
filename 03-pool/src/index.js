import startStream from './src/stream/index.js'
import Boss from './src/worker-pool/index.js'

const startPool = async function (opts) {
  const stream = await startStream(opts)
  const boss = new Boss(opts, stream)

  return stream
}

export default startPool

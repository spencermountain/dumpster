import makeStream from './pipe-stream.js'
import makeGate from './lib/Gate.js'

const startStream = async function (opts) {
  const gate = makeGate()

  const stream = await makeStream(opts, gate)
  // stream.pipe(process.stdout)
  // stream.pipe(devNull)
  return stream
}

export default startStream

import webStream from './web-stream.js'
import makeGate from './AsyncGate.js'

const startStream = async function (opts) {
  const gate = makeGate()
  const stream = await webStream(opts, gate)
  // stream.pipe(process.stdout)
  // stream.pipe(devNull)
  return stream
}

export default startStream

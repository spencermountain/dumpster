import makeStream from './pipe-stream.js'
import makeGate from './lib/Gate.js'
// import makeTimer from './lib/Timer.js'
import makeMeter from './lib/rateMeter.js'

const startStream = async function (opts) {
  const meter = makeMeter('stream')
  // const timer = makeTimer('stream').start()
  const gate = makeGate()

  const stream = await makeStream(opts, gate, meter)

  const logger = setInterval(() => {
    meter.stat()
  }, 2000)

  stream.on('end', () => {
    console.log('Stream ended')
    // timer.stop()
    meter.stop()
    clearInterval(logger)
  })
  return stream
}

export default startStream

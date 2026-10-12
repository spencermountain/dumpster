import makeReader from './01-reader/index.js'
import makeDecoder from './02-decoder/index.js'

import { printProgress, streamIsFull } from './_lib.js'

const makeStream = async (opts, gate) => {
  console.log('setting up')
  // setup file or http reader stream
  const reader = await makeReader(opts, gate)
  // use flexible best-available bz2 decoder
  const decoder = await makeDecoder(opts)
  printProgress('running')
  const pipeToDecoder = async () => {
    for await (const chunk of reader) {
      // support manual pause: parked here while paused
      await gate.wait()

      // automatic pause: lbzip2 is behind
      const bufferIsFull = !decoder.stdin.write(chunk)
      if (bufferIsFull) {
        await streamIsFull(decoder.stdin)
      }
    }
    decoder.stdin.end() // download finished: let lbzip2 flush and exit
  }
  printProgress('done')

  pipeToDecoder().catch((error) => decoder.stdout.destroy(error)) // not awaited: the caller gets stdout right away

  return decoder.stdout
}

export default makeStream

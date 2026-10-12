import { once } from 'node:events'
import { fetch, Agent } from 'undici'
import pickDecoder from './decoder.js'
import { makeUrl, urlExists } from './pre-fetch.js'

function printProgress(txt) {
  if (process.stdout && process.stdout.clearLine) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)
    process.stdout.write(txt)
  }
}

const streamIsFull = async function (stream) {
  printProgress('waiting for lbzip2')
  await once(stream, 'drain') // automatic pause: lbzip2 is behind
  printProgress('running')
}

const webStream = async (opts, gate) => {
  printProgress('setting up')
  const url = makeUrl(opts)
  let foundUrl = await urlExists(url)
  if (!foundUrl) {
    console.error('URL not found', url)
    throw new Error('URL not found')
  }
  const response = await fetch(url, { dispatcher: new Agent({ bodyTimeout: 0 }) })
  // use flexible best-available bz2 decoder
  const decoder = pickDecoder(opts.zipLib)
  printProgress('running')

  const pipeToDecoder = async () => {
    for await (const chunk of response.body) {
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

export default webStream

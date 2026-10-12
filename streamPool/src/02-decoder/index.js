import { spawn } from 'node:child_process'
import { PassThrough } from 'node:stream'
import unbzip2 from 'unbzip2-stream'
import pickDecoder from './pick-decoder.js'
import catchErrors from './catchers.js'

const createDecoder = async function (opts) {
  const maxThreads = opts.maxThreads || 4
  const type = pickDecoder(opts.decoder)

  const stdio = ['pipe', 'pipe', 'inherit']
  // fastest
  if (type === 'lbzip2') {
    console.log(`using parallel lbzip2 decoder with ${maxThreads} threads`)
    const args = ['-dc', '-n', String(maxThreads)]
    const decoder = spawn('lbzip2', args, { stdio })
    catchErrors(decoder)
    return decoder
  }
  if (type === 'pbz2') {
    console.log(`using parallel pbz2 decoder with ${maxThreads} threads`)
    const args = ['-d', '-c', '-n', String(maxThreads)]
    const decoder = spawn('pbz2', args, { stdio })
    catchErrors(decoder)
    return decoder
  }
  if (type === 'pbzip2' || type === 'pbzip') {
    console.log(`using pbzip2 decoder on non-streaming file`)
    const args = ['-d', `-p${maxThreads}`]
    const decoder = spawn('pbzip2', args, { stdio })
    catchErrors(decoder)
    return decoder
  }
  // slower
  if (type === 'bzip2' || type === 'bzip') {
    console.log('using slower linear bzip2 decoder')
    const args = ['-dc']
    const decoder = spawn('bzip2', args, { stdio })
    catchErrors(decoder)
    return decoder
  }
  // no decoding for uncompressed files?
  if (type === 'passthrough') {
    console.log('using passthrough decoder')
    const stream = new PassThrough()
    return { stdin: stream, stdout: stream }
  }
  // slowest
  if (type === 'javascript' || type === 'js') {
    console.log('using very-slow javascript decoder')
    const stream = unbzip2()
    return { stdin: stream, stdout: stream }
  }
  throw new Error(`Unsupported decoder: ${type}`)
}

export default createDecoder

import { spawn, spawnSync } from 'node:child_process'
import { PassThrough } from 'node:stream'
import unbzip2 from 'unbzip2-stream'

const decoders = ['lbzip2', 'bzip2']

// see what user has installed
const pickDecoder = () => {
  const found = decoders.find((command) => {
    const result = spawnSync(command, ['--help'], { stdio: 'ignore', timeout: 1000 })
    return !result.error && result.status === 0
  })
  return found || 'javascript'
}

// wrap chosen decoder with error-handling
const catchErrors = function (decoder) {
  const fail = (error) => {
    decoder.stdout.destroy(error)
  }
  decoder.on('error', fail)
  decoder.stdin.on('error', fail)
  decoder.on('exit', (code, signal) => {
    if (code !== 0) {
      fail(new Error(`${decoder.spawnfile} exited with ${signal || code}`))
    }
  })
  decoder.stdout.on('close', () => {
    decoder.stdin.destroy()
    if (!decoder.stdout.readableEnded && decoder.exitCode === null && decoder.signalCode === null) {
      decoder.kill()
    }
  })
}

const createDecoder = (type) => {
  type = type || pickDecoder()
  // fastest
  if (type === 'lbzip2') {
    console.log('using fastest lbzip2 decoder')
    const decoder = spawn(type, ['-dc', '-n', '2'], { stdio: ['pipe', 'pipe', 'inherit'] })
    catchErrors(decoder)
    return decoder
  }
  // slower
  if (type === 'bzip2') {
    console.log('using slower bzip2 decoder')
    const decoder = spawn('bzip2', ['-dc'], { stdio: ['pipe', 'pipe', 'inherit'] })
    catchErrors(decoder)
    return decoder
  }
  // debugging
  if (type === 'passthrough') {
    const stream = new PassThrough()
    return { stdin: stream, stdout: stream }
  }
  // slowest
  if (type === 'javascript') {
    console.log('using very-slow javascript decoder')
    const stream = unbzip2()
    return { stdin: stream, stdout: stream }
  }
  throw new Error(`Unsupported decoder: ${type}`)
}

export default createDecoder

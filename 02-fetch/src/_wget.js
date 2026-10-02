import fs from 'node:fs'
import path from 'node:path'
import { niceFileSize, dim, green, yellow } from './lib/_fns.js'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const resolveOutput = (url, output) => {
  const filename = new URL(url).pathname.split('/').pop()
  // New extensionless paths remain directories for existing callers.
  let isDirectory = output.endsWith('/') || output.endsWith(path.sep) || !path.extname(output)
  if (fs.existsSync(output)) {
    isDirectory = fs.statSync(output).isDirectory()
  }
  return isDirectory ? path.join(output, filename) : output
}

const isDownloaded = (file) => {
  return fs.existsSync(file) || fs.existsSync(file.replace(/\.bz2$/, ''))
}

const print = (text) => {
  if (!process.stdout.isTTY) {
    return
  }
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(text)
}

const trackProgress = (body, total) => {
  let done = 0
  const countBytes = (chunk) => {
    done += chunk.length
  }
  body.on('data', countBytes)
  const timer = setInterval(() => {
    let progress = `${done} bytes`
    if (total > 0) {
      progress = Math.floor((done / total) * 100) + '%'
    }
    print('   ' + progress)
  }, 1000)

  const stop = () => {
    clearInterval(timer)
    body.off('data', countBytes)
    print('')
  }
  const getBytes = () => done
  return { stop, getBytes }
}

const fetchBody = async (url) => {
  const response = await fetch(url)
  if (!response.ok || !response.body) {
    await response.body?.cancel()
    throw new Error(`Download failed: ${response.status} ${response.statusText} (${url})`)
  }
  return response
}

const downloadFile = async (url, file) => {
  const response = await fetchBody(url)
  const body = Readable.fromWeb(response.body)
  const progress = trackProgress(body, Number(response.headers.get('content-length')))
  try {
    await pipeline(body, fs.createWriteStream(file))
  } catch (error) {
    // A partial download must not be mistaken for a completed file next run.
    await fs.promises.rm(file, { force: true })
    throw error
  } finally {
    progress.stop()
  }
  return progress.getBytes()
}

const wget = async (url, output) => {
  const outFile = resolveOutput(url, output)
  if (isDownloaded(outFile)) {
    console.log(dim(`\n   File exists, skipping download.`))
    return outFile
  }
  await fs.promises.mkdir(path.dirname(outFile), { recursive: true })
  await downloadFile(url, outFile)
  return outFile
}

export default wget

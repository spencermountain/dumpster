import fs from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'

const print = (txt) => {
  if (!process.stdout.isTTY) {
    return
  }
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(txt)
}

const wget = async function (url, dir) {
  let parts = new URL(url).pathname.split(/\//)
  let filename = parts[parts.length - 1]
  let file = path.join(dir, filename)
  // don't clobber existing file
  if (fs.existsSync(file) || fs.existsSync(file.replace(/\.bz2$/, ''))) {
    console.log(dim(`\n   File exists, skipping download.`))
    return
  }
  await fs.promises.mkdir(dir, { recursive: true })
  const res = await fetch(url)
  if (!res.ok || !res.body) {
    await res.body?.cancel()
    throw new Error(`Download failed: ${res.status} ${res.statusText} (${url})`)
  }
  let done = 0
  const total = Number(res.headers.get('content-length'))
  const body = Readable.fromWeb(res.body)
  body.on('data', (chunk) => (done += chunk.length))
  const timer = setInterval(() => {
    let progress = `${done} bytes`
    if (total > 0) {
      progress = Math.floor((done / total) * 100) + '%'
    }
    print(progress)
  }, 1000)
  try {
    await pipeline(body, fs.createWriteStream(file))
  } catch (error) {
    // A partial download must not be mistaken for a completed file next run.
    await fs.promises.rm(file, { force: true })
    throw error
  } finally {
    clearInterval(timer)
    print('')
  }
}

export default wget

const green = (str) => '\x1b[32m' + str + '\x1b[0m'
const cyan = (str) => '\x1b[36m' + str + '\x1b[0m'
const ul = (str) => '\x1b[4m' + str + '\x1b[0m'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'
import { niceFileSize, round } from './_fns.js'
const mbPerSec = 10 //ballpark network speed

const fetchHead = async function (url) {
  const response = await fetch(url, { method: 'head' })
  if (!response.ok) {
    return { exists: false }
  }
  const result = response.headers.get('content-length')
  const bytes = result === null || result.trim() === '' ? NaN : Number(result)
  if (!Number.isFinite(bytes) || bytes < 0) {
    return { exists: true, size: 'unknown', estimate: null }
  }
  // estimate download time in minutes
  const bytesPerSecond = (mbPerSec * 1000 * 1000) / 8
  const estMinutes = round(bytes / bytesPerSecond / 60)

  return {
    exists: true,
    size: niceFileSize(bytes),
    estimate: estMinutes
  }
}

const prefetch = async function (url, type) {
  const res = await fetchHead(url)
  if (!res.exists) {
    console.error(`Error: cannot find ${type} file at ${url}`)
    console.error(`Please ensure this ${type} file exists on the specified wikimedia project.`)
    return res
  }
  return res
}

export default prefetch

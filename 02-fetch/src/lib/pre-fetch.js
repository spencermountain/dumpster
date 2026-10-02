const green = (str) => '\x1b[32m' + str + '\x1b[0m'
const cyan = (str) => '\x1b[36m' + str + '\x1b[0m'
const ul = (str) => '\x1b[4m' + str + '\x1b[0m'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'

const mbPerSec = 10 //ballpark network speed

const round = (n) => Math.round(n * 10) / 10

const fileSize = function (bytes) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  const i = bytes == 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.ceil(bytes / Math.pow(1024, i))} ${units[i]}`
}

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
    size: fileSize(bytes),
    estimate: estMinutes
  }
}

const prefetch = async function (url, type, dir) {
  const res = await fetchHead(url)
  if (!res.exists) {
    console.error(`Error: cannot find ${type} file at ${url}`)
    console.error(`Please ensure this ${type} file exists on the specified wikimedia project.`)
    return res
  }
  console.log(`Beginning download of ${green(ul(url))} ${type}`)
  if (dir) {
    console.log(dim(`  to : ${dir}`))
  }
  console.log(green(`     File size: ${cyan(res.size)}`))
  console.log(green(`     Estimated time: ${cyan(res.estimatedTime)}`))
  console.log('')
  return res
}

export default prefetch

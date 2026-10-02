/* eslint-disable no-console */
import { stat } from 'node:fs/promises'

const sizeUnits = ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'
const yellow = (str) => '\x1b[33m' + str + '\x1b[0m'

const round = (n) => Math.round(n * 10) / 10

const getFileSize = async (file) => {
  const { size } = await stat(file)
  let unit = 0
  let value = size
  for (; value >= 1000 && unit < sizeUnits.length - 1; unit += 1) {
    value /= 1000
  }
  console.log(`${dim('File size:')} ${yellow(round(value))} ${dim(sizeUnits[unit])}`)
  return size
}

const elapsed = function (start) {
  let diff = Date.now() - start
  let mins = diff / 1000 / 60
  let msg = `${dim('took')} ${yellow(round(mins))} ${dim('mins')}`
  console.log(msg)
}

// get ready for filename
const encodeTitle = function (title) {
  title = title || ''
  title = title.trim()
  //titlecase it
  title = title.charAt(0).toUpperCase() + title.substring(1)
  //spaces to underscores
  title = title.replace(/ /g, '_')
  // escape slashes, or possible absolute paths
  title = encodeURIComponent(title)
  // clobber any potential dot files, or relative paths
  title = title.replace(/^\./g, '\\./')
  // some operating systems complain with long filenames
  if (title.length >= 255) {
    title = title.substr(0, 254) //truncate it
  }
  return title
}

export { elapsed, encodeTitle, getFileSize }

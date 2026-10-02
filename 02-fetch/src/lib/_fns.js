import { stat } from 'node:fs/promises'

export const green = (str) => '\x1b[32m' + str + '\x1b[0m'
export const red = (str) => '\x1b[31m' + str + '\x1b[0m'
export const blue = (str) => '\x1b[34m' + str + '\x1b[0m'
export const magenta = (str) => '\x1b[35m' + str + '\x1b[0m'
export const cyan = (str) => '\x1b[36m' + str + '\x1b[0m'
export const yellow = (str) => '\x1b[33m' + str + '\x1b[0m'
export const black = (str) => '\x1b[30m' + str + '\x1b[0m'
export const b = (str) => '\x1b[1m' + str + '\x1b[0m'
export const dim = (str) => '\x1b[2m' + str + '\x1b[0m'
export const i = (str) => '\x1b[3m' + str + '\x1b[0m'
export const ul = (str) => '\x1b[4m' + str + '\x1b[0m'

export const round = (n) => Math.round(n * 10) / 10

export const niceFileSize = function (bytes) {
  const units = ['B', 'kB', 'MB', 'GB', 'TB']
  const which = bytes == 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.ceil(bytes / Math.pow(1024, which))} ${units[which]}`
}

export const getFileSize = async (file) => {
  const { size } = await stat(file)
  let nice = niceFileSize(size)
  // console.log(`     ${dim(nice)}`)
  return nice
}

export const elapsed = function (start) {
  let diff = Date.now() - start
  let mins = diff / 1000 / 60
  // console.log(`     ${dim(green('✓'))}  ${dim(round(mins) + 'mins')}`)
  return round(mins)
}

export const encodeTitle = function (title) {
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


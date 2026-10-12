import { access } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const makeFileUrl = function (opts) {
  const fileUrl = pathToFileURL(opts.localFile).href
  return fileUrl
}

// `file:///path` or a plain path
const fileExists = async (source) => {
  const path = source.startsWith('file:') ? fileURLToPath(source) : source
  await access(path)
}

const setupReader = async function (opts) {
  const fileUrl = makeFileUrl(opts)
  const exists = await fileExists(fileUrl)
  if (!exists) {
    console.error('File not found', fileUrl)
    throw new Error('File not found')
  }
  return createReadStream(fileUrl)
}
export default setupReader

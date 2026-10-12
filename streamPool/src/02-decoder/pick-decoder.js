import { spawnSync } from 'node:child_process'

// sorted by preference
const decoders = ['lbzip2', 'bzip2']

const checkInstalled = (lib) => {
  const result = spawnSync(lib, ['--version'], { stdio: 'ignore' })
  return result.status === 0
}

// see what user has installed
const pickDecoder = (lib) => {
  // pick user-set decoder if available
  if (lib && checkInstalled(lib)) {
    return lib
  }
  const found = decoders.find((command) => {
    return checkInstalled(command)
  })
  return found || 'javascript'
}
export default pickDecoder

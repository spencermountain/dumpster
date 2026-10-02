// import { mkdir, mkdtemp } from 'node:fs/promises'
// import { rmSync } from 'node:fs'
import { join } from 'node:path'

// autoclean?
// process.once('exit', () => {
//   directories.forEach((dir) => {
//     try {
//       rmSync(dir, { recursive: true, force: true })
//     } catch (error) {
//       console.error(`Could not remove download directory ${dir}: ${error.message}`)
//     }
//   })
// })

const createTempDir = async () => {
  const tmpDir = join(process.cwd(), '.dumpster-downloads')
  // await mkdir(root, { recursive: true })
  // const tmpDir = await mkdtemp(join(root, 'run-'))
  // directories.add(tmpDir)
  console.log(`Download directory: ${tmpDir}`)
  return tmpDir
}

export default createTempDir

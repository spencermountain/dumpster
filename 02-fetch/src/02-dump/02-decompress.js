
import { elapsed, getFileSize, dim, round, green } from '../lib/_fns.js'
import { execFileSync } from 'node:child_process'
import path from 'node:path'

// import decompress from '@xhmikosr/decompress';

const decompressDump = async function (file) {
  let start = Date.now()
  const rel = path.relative(process.cwd(), file)
  console.log(`\n• Decompressing dump`)
  console.log(`    ╰─ ${dim(rel)}`)
  const outFile = file.replace(/\.bz2$/, '')

  execFileSync('bzip2', ['-d', '--', file], { stdio: 'inherit' })
  const mins = elapsed(start)
  const size = await getFileSize(outFile)
  console.log(`     ${dim(green('✓'))}  ${green(size)} ${dim(round(mins) + 'mins')}`)

  return outFile
}
export default decompressDump

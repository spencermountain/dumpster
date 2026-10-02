
import { elapsed } from '../lib/_fns.js'
import { execFileSync } from 'node:child_process'
// import decompress from '@xhmikosr/decompress';

const decompressDump = async function (file) {
  console.log('  Decompressing file:')
  let start = Date.now()
  execFileSync('bzip2', ['-d', '--', file], { stdio: 'inherit' })
  elapsed(start)
  console.log('   Wikimedia dump decomression done');
}
export default decompressDump

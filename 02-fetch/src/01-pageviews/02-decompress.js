
import { elapsed, getFileSize, round, green, dim } from '../lib/_fns.js'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'

const getPageViews = async function (file) {

  let outFile = file.replace(/\.bz2$/, '')
  const rel = path.relative(process.cwd(), file)

  if (fs.existsSync(outFile)) {
    console.log(`\n• Pageviews file already exists`)
    console.log(`    ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`    ╰─ skipping download of pageviews file`)
    return outFile
  }

  console.log(`\n• Decompressing pageviews file`)
  console.log(`    ╰─ ${dim(rel)}`)

  let start = Date.now()
  execFileSync('bzip2', ['-d', '--', file], { stdio: 'inherit' })

  const mins = elapsed(start)
  const size = await getFileSize(outFile)
  console.log(`     ${dim(green('✓'))}  ${green(size)} ${dim(round(mins) + 'mins')}`)

  return outFile
}
export default getPageViews

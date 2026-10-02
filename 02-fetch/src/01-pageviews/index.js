
import downloadFile from './01-download.js'
import decompress from './02-decompress.js'
import parseFile from './03-parse.js'
import path from 'node:path'
import fs from 'node:fs'
import { ul, green, dim } from '../lib/_fns.js'

const getPageViews = async function (opts) {
  const { dumpDir, lang } = opts
  // check if it exists first
  let outFile = path.join(dumpDir, `./pageviews-${lang}-latest.json`)
  if (fs.existsSync(outFile)) {
    const rel = path.relative(process.cwd(), outFile)
    console.log(`\n • Skip: ${ul(green('Pageviews'))} file already exists`)
    console.log(`      ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`      ╰─ ${dim('skipped download / decompresion of pageviews')}\n`)
    return outFile
  }
  const bz2File = await downloadFile(opts)
  outFile = await decompress(bz2File)
  const jsonFile = await parseFile(outFile, opts)
  return jsonFile
}
export default getPageViews

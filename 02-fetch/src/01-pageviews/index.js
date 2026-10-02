
import downloadFile from './01-download.js'
import decompress from './02-decompress.js'
import parseFile from './03-parse.js'
import path from 'node:path'
import fs from 'node:fs'
import { ul, green, dim } from '../lib/_fns.js'
import spacetime from 'spacetime'


const getPageViews = async function (opts) {
  const { dumpDir } = opts

  // get latest pageviews file (yesterday)
  let d = spacetime.yesterday()
  const date = d.format('{year}{month-pad}{date-pad}')

  // check if it exists first
  let outFile = path.join(dumpDir, `./pageviews-${date}-user`)
  if (fs.existsSync(outFile + '.json')) {
    const rel = path.relative(process.cwd(), outFile + '.json')
    console.log(`\n • Skip: ${ul(green('Pageviews'))} file already exists`)
    console.log(`      ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`      ╰─ ${dim('skipped download / decompresion of pageviews')}\n`)
    return outFile
  }
  await downloadFile(opts)

  outFile = await decompress(outFile)

  const jsonFile = parseFile(outFile, opts)
  return jsonFile
}
export default getPageViews

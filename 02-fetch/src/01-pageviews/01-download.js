import spacetime from 'spacetime'
import fs from 'node:fs'
import path from 'node:path'
import wget from '../_wget.js'
import { elapsed, ul, green, dim, cyan, getFileSize, round } from '../lib/_fns.js'
import preFetch from '../lib/pre-fetch.js'

// get pageviews dataset from wikimedia
const downloadFile = async function (opts) {
  const { dumpDir, lang } = opts

  // get latest pageviews file (yesterday)
  let d = spacetime.yesterday()
  let y = d.year()
  let m = d.format('{year}-{month-pad}')
  const date = d.format('{year}{month-pad}{date-pad}')

  let bz2File = path.join(dumpDir, `./pageviews-latest.bz2`)
  if (fs.existsSync(bz2File)) {
    const rel = path.relative(process.cwd(), bz2File)
    console.log(`\n• Pageviews file already exists`)
    console.log(`    ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`    ╰─ skipping download`)
    return bz2File
  }
  const domain = opts.source || 'https://dumps.wikimedia.org'
  const url = domain + `/other/pageview_complete/${y}/${m}/pageviews-${date}-user.bz2`

  const res = await preFetch(url, 'pageviews', dumpDir)
  if (!res.exists) {
    console.error(`Error: cannot find pageviews at ${url}`)
    return null
  }
  const rel = path.relative(process.cwd(), bz2File)

  console.log(`\n• Downloading ${ul(green('Pageviews'))} data`)
  console.log(`    ├─ ${dim(url)}`)
  console.log(`    ├─ ${dim('./' + rel)}`)
  console.log(`    ╰─ ${cyan('~' + res.estimate)} mins  ${cyan(res.size)}`)

  let start = Date.now()

  await wget(url, bz2File)
  const mins = elapsed(start)
  const size = await getFileSize(bz2File)
  console.log(`     ${dim(green('✓'))}  ${green(size)} ${dim(round(mins) + 'mins')}`)
  return bz2File
}

export default downloadFile
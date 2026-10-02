
import path from 'path'
import fs from 'node:fs'
import wget from '../_wget.js'
import { elapsed, getFileSize, green, cyan, dim, yellow, ul, round } from '../lib/_fns.js'
import preFetch from '../lib/pre-fetch.js'


const downloadDump = async function (opts) {
  const { project, lang, dumpDir } = opts
  const dumpType = 'pages-articles'
  const dumpDate = opts.dumpDate || 'latest'
  let name = `${lang}wiki`
  if (project !== 'wikipedia') {
    name = `${lang}${project}`
  }

  const file = `${name}-${dumpDate}-${dumpType}.xml.bz2`
  const bz2File = path.join(dumpDir, `${name}-${dumpDate}-${dumpType}.xml.bz2`)

  // check if it exists first
  if (fs.existsSync(bz2File)) {
    const rel = path.relative(process.cwd(), bz2File)
    console.log(`\n• bz2 file already exists`)
    console.log(`    ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`    ╰─ skipping download of dump`)
    return bz2File
  }
  let url = `https://dumps.wikimedia.org/${name}/${dumpDate}/${file}`
  const res = await preFetch(url, 'dump', dumpDir)
  if (!res.exists) {
    console.error(`Error: cannot find ${dumpType} dump at ${url}`)
    return null
  }
  const rel = path.relative(process.cwd(), bz2File)

  console.log(`\n• Downloading ${ul(green(lang + '-' + project))} dump`)
  console.log(`    ├─ ${dim(url)}`)
  console.log(`    ├─ ${dim('./' + rel)}`)
  console.log(`    ╰─ ${cyan('~' + res.estimate)} mins   ${cyan(res.size)}`)

  const start = Date.now()
  await wget(url, bz2File)
  const mins = elapsed(start)
  const size = await getFileSize(bz2File)
  console.log(`     ${dim(green('✓'))}  ${green(size)} ${dim(round(mins) + 'mins')}`)

  return bz2File
}

export default downloadDump
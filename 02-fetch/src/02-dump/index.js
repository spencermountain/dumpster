
import downloadDump from './01-download.js'
import decompress from './02-decompress.js'
import path from 'node:path'
import { dim, yellow, green, ul } from '../lib/_fns.js'
import fs from 'node:fs'

const getDump = async function (opts) {
  const { lang, project, dumpDir } = opts

  // Filenames are 'enwiki', 'frwiktionary' etc,
  let proj = project === 'wikipedia' ? `${lang}wiki` : `${lang}${project}`
  opts.dumpFile = opts.dumpFile || path.join(dumpDir, `${proj}-latest-pages-articles.xml`)

  // check if it exists first
  if (fs.existsSync(opts.dumpFile)) {
    const rel = path.relative(process.cwd(), opts.dumpFile)
    console.log(`\n • Skip: ${ul(green(lang + '-' + project))} xml file already exists`)
    console.log(`      ├─ ${green('✓')} ${dim(rel)}`)
    console.log(`      ╰─ ${dim('skipped download / decompresion of dump')}\n\n`)
    return opts.dumpFile
  }

  const bz2File = await downloadDump(opts)
  opts.dumpFile = await decompress(bz2File)

  // console.log(dim(`  • xml dump ready\n`))
  return opts.dumpFile
}
export default getDump

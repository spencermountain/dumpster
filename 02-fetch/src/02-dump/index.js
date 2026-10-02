
import downloadDump from './01-download.js'
import decompress from './02-decompress.js'
import { join } from 'node:path'
import { dim } from '../lib/_fns.js'

const getDump = async function (opts) {
  const { lang, project, dumpDir, dumpFile } = opts

  // Filenames are 'enwiki', 'frwiktionary' etc,
  let proj = project === 'wikipedia' ? `${lang}wiki` : `${lang}${project}`
  opts.dumpFile = opts.dumpFile || join(dumpDir, `${proj}-latest-pages-articles.xml`)

  const bz2File = await downloadDump(opts)
  await decompress(bz2File)

  console.log(`xml dump file at: ${dim(dumpFile)}`)
  return opts.dumpFile
}
export default getDump

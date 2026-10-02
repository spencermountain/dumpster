
import path from 'path'
import wget from '../_wget.js'
import { elapsed } from '../lib/_fns.js'
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
  let url = `https://dumps.wikimedia.org/${name}/${dumpDate}/${file}`
  const res = await preFetch(url, 'dump', dumpDir)
  if (!res.exists) {
    console.error(`Error: cannot find ${dumpType} dump at ${url}`)
    return null
  }

  const bz2File = path.join(dumpDir, `${name}-${dumpDate}-${dumpType}.xml.bz2`)
  const start = Date.now()
  await wget(url, bz2File)
  elapsed(start)
  return bz2File
}

export default downloadDump
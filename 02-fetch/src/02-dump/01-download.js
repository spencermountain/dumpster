
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
    return
  }

  const start = Date.now()
  await wget(url, dumpDir)
  elapsed(start)
}

export default downloadDump
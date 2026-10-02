import spacetime from 'spacetime'
import fs from 'node:fs'
import path from 'node:path'
import wget from '../_wget.js'
import { elapsed } from '../lib/_fns.js'
import preFetch from '../lib/pre-fetch.js'

// get pageviews dataset from wikimedia
const downloadFile = async function (opts) {
  const { dumpDir } = opts

  // get latest pageviews file (yesterday)
  let d = spacetime.yesterday()
  let y = d.year()
  let m = d.format('{year}-{month-pad}')
  const date = d.format('{year}{month-pad}{date-pad}')

  let bzFile = path.join(dumpDir, `./pageviews-${date}-user.bz2`)
  if (fs.existsSync(bzFile)) {
    console.log('     Pageviews file exists, skipping download.')
    return bzFile
  }
  const domain = opts.source || 'https://dumps.wikimedia.org'
  const url = domain + `/other/pageview_complete/${y}/${m}/pageviews-${date}-user.bz2`

  await preFetch(url, 'pageviews')

  let start = Date.now()
  console.log(opts)
  await wget(url, dumpDir)
  elapsed(start)
  return bzFile
}

export default downloadFile
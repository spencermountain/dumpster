import getPageviews from './01-pageviews/index.js'
import getDump from './02-dump/index.js'
import createTempDir from './lib/tmp-dir.js'

const fetchAll = async function (opts) {
  opts.dumpDir = opts.dumpDir || (await createTempDir())

  //download pageviews data?
  if (opts.pageviews === true) {
    opts.pageviewsFile = await getPageviews(opts)
  }
  opts.dumpFile = await getDump(opts)
  return opts
}

export default fetchAll

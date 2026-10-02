
import downloadFile from './01-download.js'
import decompress from './02-decompress.js'
import parseFile from './03-parse.js'

const getPageViews = async function (opts) {
  // console.log(cyan(`\n   === Preparing Wikimedia Pageviews dataset (~500mb) ===`))
  let bz2File = await downloadFile(opts)

  let out = await decompress(bz2File)

  parseFile(out, opts.lang, opts.project)

}
export default getPageViews

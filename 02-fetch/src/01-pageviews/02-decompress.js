
/* eslint-disable no-console */
import { elapsed } from '../lib/_fns.js'
import { execFileSync } from 'node:child_process'
import path from 'node:path'
import fs from 'node:fs'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'

const getPageViews = async function (file) {

  let expected = file.replace(/\.bz2$/, '')
  if (fs.existsSync(expected)) {
    console.log(dim('   Pageviews file exists, skipping step.'))
    return expected
  }

  let dir = path.parse(file).dir
  console.log('   Decompressing pageview file: (~3mins)', 'to ' + dir)
  let start = Date.now()

  execFileSync('bzip2', ['-d', '--', file], { stdio: 'inherit' })

  elapsed(start)
  return expected
}
export default getPageViews


// getPageViews('/Users/spencer/mountain/dumpster-lib/pageviews-20240805-user.bz2')

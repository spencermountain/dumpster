import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
const tsvOut = './pageviews.tsv'
const dim = (str) => '\x1b[2m' + str + '\x1b[0m'

const round = n => Math.round(n * 10) / 10

const parsePageviews = function (file, opts) {
  const { lang, project } = opts

  const jsonOut = file + '.json'

  if (fs.existsSync(jsonOut)) {
    console.log(dim('     Pageviews output file exists, skipping parsing.'))
    return jsonOut
  }

  //filter large pageview file down to our project-lang only
  console.log(dim(`    parsing pageview counts`))
  const output = fs.openSync(tsvOut, 'w')
  try {
    execFileSync('grep', ['--', `^${lang}.${project} .* desktop `, file], {
      stdio: ['ignore', output, 'inherit']
    })
  } catch (error) {
    // grep exits with 1 when there are no matching pageviews.
    if (error.status !== 1) {
      throw error
    }
  } finally {
    fs.closeSync(output)
  }

  let counts = {}
  let max = 0
  let total = 0
  // turn tsv into key-value
  let arr = fs.readFileSync(tsvOut).toString().split(/\n/)
  for (let i = 0; i < arr.length; i += 1) {
    let a = arr[i].split(' ')
    let title = a[1]
    if (title !== undefined && a[4] !== '1') {
      // title = encodeTitle(title)
      let num = Number(a[4])
      counts[title] = num
      if (num > max) {
        max = num
      }
      total += 1
    }
  }
  fs.writeFileSync(jsonOut, JSON.stringify(counts, null, 2))
  console.log(`    max pageview: ${max.toLocaleString()}`)
  console.log('    mean: ', round(total / Object.keys(counts).length))
  console.log('\n\n')

  // cleanup tmp file
  fs.unlinkSync(tsvOut)
  // cleanup pageviews file?
  fs.unlinkSync(file)
  return jsonOut
}

export default parsePageviews

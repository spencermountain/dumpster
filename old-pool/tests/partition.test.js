import test from 'tape'
import { readFileSync } from 'node:fs'
import partition from '../src/pool/_partition.js'
import { dumpFile, expected } from './dumps.js'

const file = dumpFile('pages')

test('ranges start on <page>, and tile the file with no gaps', (t) => {
  const buf = readFileSync(file)
  const ranges = partition(file, 5)
  t.equal(ranges.length, 5)
  ranges.forEach((r, i) => {
    t.equal(buf.subarray(r.start, r.start + 6).toString(), '<page>', `range ${i} starts on a tag`)
    if (i > 0) {
      t.equal(ranges[i - 1].end, r.start - 1, 'contiguous')
    }
  })
  t.equal(ranges[ranges.length - 1].end, buf.length - 1, 'runs to the end of the file')
  // every page tag lands in exactly one range
  const tags = buf.toString().split('<page>').length - 1
  t.equal(tags, expected.count)
  t.end()
})

test('a tiny file yields fewer ranges than workers asked', (t) => {
  const ranges = partition(dumpFile('small'), 8)
  t.ok(ranges.length <= 3)
  t.ok(ranges.length > 0)
  t.end()
})

test('an empty file yields no ranges', (t) => {
  t.deepEqual(partition(dumpFile('empty'), 4), [])
  t.end()
})

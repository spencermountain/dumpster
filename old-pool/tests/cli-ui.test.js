import test from 'tape'
import { rejects } from './helpers.js'
import { createElement as h } from 'react'
import { renderToString } from 'ink'
import { execFile } from 'node:child_process'
import { promisify, stripVTControlCharacters } from 'node:util'
import { fileURLToPath } from 'node:url'
import defaults from '../src/lib/defaults.js'
import { dumpFile, expected } from './dumps.js'
import { progressSnapshot } from '../src/cli/ui/progress.js'
import TerminalTheme from '../src/cli/ui/TerminalTheme.js'
import Dashboard from '../src/cli/components/Dashboard.js'
import ResultsReport from '../src/cli/components/ResultsReport.js'
import SetupSheet from '../src/cli/components/SetupSheet.js'

const exec = promisify(execFile)
const bin = fileURLToPath(new URL('../src/cli/bin.js', import.meta.url))
const file = dumpFile('pages')
const env = { ...process.env, NO_COLOR: '1', NO_UNICODE: '1', FORCE_COLOR: '0' }

test('CLI flag run prints setup and results as plain ASCII, with heartbeat disabled', async (t) => {
  const { stdout, stderr } = await exec(process.execPath, [bin, file, '--format', 'text', '--workers', '1', '--heartbeat', '0'], { env })
  t.match(stdout, /Setup/)
  t.match(stdout, /Results\s+done/)
  t.match(stdout, /processed\s+300/)
  t.match(stdout, /throughput/)
  t.doesNotMatch(stdout, /\x1b|[^\x00-\x7f]/)
  t.doesNotMatch(stdout, /overall/)
  t.equal(stderr, '')
})

test('CLI silent run emits nothing and invalid options fail quietly', async (t) => {
  const { stdout, stderr } = await exec(process.execPath, [bin, file, '--workers', '1', '--silent'], { env })
  t.equal(stdout + stderr, '')
  await rejects(t, exec(process.execPath, [bin, '/missing.xml', '--silent'], { env }), (err) => {
    t.equal(err.code, 1)
    t.equal(err.stdout + err.stderr, '')
    return true
  })
})

test('missing-option invocations fail without hanging', async (t) => {
  for (const args of [[], ['--format', 'text']]) {
    await rejects(t, exec(process.execPath, [bin, ...args], { env, timeout: 5000 }), (err) => {
      t.equal(err.code, 1)
      t.match(err.stderr, /missing required/)
      return true
    })
  }
})

test('dashboard preserves worker states, counts, overall progress and queue statistics', (t) => {
  const workers = [{ index: 0, rangeSize: 100 }, { index: 1, rangeSize: 100, finished: true }]
  const frame = progressSnapshot({ workers, status: { 0: { bytes: 50, processed: 10, written: 8, errors: 1 } }, parked: [workers[0]], queue: [[]], queueLimit: 2 })
  t.equal(frame.progress, 75)
  const output = stripVTControlCharacters(renderToString(h(TerminalTheme, null, h(Dashboard, { frame })), { columns: 60 }))
  for (const pattern of [/parked/, /done/, /processed 10/, /written 8/, /75%/, /queue 1\/2/, /errors 1/]) t.match(output, pattern)
  // Terminal color sequences do not occupy visible columns.
  t.ok(output.split('\n').every((line) => line.length <= 60))
  t.end()
})

test('setup and report preserve filters, skip reasons, error examples and performance', (t) => {
  const setup = stripVTControlCharacters(renderToString(h(SetupSheet, { info: { file: file, fileSize: 1024, workers: 2, queueLimit: 2, opts: { ...defaults, skip_nsfw: { Weapons: true } } } })))
  t.match(setup, /selective/)
  t.match(setup, /Weapons/)
  t.match(setup, /memory bound/)
  const stats = { processed: 10, written: 5, skipped: 3, skipped_namespace: 2, skipped_redirect: 1, errors: 2, errorTypes: [{ message: 'parse failed', count: 2, title: 'Example page' }], took: 1000, workers: 2, batches: 1, maxQueue: 2, parked: 1, bytes: 1024, maxRss: 1048576 }
  const output = stripVTControlCharacters(renderToString(h(ResultsReport, { stats })))
  for (const label of ['done, with errors', 'namespace', 'redirects', 'parse failed', 'Example page', 'throughput', 'backpressure', 'peak memory']) t.ok(output.includes(label), label)
  t.end()
})

test('writer extensions still receive parsed options and await batch/end listeners', async (t) => {
  const writer = fileURLToPath(new URL('./cli-writer.js', import.meta.url))
  const { stdout, stderr } = await exec(process.execPath, [writer, file, '--out', 'pages'], { env })
  t.deepEqual(JSON.parse(stdout), { out: 'pages', written: expected.articles.length })
  t.equal(stderr, '')
  await rejects(t, exec(process.execPath, [writer, file, '--out', 'pages', '--fail'], { env, timeout: 5000 }), (err) => {
    t.equal(err.code, 1)
    t.equal(err.stdout + err.stderr, '')
    return true
  })
})

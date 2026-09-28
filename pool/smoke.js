// Run the parser against a sample or real dump with pnpm smoke.
import dumpster from './src/index.js'
import { rmSync } from 'node:fs'
import makeFixture from './src/lib/fixture.js'
import { dim } from './src/lib/colors.js'

process.stdout.write(dim('warming up..') + '\n')
// Pass a dump path, or use a small temporary fixture for a quick smoke run.
const fixture = process.argv[2] ? null : makeFixture(20)
try {
  const pool = dumpster({
    project: 'wikipedia',
    lang: 'sw',
    batchPageCount: 100,
    format: 'text',
    file: process.argv[2] || fixture.file
  })
  // Attach a writer with pool.on('batch', (pages) => { ... }).
  await pool.done
} finally {
  if (fixture) rmSync(fixture.dir, { recursive: true, force: true })
}

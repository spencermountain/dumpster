import { parseCommand } from './command.js'
import dumpster from '../index.js'
import defaults from '../lib/defaults.js'
import { checkOptions } from '../pool/_prep.js'

// the shared CLI runner. every dumpster tool (the lib itself, and each writer plugin)
// calls this - passing its name, any extra params, and the writer to attach.
//
//   run({ name, description, version, params, defaults, writer })
//
//   params  - extra command-line params, same shape as baseParams
//   defaults- option overrides for this tool
//   writer  - (pool, opts) => void   attach your 'batch'/'end' listeners here
const run = async function (config = {}) {
  const { program, params, chosen } = parseCommand(config)
  const opts = Object.assign({}, config.defaults, chosen)
  const missing = params.filter((param) => param.required && opts[param.name] == null)
  if (missing.length > 0) {
    program.error(`missing required option(s): ${missing.map((param) => '--' + param.name).join(', ')}`)
  }

  // validate with the lib's own rules, so the CLI and library agree on what's valid
  try {
    checkOptions(Object.assign({}, defaults, opts))
  } catch (err) {
    if (!opts.silent) {
      process.stderr.write(err.message + '\n')
    }
    process.exitCode = 1
    return
  }

  const pool = dumpster(opts)
  const cancelled = new Error('cancelled')
  const interrupt = () => {
    process.exitCode = 130
    void pool.abort(cancelled)
  }
  process.once('SIGINT', interrupt)
  try {
    if (typeof config.writer === 'function') {
      config.writer(pool, opts)
    }
    await pool.done
    return
  } catch (err) {
    // the pool has already torn down; surface the reason and fail the process
    if (!opts.silent) {
      process.stderr.write((err.message || String(err)) + '\n')
    }
    await pool.abort(err)
    process.exitCode = err === cancelled ? 130 : 1
  } finally {
    process.removeListener('SIGINT', interrupt)
  }
}

export default run
export { run }

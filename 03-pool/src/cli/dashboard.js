import createDashboard from './_dashboard.js'

// Adapt pool events to terminal output without involving workers in rendering.
const attachDashboard = (pool, stdout = process.stdout) => {
  const dashboard = createDashboard(stdout)
  const start = () => dashboard.preRun({
    file: pool.opts.file,
    fileSize: pool.fileSize,
    workers: pool.workers.length,
    queueLimit: pool.queueLimit,
    opts: pool.opts,
  })
  const progress = () => dashboard.beat(pool)
  const warning = ({ index, title, message }) => {
    dashboard.warn(`worker #${index + 1} couldn't process '${title}': ${message}`)
  }
  const cleanup = () => {
    dashboard.stop()
    pool.off('start', start)
    pool.off('progress', progress)
    pool.off('warning', warning)
    pool.off('stop', dashboard.stop)
  }
  pool.once('start', start)
  pool.on('progress', progress)
  pool.on('warning', warning)
  pool.on('stop', dashboard.stop)
  pool.done.then((stats) => {
    cleanup()
    dashboard.report(stats)
  }, cleanup)
}

export default attachDashboard

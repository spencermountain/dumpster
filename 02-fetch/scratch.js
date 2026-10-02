import doFetch from './src/index.js'

await doFetch({
  project: 'wikipedia',
  lang: 'sw',
  dumpDate: 'latest',
  pageviews: false,
  cleanup: true
})

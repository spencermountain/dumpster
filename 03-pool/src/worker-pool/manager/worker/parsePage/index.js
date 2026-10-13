import parseXml from './01-xml.js'

const parsePage = function (xml, opts) {
  const { id, ns, title, text } = parseXml(xml)
  // try to skip early
  if (!title || !text || !id) {
    console.log(xml)
    return { skipped: true, reason: 'empty' }
  }
  // skip by namespace
  const wantNs = opts.namespaces || {}
  // console.log(opts)
  if (wantNs[ns] !== true) {
    return { skipped: true, reason: 'namespace' }
  }
  return { id, ns, title }
}

export default parsePage

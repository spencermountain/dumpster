import parseXml from './01-xml.js'

const parsePage = function (xml, opts) {
  const { id, ns, title, text } = parseXml(xml)
  // try to skip early
  if (!title || !text || !id) {
    return { skipped: true, reason: 'empty' }
  }
  // skip by namespace
  const namespaces = opts.namespaces || {}
  if (namespaces[ns] !== true) {
    return { skipped: true, reason: 'namespace' }
  }
  return { id, ns, title }
}

export default parsePage

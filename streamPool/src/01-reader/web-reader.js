import { fetch, Agent } from 'undici'

const makeUrl = function (opts) {
  const { project, lang, date, host } = opts
  let proj = project === 'wikipedia' ? `${lang}wiki` : `${lang}${project}`
  const url = `${host}/other/mediawiki_content_current/${proj}/${date}/xml/bzip2/${proj}-${date}-p2p470034.xml.bz2`
  return url
}

const urlExists = async function (url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

const setupReader = async function (opts) {
  const url = makeUrl(opts)
  const exists = await urlExists(url)
  if (!exists) {
    console.error('URL not found', url)
    throw new Error('URL not found')
  }
  const response = await fetch(url, { dispatcher: new Agent({ bodyTimeout: 0 }) })
  return response.body
}
export default setupReader

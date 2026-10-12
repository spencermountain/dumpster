
const urlExists = async function (url) {
  try {
    const response = await fetch(url, { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

const makeUrl = function (opts) {
  const { project, lang, date, host } = opts
  let proj = project === 'wikipedia' ? `${lang}wiki` : `${lang}${project}`
  const url = `${host}/other/mediawiki_content_current/${proj}/${date}/xml/bzip2/${proj}-${date}-p2p470034.xml.bz2`
  return url
}

export { makeUrl, urlExists }

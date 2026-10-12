import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dumpFile = (name) => fileURLToPath(new URL(`./dumps/${name}.xml`, import.meta.url))
const expected = JSON.parse(readFileSync(new URL('./dumps/pages.json', import.meta.url), 'utf8'))

export { dumpFile, expected }

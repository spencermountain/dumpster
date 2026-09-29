import { proxy } from 'valtio'

const defaultState = {
  project: null, // wikipedia, wiktionary
  lang: true,
  source: true, // wikimedia, local
  destination: null, // sqlite, duckdb
  include: null, // {disambiguation, redirects}
  format: null, // json, html
  properties: null, // {summary, classification}
  runtime: null //workers, chunks, resume
}

export const store = proxy({
  userState: { ...defaultState },
  page: 0,
  // getters
  get doublePage() {
    return this.page * 2
  },
  // actions
  nextPage: () => {
    store.page += 1
  }
})

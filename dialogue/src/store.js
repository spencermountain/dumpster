import { create } from 'zustand'

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

export const useStore = create((set, get) => ({
  userState: { ...defaultState },
  page: 0,
  // getters
  doublePage: () => get().page * 2,
  // actions
  nextPage: () => set((state) => ({ page: state.page + 1 }))
}))

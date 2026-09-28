import { useState } from 'react'
import { isSortable } from './columns.js'

// Natural ordering for text and numeric strings ("2" before "10").
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

function sortedRows(data, sort) {
  if (!sort) return data

  // Copy before sorting: callers retain their original array and row order.
  return [...data].sort((a, b) => {
    const left = a[sort.id]
    const right = b[sort.id]
    // Missing values stay last in both directions.
    if (left == null) return right == null ? 0 : 1
    if (right == null) return -1
    return compare(left, right) * (sort.direction === 'asc' ? 1 : -1)
  })
}

export default function useSort(data, cols) {
  const initial = cols.filter((col) => col.sort === true)
  if (initial.length > 1) throw new Error('Table allows only one column with sort: true')

  // sort: true is a mount-time default, not a controlled sort state.
  const [sorting, setSorting] = useState(() =>
    initial.length ? { id: initial[0].id, direction: 'asc' } : null
  )
  // Ignore a previously selected column if it is removed or becomes unsortable.
  const sort = cols.some((col) => col.id === sorting?.id && isSortable(col)) ? sorting : null
  const toggleSort = (id) => {
    setSorting((previous) => ({
      id,
      direction: previous?.id === id && previous.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  return { sort, rows: sortedRows(data, sort), toggleSort }
}

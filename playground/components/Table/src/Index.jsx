import React, { useId, useRef } from 'react'
import { Box, useFocusManager } from 'ink'
import Row from './Row.jsx'
import useSort from './useSort.js'
import useHeaderClicks from './useHeaderClicks.js'
import { isSortable } from './columns.js'

/**
 * data: objects keyed by column id.
 * cols: { id, label, color?, dim?, bold?, underline?, flexBasis?, minWidth?,
 *         sortable?, sort? }. Only one column may have sort: true.
 * Click a sortable heading, or focus it with Tab and press Enter/Space.
 */
export default function Table({ data = [], cols = [] }) {
  const { sort, rows, toggleSort } = useSort(data, cols)
  const headers = useRef(new Map())
  const focusPrefix = useId()
  const { focus } = useFocusManager()

  // Mouse and keyboard share the same transition and keep focus in sync.
  const onSort = (id) => {
    toggleSort(id)
    focus(`${focusPrefix}-${id}`)
  }
  useHeaderClicks(headers, onSort, cols.some(isSortable))
  if (cols.length === 0) return null

  // Clip only at the table boundary: nested Ink clipping can override its bounds.
  return (
    <Box flexDirection="column" width="100%" overflow="hidden" padding={1}>
      <Row
        header
        cols={cols}
        values={cols.map((col) => col.label)}
        sort={sort}
        onSort={onSort}
        headers={headers}
        focusPrefix={focusPrefix}
      />
      {rows.map((row, index) => (
        <Row key={index} cols={cols} sort={sort} values={cols.map((col) => row[col.id])} />
      ))}
    </Box>
  )
}

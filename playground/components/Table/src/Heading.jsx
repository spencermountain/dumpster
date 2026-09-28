import React from 'react'
import { Box, Text, useFocus, useInput, useStdin } from 'ink'
import { isSortable, singleLine } from './columns.js'

export default function Heading({ col, sort, onSort, register, focusId, first }) {
  const sortable = isSortable(col)
  const { isFocused } = useFocus({ id: focusId, autoFocus: first, isActive: sortable })
  const { isRawModeSupported } = useStdin()

  // Ink handles Tab focus; only the focused sortable heading consumes Enter/Space.
  useInput((input, key) => {
    if (key.return || input === ' ') onSort(col.id)
  }, { isActive: sortable && isFocused && isRawModeSupported })
  const sorted = sort?.id === col.id

  return (
    <Box ref={register} width="100%" height={1}>
      <Text bold={sorted} wrap="truncate-end">
        <Text underline={sortable}>{singleLine(col.label)}</Text>
        {sorted && (sort.direction === 'asc' ? ' ▲' : ' ▼')}
      </Text>
    </Box>
  )
}

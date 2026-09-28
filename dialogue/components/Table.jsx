import React, { useRef, useState } from 'react'
import { Box, Text, useFocus, useFocusManager, useInput, useStdin } from 'ink'
import useHeaderClicks from './_useHeaderClicks.js'

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
const isSortable = (col) => Boolean(col.sortable || col.sort === true)
const singleLine = (value) => String(value ?? '').replace(/\r\n|[\r\n\t\u2028\u2029]/g, ' ')

function compare(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return collator.compare(String(a), String(b))
}

function Heading({ col, sort, onSort, register, focusId, first }) {
  const { isFocused } = useFocus({ id: focusId, autoFocus: first, isActive: isSortable(col) })
  const { isRawModeSupported } = useStdin()
  useInput((input, key) => {
    if (key.return || input === ' ') onSort(col.id)
  }, { isActive: isSortable(col) && isFocused && isRawModeSupported })
  const sorted = sort?.id === col.id

  return (
    <Box ref={register} width="100%" height={1}>
      <Text bold={sorted} wrap="truncate-end">
        <Text underline={isSortable(col)}>{singleLine(col.label)}</Text>
        {sorted && (sort.direction === 'asc' ? ' ▲' : ' ▼')}
      </Text>
    </Box>
  )
}

function Row({ values, cols, sort, header = false, onSort, headers, focusPrefix }) {
  return (
    <Box
      flexShrink={0}
      borderStyle={header ? 'single' : undefined}
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      borderBottomColor="gray"
      borderBottomDimColor
    >
      {values.map((value, index) => (
        <Box
          key={cols[index].id}
          flexBasis={cols[index].flexBasis ?? 0}
          flexGrow={1}
          flexShrink={1}
          minWidth={cols[index].minWidth ?? 0}
          height={1}
          paddingRight={index < values.length - 1 ? 2 : 0}
          justifyContent="flex-start"
        >
          {header ? (
            <Heading
              col={cols[index]}
              sort={sort}
              onSort={onSort}
              focusId={`${focusPrefix}-${cols[index].id}`}
              first={index === cols.findIndex(isSortable)}
              register={(node) => {
                if (node && isSortable(cols[index])) headers.current.set(cols[index].id, node)
                else headers.current.delete(cols[index].id)
              }}
            />
          ) : (
            <Text
              wrap="truncate-end"
              color={cols[index].color}
              dimColor={cols[index].dim}
              bold={sort?.id === cols[index].id || cols[index].bold}
              underline={cols[index].underline}
            >
              {singleLine(value)}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  )
}

// sortable headers: click, or Tab to focus and Enter/Space to toggle ascending/descending.
// Sorting never mutates data; explicit per-column styling still applies.
// One column may set sort: true to start sorted ascending; it is also sortable.
export default function Table({ data = [], cols = [] }) {
  const initial = cols.filter((col) => col.sort === true)
  if (initial.length > 1) throw new Error('Table allows only one column with sort: true')
  const [sorting, setSorting] = useState(() =>
    initial.length ? { id: initial[0].id, direction: 'asc' } : null
  )
  const headers = useRef(new Map())
  const focusPrefix = React.useId()
  const { focus } = useFocusManager()
  const sort = cols.some((col) => col.id === sorting?.id && isSortable(col)) ? sorting : null
  const onSort = (id) => {
    setSorting((previous) => ({
      id,
      direction: previous?.id === id && previous.direction === 'asc' ? 'desc' : 'asc'
    }))
    focus(`${focusPrefix}-${id}`)
  }
  useHeaderClicks(headers, onSort, cols.some(isSortable))
  if (cols.length === 0) return null

  const rows = sort ? [...data].sort((a, b) => {
    const left = a[sort.id]
    const right = b[sort.id]
    // Missing values stay last in either direction.
    if (left == null) return right == null ? 0 : 1
    if (right == null) return -1
    return compare(left, right) * (sort.direction === 'asc' ? 1 : -1)
  }) : data

  return (
    <Box flexDirection="column" width="100%" overflow="hidden">
      <Row header cols={cols} values={cols.map((col) => col.label)} sort={sort}
        onSort={onSort} headers={headers} focusPrefix={focusPrefix} />
      {rows.map((row, index) => (
        <Row key={index} cols={cols} sort={sort} values={cols.map((col) => row[col.id])} />
      ))}
    </Box>
  )
}

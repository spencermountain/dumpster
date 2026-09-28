import React from 'react'
import { Box, Text } from 'ink'
import Heading from './Heading.jsx'
import { isSortable, singleLine } from './columns.js'

// One sizing path for headings and body cells keeps every column aligned.
export default function Row({ values, cols, sort, header = false, onSort, headers, focusPrefix }) {
  const firstSortable = cols.findIndex(isSortable)

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
      {cols.map((col, index) => (
        <Box
          key={col.id}
          flexBasis={col.flexBasis ?? 0}
          flexGrow={1}
          flexShrink={1}
          minWidth={col.minWidth ?? 0}
          height={1}
          paddingRight={index < cols.length - 1 ? 2 : 0}
          justifyContent="flex-start"
        >
          {header ? (
            <Heading
              col={col}
              sort={sort}
              onSort={onSort}
              focusId={`${focusPrefix}-${col.id}`}
              first={index === firstSortable}
              register={(node) => {
                // Mouse hit testing only needs the current sortable header nodes.
                if (node && isSortable(col)) headers.current.set(col.id, node)
                else headers.current.delete(col.id)
              }}
            />
          ) : (
            <Text
              wrap="truncate-end"
              color={col.color}
              dimColor={col.dim}
              bold={sort?.id === col.id || col.bold}
              underline={col.underline}
            >
              {singleLine(values[index])}
            </Text>
          )}
        </Box>
      ))}
    </Box>
  )
}

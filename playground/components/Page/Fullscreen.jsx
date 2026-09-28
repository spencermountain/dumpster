import React from 'react'
import { Box, Text, render, useWindowSize } from 'ink'

function Slot({ children }) {
  return typeof children === 'string' || typeof children === 'number'
    ? <Text>{children}</Text>
    : children
}

function Bar({ left, right, border = false }) {
  return (
    <Box
      justifyContent="space-between"
      alignItems="center"
      flexShrink={0}
      borderStyle={border ? 'single' : undefined}
      borderTop={false}
      borderLeft={false}
      borderRight={false}
      borderColor="gray"
    >
      <Box flexShrink={1} minWidth={0} overflow="hidden">
        <Slot>{left}</Slot>
      </Box>
      <Box flexShrink={1} minWidth={0} marginLeft={1} overflow="hidden">
        <Slot>{right}</Slot>
      </Box>
    </Box>
  )
}

// A terminal-sized layout. Oversized content is clipped; scrolling belongs to children.
export default function Fullscreen({ children, navLeft, navRight, footerLeft, footerRight, retainRows = 0, ...props }) {
  const { columns, rows } = useWindowSize()

  return (
    <Box
      flexDirection="column"
      {...props}
      width={columns}
      height={Math.max(1, rows - Math.max(0, retainRows))}
      flexShrink={0}
      overflow="hidden"
    >
      {(navLeft != null || navRight != null) && <Bar left={navLeft} right={navRight} border />}
      <Box flexDirection="column" flexGrow={1} flexShrink={1} minHeight={0} overflow="hidden">
        {children}
      </Box>
      {(footerLeft != null || footerRight != null) && <Bar left={footerLeft} right={footerRight} />}
    </Box>
  )
}

// Render a tree containing <Fullscreen> in the terminal's alternate screen.
// Ink restores the previous terminal screen on exit or unmount.
export function renderFullscreen(children, options = {}) {
  return render(children, { ...options, alternateScreen: true })
}

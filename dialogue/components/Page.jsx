import React from 'react'
import { Box, Text, render } from 'ink'

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

// A growing primary-screen layout, visually separated from previous commands.
export default function Page({ children, navLeft, navRight, footerLeft, footerRight, minHeight = 20, ...props }) {
  return (
    <Box
      flexDirection="column"
      width="100%"
      marginTop={1}
      marginBottom={1}
      borderStyle="single"
      borderBottom={false}
      borderLeft={false}
      borderRight={false}
      borderColor="gray"
      {...props}
      minHeight={minHeight}
      flexShrink={0}
    >
      {(navLeft != null || navRight != null) && <Bar left={navLeft} right={navRight} border />}
      <Box flexDirection="column" flexGrow={1} flexShrink={0}>
        {children}
      </Box>
      {(footerLeft != null || footerRight != null) && <Bar left={footerLeft} right={footerRight} />}
    </Box>
  )
}

// Ink's resize fallback clears the screen AND scrollback. Allow screen redraws,
// but remove the erase-scrollback escape so previous commands remain available.
function preserveScrollback(stdout) {
  return new Proxy(stdout, {
    get(target, property) {
      if (property === 'write') {
        return (chunk, ...args) => {
          const output = typeof chunk === 'string' ? chunk : chunk.toString()
          return target.write(output.replace(/\u001b\[3J/g, ''), ...args)
        }
      }
      const value = Reflect.get(target, property, target)
      return typeof value === 'function' ? value.bind(target) : value
    }
  })
}

// Native terminal scrolling stays available while this app is active.
export function renderPage(children, options = {}) {
  return render(children, {
    ...options,
    stdout: preserveScrollback(options.stdout || process.stdout),
    alternateScreen: false
  })
}

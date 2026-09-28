import React from 'react'
import { Text } from 'ink'

// Ink requires strings/numbers inside Text; custom components pass through.
export default function Slot({ children }) {
  return typeof children === 'string' || typeof children === 'number'
    ? <Text>{children}</Text>
    : children
}

  import React, { useRef, useState } from 'react'
  import { Text, Box, useInput } from 'ink'
  import { ScrollList } from 'ink-scroll-list'

  const SinglePick = () => {
    const listRef = useRef(null)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const items = Array.from({ length: 20 }).map((_, i) => `Item ${i + 1}`)

    // Handle keyboard navigation in the parent
    useInput((input, key) => {
      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }
      if (key.downArrow) {
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1))
      }
      if (input === 'g') {
        setSelectedIndex(0) // Jump to first
      }
      if (input === 'G') {
        setSelectedIndex(items.length - 1) // Jump to last
      }
      if (key.return) {
        console.log(`Selected: ${items[selectedIndex]}`)
      }
    })

    return (
      <Box borderStyle="single" height={10}>
        <ScrollList ref={listRef} selectedIndex={selectedIndex}>
          {items.map((item, i) => (
            <Box key={i}>
              <Text color={i === selectedIndex ? 'green' : 'white'}>
                {i === selectedIndex ? '> ' : '  '}
                {item}
              </Text>
            </Box>
          ))}
        </ScrollList>
      </Box>
    )
  }

  export default SinglePick

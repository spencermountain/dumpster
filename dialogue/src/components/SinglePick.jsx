  import React, { useState } from 'react'
  import { Text, Box, useInput } from 'ink'
  import { ScrollList } from 'ink-scroll-list'

  const SinglePick = ({ list, onSelect }) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    // Handle keyboard navigation in the parent
    useInput((_, key) => {
      if (key.upArrow) {
        setSelectedIndex((prev) => Math.max(prev - 1, 0))
      }
      if (key.downArrow) {
        setSelectedIndex((prev) => Math.min(prev + 1, list.length - 1))
      }
      if (key.return) {
        onSelect(list[selectedIndex].id)
      }
    })
    return (
      <Box borderStyle="single" height={10}>
        <ScrollList selectedIndex={selectedIndex}>
          {list.map((obj, i) => (
            <Box key={i}>
              <Text color={i === selectedIndex ? 'green' : 'white'}>
                {i === selectedIndex ? '> ' : '  '}
                {obj.label}
              </Text>
            </Box>
          ))}
        </ScrollList>
      </Box>
    )
  }

  export default SinglePick

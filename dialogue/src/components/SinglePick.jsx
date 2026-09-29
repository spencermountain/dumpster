  import React, { useState } from 'react'
  import { Text, Box, useInput } from 'ink'
  import { ScrollList } from 'ink-scroll-list'
  import { Show } from './lib.jsx'

  const SinglePick = ({ list, title, description, onSelect }) => {
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
      <Box flexDirection="column" padding={2}>
        <Text bold underline color="cyan">
          {title || ''}
        </Text>
        <Box paddingLeft={2} height={1}>
          <Text color="white" dimColor>
            ╰─
          </Text>
          <Text dim> {description || ''}:</Text>
        </Box>
        <Box
          borderStyle="single"
          borderColor="grey"
          borderTop={false}
          borderLeft={true}
          borderBottom={false}
          borderRight={false}
          maxHeight={20}
          maxWidth={50}
          paddingLeft={2}
          marginTop={1}
          marginBottom={1}
          marginLeft={4}
        >
          <ScrollList selectedIndex={selectedIndex} paddingLeft={1}>
            {list.map((obj, i) => (
              <Box key={i} gap={1} paddingBottom={0} height={1}>
                {/* icon*/}
                <Text bold>{i === selectedIndex ? '●' : '○'}</Text>
                {/* title*/}
                <Text color={i === selectedIndex ? 'blue' : 'white'} dimColor={i !== selectedIndex}>
                  {obj.label}
                </Text>
                {/* {i === selectedIndex ? '> ' : '  '}*/}
                <Show condition={obj.description}>
                  <Text dim>{obj.description || ''}</Text>
                </Show>
                <Show condition={obj.isDefault}>
                  <Text dim color="grey">
                    (default)
                  </Text>
                </Show>
                {/* <Show condition={i === selectedIndex} fallback={<Text color="grey">{'  '}</Text>}>
                  <Text color="grey">{' ❯'}</Text>
                </Show>*/}
              </Box>
            ))}
          </ScrollList>
        </Box>
      </Box>
    )
  }

  export default SinglePick

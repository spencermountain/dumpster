import React from 'react'
import { Text } from 'ink'
import Spinner from 'ink-spinner'
// https://github.com/sindresorhus/cli-spinners/blob/main/spinners.json
export default function SpinnerDemo({ type = 'dots2' }) {
  return (
    <Text>
      <Text>{type}</Text>
      <Text color="green">
        <Spinner type={type} />
      </Text>
      {' Loading'}
    </Text>
  )
}

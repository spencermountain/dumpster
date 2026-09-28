// node --import tsx playground/components/Table/scratch.jsx
import React from 'react'
import { useApp, useInput, render } from 'ink'
import Table from './src/Index.jsx'
const opts = {
  exitOnCtrlC: true
}

function Scratch() {
  const { exit } = useApp()
  useInput((input, key) => {
    if (key.escape) exit()
  })

  return (
    <Table
      cols={[
        { label: 'Name', id: 'name', color: 'cyan', sortable: true, flexBasis: '40%', minWidth: 18 },
        { label: 'Age', id: 'age', dim: true, sortable: true, sort: true, flexBasis: '20%', minWidth: 8 },
        { label: 'City', id: 'city', underline: true, flexBasis: '40%', minWidth: 12 }
      ]}
      data={[
        { name: 'Sosa Saunders', age: 32, city: 'Toronto' },
        { name: 'Angelina Kirk', age: 28, city: 'Montréal' },
        { name: 'Bradford Rosales', age: 41, city: 'Vancouver' }
      ]}
    />
  )
}

const app = render(<Scratch />, opts)
try {
  await app.waitUntilExit()
} finally {
  app.unmount()
  app.cleanup()
}

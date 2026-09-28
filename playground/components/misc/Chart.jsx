import React from 'react'
// import { render, Text, Box } from 'ink'
import { StackedBarChart } from '@pppp606/ink-chart'

const Chart = function () {
  return (
    <StackedBarChart
      data={[
        { label: 'Written', value: 30, color: 'green' },
        { label: 'Skipped', value: 20, color: 'magenta' },
        { label: 'Remaining', value: 50, color: 'grey' }
      ]}
      width={50}
    />
  )
}
export default Chart
// render(<App />)

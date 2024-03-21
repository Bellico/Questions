'use client'

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
]

export function AnwsersChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          data={data01}
          fill="hsl(var(--primary))"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

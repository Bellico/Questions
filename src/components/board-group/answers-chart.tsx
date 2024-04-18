'use client'

import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

type AnwserPieType ={
  name: string,
  value: number
}

export function AnwsersChart({ data }: { data: AnwserPieType[]}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="value"
          data={data}
          fill="hsl(var(--primary))"
          label
        />
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

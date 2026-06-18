import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
const COLORS = ['#16a34a', '#dc2626']
export default function AttendancePieChart({ present, absent }) {
  const data = [
    { name: 'Present', value: present },
    { name: 'Absent', value: absent },
  ]
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} innerRadius={55} outerRadius={90} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

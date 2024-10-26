import React from 'react';
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
} from 'recharts';

// Sample data for the graph
const data = [
  { date: '2024-10-01', serviceA: 5, serviceB: 3 },
  { date: '2024-10-02', serviceA: 2, serviceB: 4 },
  { date: '2024-10-03', serviceA: 1, serviceB: 2 },
  { date: '2024-10-04', serviceA: 3, serviceB: 5 },
  { date: '2024-10-05', serviceA: 4, serviceB: 1 },
];

const Linegraph = () => {
  return (
    <div style={{ marginLeft: "-30px", width: '100%', height: '90%' }}>
      <h4>Service Toggle Trends</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          {/* Define gradients */}
          <defs>
            <linearGradient id="colorServiceA" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8884d8" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorServiceB" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#82ca9d" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis dataKey="date" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />

          {/* Customized Legend with red color */}
          <Legend
            formatter={(value) => <span style={{ color: '#AEB9E1' }}>{value}</span>}
          />

          {/* Lines with gradient fill */}
          <Line
            type="monotone"
            dataKey="serviceA"
            stroke="#8884d8"
            fill="url(#colorServiceA)"
            fillOpacity={1}
          />
          <Line
            type="monotone"
            dataKey="serviceB"
            stroke="#82ca9d"
            fill="url(#colorServiceB)"
            fillOpacity={1}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Linegraph;

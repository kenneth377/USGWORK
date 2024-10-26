import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from 'antd';

const data = [
  { name: 'Running', value: 400, description: 'Services currently running' },
  { name: 'Stopped', value: 300, description: 'Services that are stopped' },
  { name: 'Down', value: 300, description: 'Services that are down' },
];

const COLORS = ['#bBbbff', '#0038FF', '#CB3CFF'];

const DoughnutChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };


  return (
    <Card style={{ width: 300, margin: 'auto', backgroundColor: 'transparent', border: 'none' }}>
      <div style={{ padding: '0px', color: '#AEB9E1', fontWeight: 'bold', fontSize: '16px' }}>Service Status</div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Tooltip 
            formatter={(value, name) => [`${name}: ${value}`, '']}
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 1)', border: 'none' }}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="rgba(0, 0, 0, 0)"
            paddingAngle={5}
            onMouseEnter={(_, index) => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            {data.map((entry, index) => {
              const isActive = index === activeIndex;
              const offsetX = isActive ? 2 : 0;
              const offsetY = isActive ? 2 : 0;
                
              return (
                <Cell
                  key={entry.name}
                  fill={COLORS[index % COLORS.length]}
                  cx={isActive ? `calc(50% + ${offsetX}px)` : '50%'}
                  cy={isActive ? `calc(50% + ${offsetY}px)` : '50%'}
                />
              );
            })}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default DoughnutChart;

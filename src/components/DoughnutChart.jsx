import React, { useContext, useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from 'antd';
import { Allcontext } from '../Allcontext';

const COLORS = ['#bBbbff', '#0B1779']; // Color for "start" and "stop"

const DoughnutChart = () => {
  const { activityData } = useContext(Allcontext);
  const [data, setData] = useState([
    { name: 'Start', value: 0 },
    { name: 'Stop', value: 0 },
  ]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    if (activityData) {
      const startCount = activityData.filter(log => log.action === 'started').length;
      const stopCount = activityData.filter(log => log.action === 'stopped').length;

      setData([
        { name: 'Start', value: startCount },
        { name: 'Stop', value: stopCount },
      ]);
    }
  }, [activityData]);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card style={{ width: 300, margin: 'auto', backgroundColor: 'transparent', border: 'none' }}>
      <div style={{ padding: '0px', color: '#AEB9E1', fontWeight: 'bold', fontSize: '16px' }}>Activity Status</div>
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
                  fill={COLORS[index]}
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

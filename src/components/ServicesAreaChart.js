import React, { useContext } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Allcontext } from '../Allcontext';

const transformData = (services) => {
  const now = new Date();
  const runningData = [];
  const stoppedData = [];

  services.forEach((service) => {
    if (service.last_referenced) {
      // Calculate time difference in seconds
      const timeDiff = Math.floor((now - new Date(service.last_referenced)) / 1000);
      const entry = {
        name: service.name,
        time: timeDiff >= 0 ? timeDiff : 0,
      };

      if (service.isRunning) {
        runningData.push(entry);
      } else {
        stoppedData.push(entry);
      }
    }
  });

  return { runningData, stoppedData };
};

const ServicesAreaChart = () => {
  const { otherservice } = useContext(Allcontext);
  const servicesData = otherservice;
  const { runningData, stoppedData } = transformData(servicesData);

  const maxTimeValue = Math.max(
    ...runningData.map((d) => d.time),
    ...stoppedData.map((d) => d.time)
  );

  const addBaselineData = (data, isRunning) => {
    const baseline = { name: '', time: 0 };
    const endPoint = { name: '', time: maxTimeValue };
    return isRunning ? [baseline, ...data, endPoint] : [baseline, endPoint, ...data];
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={addBaselineData(runningData, true)} padding={{ top: 10, bottom: 10, left: 0, right: 0 }}>
        <defs>
          <linearGradient id="colorRunning" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#575DFF" stopOpacity={0.8} />
            <stop offset="100%" stopColor="rgba(87, 93, 255, 0)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorStopped" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(203, 60, 255)" stopOpacity={0.8} />
            <stop offset="100%" stopColor="rgba(203, 60, 255,0)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="name" stroke='none' />
        <YAxis domain={[0, maxTimeValue]} stroke='none' label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
        <CartesianGrid strokeDasharray="3 3" stroke="none" />
        <Tooltip />
        <Area type="monotone" dataKey="time" stroke="blue" fillOpacity={1} fill="url(#colorRunning)" />
        <Area type="monotone" dataKey="time" data={addBaselineData(stoppedData, false)} stroke="rgb(203, 60, 255)" fillOpacity={1} fill="url(#colorStopped)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ServicesAreaChart;

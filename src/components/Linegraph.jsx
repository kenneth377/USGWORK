import React, { useEffect, useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Card } from 'antd';
import { Allcontext } from '../Allcontext'; // Adjust the import according to your project structure

const LineGraph = () => {
    const { activityData, services } = useContext(Allcontext);
    const [data, setData] = useState([]);

    useEffect(() => {
        const serviceDuration = {};

        // Process logs to calculate the running time of each service
        console.log(services, activityData);
        activityData.forEach(log => {
            const { action, service_id, timestamp } = log;
            const time = new Date(timestamp).getTime();

            if (!serviceDuration[service_id]) {
                serviceDuration[service_id] = { lastStarted: 0, lastStopped: 0, isRunning: false, onDuration: 0, offDuration: 0 };
            }

            if (action === 'started') {
                if (!serviceDuration[service_id].isRunning) {
                    serviceDuration[service_id].offDuration += Math.floor((time - serviceDuration[service_id].lastStopped) / 1000);
                }
                serviceDuration[service_id].lastStarted = time;
                serviceDuration[service_id].isRunning = true; // Mark service as running
            } else if (action === 'stopped') {
                if (serviceDuration[service_id].isRunning) {
                    serviceDuration[service_id].onDuration += Math.floor((time - serviceDuration[service_id].lastStarted) / 1000);
                }
                serviceDuration[service_id].lastStopped = time; // Update last stopped time
                serviceDuration[service_id].isRunning = false; // Mark service as stopped
            }
        });
        console.log(serviceDuration);

        // Prepare data for the line graph
        const graphData = Object.keys(serviceDuration).map(serviceId => ({
            serviceId: services[serviceId], // Use service name from services context
            onDuration: serviceDuration[serviceId].onDuration, // Duration the service has been on
            offDuration: serviceDuration[serviceId].offDuration, // Duration the service has been off
        }));

        setData(graphData);
    }, [activityData, services]);

    return (
        <Card title={<span style={{ color: '#AEB9E1' }}>Service Running and Off Time</span>} style={{ background: 'transparent', border: 'none' }}>
            <LineChart width={600} height={300} data={data}>
                <CartesianGrid stroke="none" /> {/* Remove the grid background */}
                <XAxis dataKey="serviceId" hide={true} /> {/* Hide X Axis */}
                <YAxis hide={true} /> {/* Hide Y Axis */}
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="onDuration" stroke="#8884d8" name="On Duration (s)" />
                <Line type="monotone" dataKey="offDuration" stroke="#82ca9d" name="Off Duration (s)" />
            </LineChart>
        </Card>
    );
};

export default LineGraph;

import React, { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Form, Input, Select, DatePicker, Modal, Calendar, Badge, message } from 'antd';
import { postData, FetchData } from './Fectchdata'; // Ensure fetchData is defined in your FetchData file
import './styles/schedule.css';

const { Option } = Select;

const initialEvents = [];

const mockServices = [
  { id: 1, name: "Auth Service" },
  { id: 2, name: "Database Service" },
  { id: 3, name: "API Gateway" },
];

export default function Scheduler() {
  const [scheduledActions, setScheduledActions] = useState(initialEvents);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await FetchData('http://localhost:3000/services');
        if (response.responsestatus === "success") {
          setServices(response.data);
        } else {
          setServices(mockServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices(mockServices);
      }
    };

    fetchServices();
  }, []);

  const handleScheduleAction = async (values) => {
    const newAction = {
      user_id: 1,
      service_id: values.selectedService,
      activity_time: values.actionTime.format(),
      status: "pending",
      action_type: values.actionType,
      schedule_reason: values.scheduleReason,
      service_action: values.serviceAction,
    };

    const response = await postData('http://localhost:3000/scheduled-activities', newAction);
    if (response.success) {
      setScheduledActions((prev) => [...prev, newAction]);
      message.success('Action scheduled successfully.');
      form.resetFields();
      setPopupVisible(false);
    } else {
      message.error(`Error scheduling action: ${response.error}`);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const getEventCount = (date) => {
    return scheduledActions.filter(action => {
      const actionDate = new Date(action.actionTime);
      return actionDate.toLocaleDateString() === date.toDate().toLocaleDateString();
    }).length;
  };

  const filteredEvents = selectedDate
    ? scheduledActions.filter(action => {
        const actionDate = new Date(action.actionTime);
        return actionDate.toLocaleDateString() === selectedDate.toDate().toLocaleDateString();
      })
    : [];

  const dateCellRender = (value) => {
    const count = getEventCount(value);
    return (
      <div style={{ textAlign: 'center' }}>
        <Badge count={count} style={{ backgroundColor: count > 0 ? '#52c41a' : undefined }} />
      </div>
    );
  };

  const handleDateClick = (value) => {
    setSelectedDate(value);
  };

  const handleCancelAction = (index) => {
    setScheduledActions((prev) =>
      prev.map((action, i) =>
        i === index ? { ...action, status: "Cancelled" } : action
      )
    );
  };

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">Scheduled Actions</h2>
      <DatePicker onChange={handleDateChange} style={{ marginBottom: 16 }} />
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateClick} style={{ marginBottom: 16 }} />
      <div className="actions-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((action, index) => (
            <div key={index} className={`action-card ${action.status === 'Cancelled' ? 'past-event' : ''}`}>
              <h3>{action.selectedService}</h3>
              <p><strong>Type:</strong> {action.actionType === 'automatic' ? 'Automatic Action' : 'Alert'}</p>
              <p><strong>Reason:</strong> {action.scheduleReason}</p>
              <p><strong>Date:</strong> {new Date(action.actionTime).toLocaleString()}</p>
              <p><strong>Action:</strong> {action.serviceAction.charAt(0).toUpperCase() + action.serviceAction.slice(1)}</p>
              <p><strong>Status:</strong> {action.status}</p>
              {action.status === "pending" && (
                <Button className="cancel-button" onClick={() => handleCancelAction(index)}>Cancel</Button>
              )}
            </div>
          ))
        ) : (
          <p className="no-events-message">No events scheduled for this date.</p>
        )}
      </div>
      <Button type="primary" className="floating-button" onClick={() => setPopupVisible(true)}>
        <AiOutlinePlus size={24} />
      </Button>
      <Modal title="Schedule New Action" visible={popupVisible} onCancel={() => setPopupVisible(false)} footer={null}>
        <Form form={form} onFinish={handleScheduleAction}>
          <Form.Item name="selectedService" label="Select Service" rules={[{ required: true, message: 'Please select a service!' }]}>
            <Select placeholder="--Select a Service--">
              {services.length > 0 ? (
                services.map(service => (
                  <Option key={service.id} value={service.id}>{service.name}</Option>
                ))
              ) : (
                mockServices.map(service => (
                  <Option key={service.id} value={service.id}>{service.name}</Option>
                ))
              )}
            </Select>
          </Form.Item>
          <Form.Item name="actionTime" label="Action Date and Time" rules={[{ required: true, message: 'Please select date and time!' }]}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="actionType" label="Action Type" rules={[{ required: true, message: 'Please select action type!' }]}>
            <Select placeholder="Select action type">
              <Option value="alert">Alert</Option>
              <Option value="automatic">Automatic Action</Option>
            </Select>
          </Form.Item>
          <Form.Item name="scheduleReason" label="Reason for Scheduling" rules={[{ required: true, message: 'Please provide a reason!' }]}>
            <Input placeholder="Why are you scheduling this action?" />
          </Form.Item>
          <Form.Item name="serviceAction" label="Service Action" rules={[{ required: true, message: 'Please select service action!' }]}>
            <Select placeholder="Select service action">
              <Option value="start">Start</Option>
              <Option value="stop">Stop</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="schedule-button">Schedule</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import React, { useState, useEffect, useContext } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Form, Input, Select, DatePicker, Modal, Calendar, Badge, message } from 'antd';
import { postData, FetchData } from './Fectchdata';
import './styles/schedule.css';
import { Allcontext } from '../Allcontext';

const { Option } = Select;
const mockServices = [
  { id: 1, name: "Auth Service" },
  { id: 2, name: "Database Service" },
  { id: 3, name: "API Gateway" },
];

export default function Scheduler() {
  const [scheduledActions, setScheduledActions] = useState({});
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [services, setServices] = useState([]);

  const {users,nowuser} = useContext(Allcontext)

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

    const fetchScheduledActions = async () => {
      try {
        const response = await FetchData('http://localhost:3000/scheduled-activities');
        if (response.responsestatus === "success") {
          const actionsByDate = response.data.reduce((acc, action) => {
            const date = new Date(action.activity_time).toLocaleDateString();
            if (!acc[date]) acc[date] = [];
            acc[date].push(action);
            return acc;
          }, {});
          setScheduledActions(actionsByDate);
        }
      } catch (error) {
        console.error("Error fetching scheduled actions:", error);
      }
    };

    fetchServices();
    fetchScheduledActions();
  }, []);

  const handleScheduleAction = async (values) => {
    const newAction = {
      user_id: nowuser.id,
      service_id: values.selectedService,
      activity_time: values.actionTime.format(),
      status: "pending",
      action_type: values.actionType,
      schedule_reason: values.scheduleReason,
      service_action: values.serviceAction,
    };

    const response = await postData('http://localhost:3000/scheduled-activities', newAction);
    if (response.success) {
      const actionDate = new Date(newAction.activity_time).toLocaleDateString();
      setScheduledActions((prev) => ({
        ...prev,
        [actionDate]: [...(prev[actionDate] || []), newAction],
      }));
      message.success('Action scheduled successfully.');
      form.resetFields();
      setScheduleModalVisible(false);
    } else {
      message.error(`Error scheduling action: ${response.error}`);
    }
  };

  const handleDateClick = (value) => {
    setSelectedDate(value);
    setViewModalVisible(true);
  };

  const openScheduleModal = () => {
    form.setFieldsValue({ actionTime: selectedDate });
    setScheduleModalVisible(true);
  };

  const dateCellRender = (value) => {
    const dateStr = value.toDate().toLocaleDateString();
    const actions = scheduledActions[dateStr] || [];
    const now = new Date();

    const isPastDate = value.toDate() < new Date(now.setHours(0, 0, 0, 0));

    if (actions.length > 0) {
      if (isPastDate) {
        return (
          <div style={{ textAlign: 'center' }}>
            <Badge count={actions.length} style={{ backgroundColor: 'darkblue' }} />
          </div>
        );
      } else if (dateStr === now.toLocaleDateString()) {
        const upcomingActions = actions.filter(action => new Date(action.activity_time) > now);
        const pastActions = actions.filter(action => new Date(action.activity_time) <= now);

        return (
          <div style={{ textAlign: 'center' }}>
            {pastActions.length > 0 && (
              <Badge count={pastActions.length} style={{ backgroundColor: 'darkblue', marginRight: 4 }} />
            )}
            {upcomingActions.length > 0 && (
              <Badge count={upcomingActions.length} style={{ backgroundColor: '#52c41a' }} />
            )}
          </div>
        );
      } else {
        return (
          <div style={{ textAlign: 'center' }}>
            <Badge count={actions.length} style={{ backgroundColor: '#52c41a' }} />
          </div>
        );
      }
    }

    return <div style={{ textAlign: 'center' }}><Badge count={0} /></div>;
  };

  const filteredEvents = selectedDate ? (scheduledActions[selectedDate.toDate().toLocaleDateString()] || []) : [];

  // Check if the selected date is before today
  const isPastSelectedDate = selectedDate ? selectedDate.toDate() < new Date().setHours(0, 0, 0, 0) : false;

  console.log("filterede", filteredEvents)
  return (
    <div className="schedule-container">
      <h2 className="schedule-title">Scheduled Actions</h2>
      <DatePicker onChange={(date) => setSelectedDate(date)} style={{ marginBottom: 16 }} />
      <Calendar dateCellRender={dateCellRender} onSelect={handleDateClick} style={{ marginBottom: 16 }} />

      <Modal
        title={`Scheduled Activities for ${selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}`}
        visible={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          !isPastSelectedDate && ( // Only show the button if the selected date is today or in the future
            <Button key="add" type="primary" onClick={openScheduleModal}>
              <AiOutlinePlus /> Schedule New Action
            </Button>
          ),
        ]}
      >
        <div className="actions-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((action, index) => (
              <div key={index} className={`action-card ${action.status === 'Cancelled' ? 'past-event' : ''}`}>
                <h3>{action.selectedService}</h3>
                <p><strong>Type:</strong> {action.action_type === 'automatic' ? 'Automatic Action' : 'Alert'}</p>
                <p><strong>User:</strong> {users?users[action.user_id]:action.user_id}</p>
                <p><strong>Service:</strong> {services?services[action.service_id].name:action.service_id}</p>
                <p><strong>Reason:</strong> {action.schedule_reason}</p>
                <p><strong>Date:</strong> {new Date(action.activity_time).toLocaleString()}</p>
                <p><strong>Action:</strong> {action.service_action.charAt(0).toUpperCase() + action.service_action.slice(1)}</p>
                <p><strong>Status:</strong> {action.status}</p>
              </div>
            ))
          ) : (
            <p className="no-events-message">No events scheduled for this date.</p>
          )}
        </div>
      </Modal>

      <Modal
        title="Schedule New Action"
        visible={scheduleModalVisible}
        onCancel={() => setScheduleModalVisible(false)}
        footer={null}
      >
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

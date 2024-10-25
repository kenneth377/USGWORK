import React, { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { Button, Form, Input, Select, DatePicker, Modal, Calendar, Badge } from 'antd';
import './styles/schedule.css'; // Make sure to include your CSS styles

const { Option } = Select;

const initialEvents = [
  {
    selectedService: "Auth Service",
    actionTime: "2024-10-25T10:00:00Z",
    actionType: "alert",
    scheduleReason: "Routine check",
    serviceAction: "start",
    status: "Executed"
  },
  {
    selectedService: "Auth Service",
    actionTime: "2024-09-25T10:00:00Z",
    actionType: "alert",
    scheduleReason: "Routine check",
    serviceAction: "start",
    status: "Executed"
  },
  {
    selectedService: "Database Service",
    actionTime: "2024-10-25T14:00:00Z",
    actionType: "automatic",
    scheduleReason: "Database maintenance",
    serviceAction: "stop",
    status: "Failed"
  },
  {
    selectedService: "API Gateway",
    actionTime: "2024-10-26T16:00:00Z",
    actionType: "alert",
    scheduleReason: "Health check",
    serviceAction: "start",
    status: "pending"
  },
];

export default function Scheduler() {
  const [scheduledActions, setScheduledActions] = useState(initialEvents);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [pastEventDates, setPastEventDates] = useState(new Set()); // Track past event dates

  // Add new action to the list of scheduled actions
  const handleScheduleAction = (values) => {
    const newAction = {
      selectedService: values.selectedService,
      actionTime: values.actionTime.format(),
      actionType: values.actionType,
      scheduleReason: values.scheduleReason,
      serviceAction: values.serviceAction,
      status: values.status || "Scheduled"
    };

    setScheduledActions((prev) => [...prev, newAction]);

    // Add the date to pastEventDates if it's in the past
    const actionDate = new Date(newAction.actionTime).toLocaleDateString();
    if (new Date(newAction.actionTime) < new Date()) {
      setPastEventDates((prev) => new Set(prev).add(actionDate));
    }

    form.resetFields();
    setPopupVisible(false);
  };

  // Handle date selection change
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Count events for a particular date
  const getEventCount = (date) => {
    return scheduledActions.filter(action => {
      const actionDate = new Date(action.actionTime);
      return actionDate.toLocaleDateString() === date.toDate().toLocaleDateString();
    }).length;
  };

  // Filter events based on the selected date
  const filteredEvents = selectedDate
    ? scheduledActions.filter(action => {
        const actionDate = new Date(action.actionTime);
        return actionDate.toLocaleDateString() === selectedDate.toDate().toLocaleDateString();
      })
    : [];

  // Render events count with color change for past events
  const dateCellRender = (value) => {
    const count = getEventCount(value);
    const isPast = value.toDate() < new Date(); // Check if the date is in the past
    const hasPastEvents = count > 0 && isPast;

    return (
      <div style={{ textAlign: 'center' }}>
        <Badge
          count={count}
          style={{ backgroundColor: hasPastEvents ? '#00008b' : '#52c41a' }} // Dark blue for past dates with events
        />
      </div>
    );
  };

  // Handle clicking on a date to show events
  const handleDateClick = (value) => {
    setSelectedDate(value);
  };

  // Cancel action and set status to "Cancelled"
  const handleCancelAction = (index) => {
    console.log(scheduledActions[index])
    setScheduledActions((prev) =>
      prev.map((action, i) =>
        i === index ? { ...action, status: "Cancelled" } : action
      )
    );
  };

  return (
    <div className="schedule-container">
      <h2 className="schedule-title">Scheduled Actions</h2>

      {/* Date Picker */}
      <DatePicker onChange={handleDateChange} style={{ marginBottom: 16 }} />

      {/* Calendar View with Event Counts */}
      <Calendar
        dateCellRender={dateCellRender}
        onSelect={handleDateClick}
        style={{ marginBottom: 16 }}
      />

      <div className="actions-list">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((action, index) => {
            const actionDateTime = new Date(action.actionTime);
            const isPastEvent = actionDateTime < new Date(); // Check if the event is in the past

            return (
              <div key={index} className={`action-card ${isPastEvent ? 'past-event' : ''}`}>
                <h3>{action.selectedService}</h3>
                <p><strong>Type:</strong> {action.actionType === 'automatic' ? 'Automatic Action' : 'Alert'}</p>
                <p><strong>Reason:</strong> {action.scheduleReason}</p>
                <p><strong>Date:</strong> {actionDateTime.toLocaleString()}</p>
                <p><strong>Action:</strong> {action.serviceAction.charAt(0).toUpperCase() + action.serviceAction.slice(1)}</p>
                <p><strong>Status:</strong> {action.status}</p>
                
                {/* Show Cancel button only if the status is "Pending" */}
                {action.status === "pending" && (
                  <Button
                    className="cancel-button"
                    onClick={() => handleCancelAction(index)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="no-events-message">No events scheduled for this date.</p>
        )}
      </div>

      <Button type="primary" className="floating-button" onClick={() => setPopupVisible(true)}>
        <AiOutlinePlus size={24} />
      </Button>

      {/* Ant Design Modal for Scheduling */}
      <Modal
        title="Schedule New Action"
        visible={popupVisible}
        onCancel={() => setPopupVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleScheduleAction}>
          <Form.Item
            name="selectedService"
            label="Select Service"
            rules={[{ required: true, message: 'Please select a service!' }]}
          >
            <Select placeholder="--Select a Service--">
              <Option value="Auth Service">Auth Service</Option>
              <Option value="Database Service">Database Service</Option>
              <Option value="API Gateway">API Gateway</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="actionTime"
            label="Action Date and Time"
            rules={[{ required: true, message: 'Please select date and time!' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="actionType"
            label="Action Type"
            rules={[{ required: true, message: 'Please select action type!' }]}
          >
            <Select placeholder="Select action type">
              <Option value="alert">Alert</Option>
              <Option value="automatic">Automatic Action</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleReason"
            label="Reason for Scheduling"
            rules={[{ required: true, message: 'Please provide a reason!' }]}
          >
            <Input placeholder="Why are you scheduling this action?" />
          </Form.Item>

          <Form.Item
            name="serviceAction"
            label="Service Action"
            rules={[{ required: true, message: 'Please select service action!' }]}
          >
            <Select placeholder="Select service action">
              <Option value="start">Start</Option>
              <Option value="stop">Stop</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="schedule-button">
              Schedule
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

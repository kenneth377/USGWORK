import React, { useContext, useEffect, useState } from 'react';
import { Spin, Modal, Input, message } from 'antd';
import './styles/services.css';
import { FetchData, postData, updateData } from './Fectchdata';
import { Allcontext } from '../Allcontext';

const servicesData = Array.from({ length: 24 }, (_, index) => ({
  id: index + 1,
  name: `Service ${index + 1}`,
  isRunning: 0,
}));

const Services = () => {
  const [services, setServices] = useState(servicesData);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReasonModalVisible, setIsReasonModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [reason, setReason] = useState('');
  const [password, setPassword] = useState('');
  const { nowuser } = useContext(Allcontext);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await FetchData('http://localhost:3000/services');
        setServices(data.data);
      } catch (error) {
        message.error('Error fetching services');
      }
    };
    fetchServices();
  }, []);

  const showToggleConfirmation = (service) => {
    setSelectedService(service);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    setIsReasonModalVisible(true);
  };

  const handleReasonModalOk = () => {
    if (reason.trim().length < 5) {
      message.error('Reason must be at least 5 characters long.');
      return;
    }
    
    setIsReasonModalVisible(false);
    setIsPasswordModalVisible(true);
  };

  const handlePasswordModalOk = async () => {
    setConfirmLoading(true);

    try {
      const loginResponse = await fetch('http://localhost:3000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: nowuser.email,
          password,
        }),
      });
      const loginData = await loginResponse.json();

      if (loginData.responsestatus === 'success') {
        const newStatus = selectedService.isRunning === 1 ? 0 : 1;
        const response = await updateData(`http://localhost:3000/service/${selectedService.id}`, {
          isRunning: newStatus,
          reason,
        });

        if (response.success) {
          setServices((prevServices) =>
            prevServices.map((s) =>
              s.id === selectedService.id ? { ...s, isRunning: newStatus } : s
            )
          );
          message.success(`Service ${newStatus ? 'started' : 'stopped'} successfully`);

          const logEntry = {
            service_id: selectedService.id,
            user_id: nowuser.id,
            action: newStatus === 1 ? 'start' : 'stop',
            reason,
            timestamp: new Date().toISOString(),
          };
          await postData('http://localhost:3000/logs', logEntry);
        } else {
          message.error('Failed to update service status');
        }
      } else {
        message.error('Password is incorrect');
      }
    } catch (error) {
      message.error('Error toggling service');
    } finally {
      setConfirmLoading(false);
      setIsPasswordModalVisible(false);
      setPassword('');
      setReason('');
    }
  };

  return (
    <div className="rack-container">
      {loading && <Spin className="loading-spinner" />}
      <div className="rack">
        {services.map((service) => (
          <div className={`service-slot ${service.isRunning === 1 ? 'on' : 'off'}`} key={service.id}>
            <div className="service-details">
              <div className="service-name" title={service.name}>
                {service.name}
              </div>
              {service.isRunning === 1 && <Spin size="small" style={{ marginRight: '10px' }} />}
              <button className="toggle-btn" onClick={() => showToggleConfirmation(service)}>
                {service.isRunning === 1 ? 'Turn Off' : 'Turn On'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        title={`Do you want to ${selectedService?.isRunning ? 'stop' : 'start'} this service?`}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <p>Confirm your action</p>
      </Modal>

      <Modal
        title="Please provide a reason"
        visible={isReasonModalVisible}
        onOk={handleReasonModalOk}
        onCancel={() => setIsReasonModalVisible(false)}
      >
        <Input.TextArea
          placeholder="Reason for this action"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>

      <Modal
        title="Enter your password to confirm"
        visible={isPasswordModalVisible}
        onOk={handlePasswordModalOk}
        onCancel={() => setIsPasswordModalVisible(false)}
        confirmLoading={confirmLoading}
      >
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default Services;

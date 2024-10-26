import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Input, Button } from 'antd';
import "./styles/sidebar.css";
import { FaServer } from 'react-icons/fa';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [lockdownStep, setLockdownStep] = useState(0);
  const [password, setPassword] = useState('');
  const [inLockdown, setInLockdown] = useState(false);

  const handleLockdown = () => {
    if (location.pathname === '/services') {
      navigate('/'); 
    }
    setLockdownStep(1);
  };

  const handleConfirm = () => {
    if (lockdownStep < 4) {
      setLockdownStep(lockdownStep + 1);
    } else {
      setInLockdown(true);
      setLockdownStep(0);
      setPassword('');
    }
  };

  const handleCancel = () => {
    setLockdownStep(0);
    setPassword('');
  };

  const handleExitLockdown = () => {
    setLockdownStep(1);
  };

  const handleExitConfirm = () => {
    
    if (lockdownStep < 4) {
      setLockdownStep(lockdownStep + 1);
    } else {
      setInLockdown(false); 
      setLockdownStep(0);
      setPassword('');
    }
  };

  return (
    <div className='sidebar'>
      <div className="logo">bankdash</div>

      <div className="navlinks">
        <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
        {!inLockdown && (
          <Link to="/services" className={`link ${location.pathname === '/services' ? 'active' : ''}`}>Service management</Link>
        )}
        <Link to="/activities" className={`link ${location.pathname === '/activities' ? 'active' : ''}`}>Activity logs</Link>
        <Link to="/scheduler" className={`link ${location.pathname === '/scheduler' ? 'active' : ''}`}>Scheduler</Link>
      </div>

      <div className="logandlock">
        {inLockdown ? (
          <p className="link" style={{ color: 'red' }} onClick={handleExitLockdown}>
            Exit Lockdown
          </p>
        ) : (
          <p className="link" onClick={handleLockdown}>
            Lockdown
          </p>
        )}
        <p className="link">Logout</p>
      </div>

      <Modal
        title="Confirm Lockdown"
        visible={lockdownStep > 0}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            {lockdownStep < 4 ? 'Yes, Continue' : 'Submit Password'}
          </Button>
        ]}
      >
        {lockdownStep < 4 ? (
          <p>Are you sure you want to proceed to lockdown? Step {lockdownStep} of 4</p>
        ) : (
          <div>
            <p>Please enter your password to confirm lockdown:</p>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        )}
      </Modal>

      <Modal
        title="Confirm Exit Lockdown"
        visible={lockdownStep > 0 && inLockdown}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
          <Button key="confirm" type="primary" onClick={handleExitConfirm}>
            {lockdownStep < 4 ? 'Yes, Continue' : 'Submit Password'}
          </Button>
        ]}
      >
        {lockdownStep < 4 ? (
          <p>Are you sure you want to exit lockdown? Step {lockdownStep} of 4</p>
        ) : (
          <div>
            <p>Please enter your password to confirm exit from lockdown:</p>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

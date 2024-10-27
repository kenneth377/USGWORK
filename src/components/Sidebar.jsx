import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Modal, Input, Button, message } from 'antd';
import "./styles/sidebar.css";
import { Allcontext } from '../Allcontext';
import logoimg from "./img/logoimg.png"

export default function Sidebar({ setIsAuthenticated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [lockdownStep, setLockdownStep] = useState(0);
  const [password, setPassword] = useState('');
  const [inLockdown, setInLockdown] = useState(false);
  const { nowuser } = useContext(Allcontext);

  const handleLockdown = () => {
    if (location.pathname === '/services') {
      navigate('/'); 
    }
    setLockdownStep(1);
  };

  const handleConfirm = async () => {
    if (lockdownStep < 4) {
      setLockdownStep(lockdownStep + 1);
    } else {
      // Verify password
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
        setInLockdown(true);
        setLockdownStep(0);
        setPassword('');
      } else {
        message.error('Password is incorrect');
      }
    }
  };

  const handleCancel = () => {
    setLockdownStep(0);
    setPassword('');
  };

  const handleExitLockdown = () => {
    setLockdownStep(1);
  };

  const handleExitConfirm = async () => {
    if (lockdownStep < 4) {
      setLockdownStep(lockdownStep + 1);
    } else {
      // Verify password before exiting lockdown
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
        setInLockdown(false);
        setLockdownStep(0);
        setPassword('');
      } else {
        message.error('Password is incorrect');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken'); // Clear the token
    setIsAuthenticated(false); // Update authentication state
    navigate('/login'); // Redirect to login page
  };

  return (
    <div className='sidebar'>
      <div className="logo">
        <img src={logoimg} alt="" style={{width:"30px", height:"30px"}}/>
        <p>bankdash</p>
      </div>

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
        <p className="link" onClick={handleLogout}>Logout</p>
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./styles/sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className='sidebar'>
      <div className="logo">
        bankdash
      </div>

      <div className="navlinks">
        <Link to="/" className={`link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
        <Link to="/services" className={`link ${location.pathname === '/services' ? 'active' : ''}`}>Service management</Link>
        <Link to="/activities" className={`link ${location.pathname === '/activities' ? 'active' : ''}`}>Activity logs</Link>
        <Link to="/scheduler" className={`link ${location.pathname === '/scheduler' ? 'active' : ''}`}>Scheduler</Link>
      </div>

      <div className="logandlock">
        <p className="link">Lockdown</p>
        <p className="link">Logout</p>
      </div>
    </div>
  );
}

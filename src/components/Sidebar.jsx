import React from 'react';
import { Link } from 'react-router-dom';
import "./styles/sidebar.css";

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className="logo">
        bankdash
      </div>

      <div className="navlinks">
        <Link to="/" className="link">Dashboard</Link>
        <Link to="/services" className="link">Service management</Link>
        <Link to="/activities" className="link">Activity logs</Link>
        <Link to="/scheduler" className="link">Scheduler</Link>
      </div>

      <div className="logandlock">
        <p className="link">Lockdown</p>
        <p className="link">Logout</p>
      </div>
    </div>
  );
}

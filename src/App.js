import React from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Services from './components/Services';
import Scheduler from './components/Scheduler';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <Header />
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/scheduler" element={<Scheduler />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

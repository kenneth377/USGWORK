import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Services from './components/Services';
import Scheduler from './components/Scheduler';
import Login from './components/Loginpage';
import { FetchData } from './components/Fectchdata';
import { Allcontext } from './Allcontext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activityData, setActivityData] = useState([]);
  const [services, setServices] = useState({});
  const [users, setUsers] = useState({});
  const [scheduledActions, setScheduledActions] = useState({});
  const [nowuser, setNowuser] = useState({})
  const [otherservice, setOtherservice] = useState([])

  const fetchData = async () => {
    const fetchLogs = async () => {
      try {
        const data = await FetchData('http://localhost:3000/logs');
        setActivityData(data.data || []);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    const fetchServices = async () => {
      try {
        const data = await FetchData('http://localhost:3000/services');
     
        const servicesMap = data.data.reduce((map, service) => {
          map[service.id] = service.name;
          return map;
        }, {});
        setOtherservice(data.data)
        setServices(servicesMap);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await FetchData('http://localhost:3000/users');
        const usersMap = data.users.reduce((map, user) => {
          map[user.id] = user.name;
          return map;
        }, {});
        setUsers(usersMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchScheduledActions = async () => {
      try {
        const response = await FetchData('http://localhost:3000/scheduled-activities');
        setScheduledActions(response.data);
      } catch (error) {
        console.error('Error fetching scheduled actions:', error);
      }
    };

    fetchLogs();
    fetchServices();
    fetchUsers();
    fetchScheduledActions();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);
  console.log("atyy", otherservice)

  return (
    <Allcontext.Provider value={{ users, services, activityData, scheduledActions ,nowuser, setNowuser, otherservice}}>
      <Router>
        <div className="App">
          {isAuthenticated ? (
            <>
              <Sidebar setIsAuthenticated={setIsAuthenticated} /> {/* Pass the prop */}
              <Header />
              <div className="content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/activities" element={<Activities />} />
                  <Route path="/scheduler" element={<Scheduler />} />
                </Routes>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} nowuser={nowuser} setNowuser={setNowuser}/>} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
        </div>
      </Router>
    </Allcontext.Provider>
  );
}

export default App;

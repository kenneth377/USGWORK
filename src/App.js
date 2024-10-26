import React ,{useEffect,useState} from 'react';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Services from './components/Services';
import Scheduler from './components/Scheduler';
import { FetchData } from './components/Fectchdata';
import { Allcontext } from './Allcontext';

function App() {

  const [activityData, setActivityData] = useState([]);
  const [services, setServices] = useState({});
  const [users, setUsers] = useState({});
  const [scheduledActions, setScheduledActions] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await FetchData('http://localhost:3000/logs');
        setActivityData(data.data || []);
        console.log("appacts", data.data)
      } catch (error) {
        console.error("Error fetching activity data:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const data = await FetchData('http://localhost:3000/services');
        const servicesMap = data.data.reduce((map, service) => {
          map[service.id] = service.name; 
          return map;
        }, {});
        console.log("appuservs", servicesMap)
        setServices(servicesMap);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const data = await FetchData('http://localhost:3000/users');
        const usersMap = data.users.reduce((map, user) => {
          map[user.id] = user.name;
          return map;
        }, {});
        console.log("appusers", usersMap)
        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const fetchScheduledActions = async () => {
      try {
        const response = await FetchData('http://localhost:3000/scheduled-activities');
        if (response.responsestatus === "success") {
          // const actionsByDate = response.data.reduce((acc, action) => {
          //   const date = new Date(action.activity_time).toLocaleDateString();
          //   if (!acc[date]) acc[date] = [];
          //   acc[date].push(action);
          //   return acc;
          // }, {});
          // setScheduledActions(actionsByDate);
          setScheduledActions(response.data)
        }
      } catch (error) {
        console.error("Error fetching scheduled actions:", error);
      }
    };

    fetchScheduledActions();
    fetchLogs();
    fetchServices();
    fetchUsers();
  }, []);


  return (
    <Allcontext.Provider value={{users, services, activityData, scheduledActions}}>

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
    </Allcontext.Provider>
  );
}

export default App;

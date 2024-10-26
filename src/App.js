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

    fetchLogs();
    fetchServices();
    fetchUsers();
  }, []);


  return (
    <Allcontext.Provider value={{users, services, activityData}}>

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

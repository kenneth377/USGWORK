import React, { useState, useEffect } from 'react';
import './styles/activities.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import imgavatar from "../components/img/avatar.svg";
import { FetchData } from './Fectchdata';

// Sample model data
const mockDat = [
  { id: 1, service_id: 'Auth Service', user_id: 'User1', action: 'started', reason: 'Initial setup', timestamp: '2024-10-24 12:00:00' },
  { id: 2, service_id: 'Database Service', user_id: 'User2', action: 'stopped', reason: 'Maintenance', timestamp: '2024-10-24 12:05:00' },
  { id: 3, service_id: 'API Gateway', user_id: 'User3', action: 'started', reason: 'Scaling up', timestamp: '2024-10-24 12:10:00' },
  { id: 4, service_id: 'Logging Service', user_id: 'User1', action: 'started', reason: 'Daily log', timestamp: '2024-10-24 12:15:00' },
  { id: 5, service_id: 'Monitoring Service', user_id: 'User2', action: 'stopped', reason: 'Server downtime', timestamp: '2024-10-24 12:20:00' },
  { id: 6, service_id: 'Cache Service', user_id: 'User3', action: 'started', reason: 'Cache refresh', timestamp: '2024-10-24 12:25:00' },
  { id: 7, service_id: 'Email Service', user_id: 'User1', action: 'stopped', reason: 'User request', timestamp: '2024-10-24 12:30:00' },
  { id: 8, service_id: 'Payment Service', user_id: 'User2', action: 'started', reason: 'New deployment', timestamp: '2024-10-24 12:35:00' },
  { id: 9, service_id: 'Notification Service', user_id: 'User3', action: 'started', reason: 'Event trigger', timestamp: '2024-10-24 12:40:00' },
  { id: 10, service_id: 'User Management', user_id: 'User1', action: 'stopped', reason: 'User logout', timestamp: '2024-10-24 12:45:00' },
];

export default function Activities() {
  const [filterAction, setFilterAction] = useState('');
  const [filterTimestamp, setFilterTimestamp] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [mockData, setMockdata] = useState(mockDat)

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await FetchData('http://localhost:3000/logs');
        console.log("Fetched data:", data);
        setMockdata(data.data)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchLogs(); // Don't forget to call the async function!
  }, []); // Empty dependency array so it runs once after the initial render

  const filteredData = mockData.filter((activity) => {
    const matchesAction = filterAction ? activity.action === filterAction : true;
    const matchesTimestamp = filterTimestamp
      ? activity.timestamp.includes(filterTimestamp)
      : true;
    const matchesSearch = searchTerm
      ? activity.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.id.toString().includes(searchTerm)
      : true;

    return matchesAction && matchesTimestamp && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, filterTimestamp, searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="activities-container">
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="actionFilter">Action</label>
          <select
            id="actionFilter"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="filter-select"
          >
            <option value="">All</option>
            <option value="started">Started</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>

        <div className="filter-item">
          <label htmlFor="timestampFilter">Timestamp</label>
          <input
            type="text"
            id="timestampFilter"
            placeholder="YYYY-MM-DD"
            value={filterTimestamp}
            onChange={(e) => setFilterTimestamp(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="filter-item">
          <label htmlFor="searchFilter">Search</label>
          <input
            type="text"
            id="searchFilter"
            placeholder="Search by user or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="activity-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Service Name</th>
              <th>User</th>
              <th>Action</th>
              <th>Reason</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.service_id}</td>
                  <td>
                    <div className="user-info">
                      <img
                        src={imgavatar}
                        alt={`User ID: ${activity.user_id}`}
                        className="user-avatar"
                      />
                      <span className="user-id">User ID: {activity.user_id}</span>
                    </div>
                  </td>
                  <td>
                    <span className="action-tag">
                      {activity.action === 'started' ? (
                        <FaArrowUp className="icon-started" />
                      ) : (
                        <FaArrowDown className="icon-stopped" />
                      )}
                    </span>
                  </td>
                  <td className="reason-column">{activity.reason}</td>
                  <td>{activity.timestamp}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  No activities have been recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-info">
        {totalPages>0 && `Page ${currentPage} of ${totalPages}`}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

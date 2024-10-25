import React, { useState, useEffect } from 'react';
import './styles/activities.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import imgavatar from "../components/img/avatar.svg";
import { FetchData } from './Fectchdata';

export default function Activities() {
  const [filterAction, setFilterAction] = useState('');
  const [filterTimestamp, setFilterTimestamp] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [activityData, setActivityData] = useState([]); // Fetched data from API

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await FetchData('http://localhost:3000/logs');
        console.log("Fetched data:", data);
        setActivityData(data.data || []); // Assuming `data.data` holds the array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchLogs();
  }, []);

  const filteredData = activityData.filter((activity) => {
    const matchesAction = filterAction ? activity.action === filterAction : true;
    const matchesTimestamp = filterTimestamp ? activity.timestamp.includes(filterTimestamp) : true;
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
                  <td className="reason-column">
                    {activity.reason.length > 30
                      ? `${activity.reason.slice(0, 30)}...`
                      : activity.reason}
                  </td>
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
          {totalPages > 0 && `Page ${currentPage} of ${totalPages}`}
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

import React, { useState, useEffect } from 'react';
import './styles/activities.css';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import imgavatar from "../components/img/avatar.svg";
import { FetchData } from './Fectchdata';
import { Modal, DatePicker } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(isBetween);
dayjs.extend(advancedFormat);

const { RangePicker } = DatePicker;

export default function Activities() {
  const [filterAction, setFilterAction] = useState('');
  const [dateRange, setDateRange] = useState([null, null]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [activityData, setActivityData] = useState([]);
  const [services, setServices] = useState({});
  const [users, setUsers] = useState({});
  const [selectedActivity, setSelectedActivity] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await FetchData('http://localhost:3000/logs');
        setActivityData(data.data || []);
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
        setUsers(usersMap);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchLogs();
    fetchServices();
    fetchUsers();
  }, []);

  const filteredData = activityData.filter((activity) => {
    const matchesAction = filterAction ? activity.action === filterAction : true;
    const [startDate, endDate] = dateRange; 

    const activityDate = dayjs(activity.timestamp);
    const matchesDateRange = Array.isArray(dateRange) && dateRange.every(date => date)
      ? activityDate.isBetween(dayjs(startDate), dayjs(endDate), null, '[]')
      : true;

    const matchesSearch = searchTerm
      ? activity.user_id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.id.toString().includes(searchTerm)
      : true;

    return matchesAction && matchesDateRange && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterAction, dateRange, searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleRowClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleModalClose = () => {
    setSelectedActivity(null);
  };

  const truncateText = (text, maxLength = 15) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

  const formatTimestamp = (timestamp) => dayjs(timestamp).format('MMMM D, YYYY h:mm A');

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
          <label htmlFor="dateRangeFilter">Date Range</label>
          <RangePicker
            id="dateRangeFilter"
            format="YYYY-MM-DD"
            value={dateRange}
            onChange={(dates) => setDateRange(dates || [null, null])}
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
                <tr
                  key={activity.id}
                  onClick={() => handleRowClick(activity)}
                  style={{
                    backgroundColor: activity.id % 2 === 0 ? '#081028' : '#1f1d2f',
                  }}
                >
                  <td>{activity.id}</td>
                  <td>{truncateText(services[activity.service_id] || "Unknown Service")}</td>
                  <td>
                    <div className="user-info">
                      <img
                        src={imgavatar}
                        alt={`User ID: ${activity.user_id}`}
                        className="user-avatar"
                      />
                      <span className="user-id">{truncateText(users[activity.user_id] || "Unknown User")}</span>
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
                    {activity.reason.length > 10 ? `${activity.reason.slice(0, 10)}...` : activity.reason}
                  </td>
                  <td>{formatTimestamp(activity.timestamp)}</td>
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

      <Modal
        title="Activity Details"
        visible={!!selectedActivity}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedActivity && (
          <div className="activity-details">
            <p><strong>ID:</strong> {selectedActivity.id}</p>
            <p><strong>Service Name:</strong> {services[selectedActivity.service_id] || "Unknown Service"}</p>
            <p><strong>User:</strong> {users[selectedActivity.user_id] || "Unknown User"}</p>
            <p><strong>Action:</strong> {selectedActivity.action}</p>
            <p><strong>Reason:</strong> {selectedActivity.reason}</p>
            <p><strong>Timestamp:</strong> {formatTimestamp(selectedActivity.timestamp)}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

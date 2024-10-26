import React, { useContext, useState } from 'react';
import { Modal, Button } from 'antd';
import "./styles/dashboard.css";
import { Allcontext } from '../Allcontext';
import DoughnutChart from './DoughnutChart';
import Linegraph from './Linegraph';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { users, services, activityData, scheduledActions } = useContext(Allcontext);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Check if scheduledActions is an array, or else default to an empty array
    const recentsched = Array.isArray(scheduledActions) ? scheduledActions.slice(0, 3) : [];

    const navigate = useNavigate();

    const usertoactionsmap = activityData.reduce((acc, obj) => {
        const existing = acc.find(item => item.user_id === obj.user_id);
        if (existing) {
            existing.count += 1;
        } else {
            acc.push({ user_id: obj.user_id, count: 1 });
        }
        return acc;
    }, []);

    const sortedUsers = usertoactionsmap.sort((a, b) => b.count - a.count);
    const maxUser = sortedUsers[0];

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    const isLoading = !users || !activityData || !services;
    const refinedsched = recentsched.map((item)=>{

    })

    return (
        <div className='dashboard'>
            {isLoading ? (
                <div>LOADING...</div>
            ) : (
                <div className="mindatabox">
                    <div className='minidata'>
                        <p className="minihead">Total services</p>
                        <p className="minicount">{Object.keys(services).length}</p>
                    </div>
                    <div className='minidata'>
                        <p className="minihead">Total Logs</p>
                        <p className="minicount">{activityData.length}</p>
                    </div>
                    <div className='minidata miniuser' onClick={handleOpenModal}>
                        <p className="minihead">Most active User</p>
                        {maxUser && users[maxUser.user_id] ? (
                            <p className="usermini">
                                <span className="activeusername">{users[maxUser.user_id].slice(0, 10)}...</span> {maxUser.count} actions
                            </p>
                        ) : (
                            <p className="usermini">No active user found.</p>
                        )}
                    </div>
                    <div className='minidata'>
                        <p className="minihead">Additional Info</p>
                        <p className="minicount">24</p>
                    </div>
                </div>
            )}
            <div className="graphsbox">
                <div className="maingraph" style={{ padding: "10px" }}>
                    <Linegraph />
                </div>
                <div className="others">
                    <div className="firstminor">
                        <DoughnutChart />
                    </div>
                    <div className="lastminor">
                        <div>Recently scheduled activities</div>
                        {recentsched.length > 0 ? (
                            recentsched.map((item, index) => (
                                <div className="sched" key={index}>
                                    <div className="schedservice">{`${services[item.service_id].slice(0,12)}...` || 'Service'}</div>
                                    <div className="scheduser">{`${users[item.user_id].slice(0,7)}...` || 'User'}</div>
                                    <div className="schedaction">{item.service_action || 'Action'}</div>
                                </div>
                            ))
                        ) : (
                            <div>No recent scheduled activities.</div>
                        )}
                        <button className='schedbtn' onClick={() => {
                            navigate("/scheduler")
                        }}>See all</button>
                    </div>
                </div>
            </div>

            <Modal
                title="User Actions"
                visible={isModalVisible}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
            >
                <ul>
                    {sortedUsers.map(user => (
                        <li key={user.user_id}>
                            User: {users[user.user_id] ? users[user.user_id] : 'Unknown User'}, &nbsp; Logs: {user.count}
                        </li>
                    ))}
                </ul>
            </Modal>
        </div>
    );
}

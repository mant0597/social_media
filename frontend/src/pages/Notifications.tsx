import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import '../App.css';

interface RequestUser {
    _id: string;
    username: string;
}

const Notifications: React.FC = () => {
    const [requests, setRequests] = useState<RequestUser[]>([]);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/users/notifications');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleAccept = async (id: string) => {
        try {
            await api.post(`/users/${id}/accept`);
            setRequests(requests.filter(r => r._id !== id));
        } catch (error) {
            alert('Error accepting request');
        }
    };

    const handleReject = async (id: string) => {
        try {
            await api.post(`/users/${id}/reject`);
            setRequests(requests.filter(r => r._id !== id));
        } catch (error) {
            alert('Error rejecting request');
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="notifications-container">
                    <h2>Follow Requests</h2>
                    {requests.length === 0 ? (
                        <p>No pending requests.</p>
                    ) : (
                        requests.map((user) => (
                            <div key={user._id} className="notification-item">
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <div className="avatar"></div>
                                    <span style={{ fontWeight: '600' }}>{user.username}</span>
                                    <span style={{ marginLeft: '5px' }}>wants to follow you.</span>
                                </div>
                                <div>
                                    <button className="btn-accept" onClick={() => handleAccept(user._id)}>Confirm</button>
                                    <button className="btn-reject" onClick={() => handleReject(user._id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;

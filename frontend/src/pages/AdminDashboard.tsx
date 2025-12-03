import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import '../App.css';

interface User {
    _id: string;
    username: string;
    role: 'user' | 'admin' | 'owner';
}

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const currentUserRole = localStorage.getItem('role');

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await api.delete(`/admin/users/${id}`);
                fetchUsers();
            } catch (error: any) {
                alert(error.response?.data?.message || 'Error deleting user');
            }
        }
    };

    const handleRoleUpdate = async (id: string, newRole: string) => {
        try {
            await api.patch(`/admin/users/${id}/role`, { role: newRole });
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error updating role');
        }
    };

    if (currentUserRole !== 'admin' && currentUserRole !== 'owner') {
        return <div style={{ padding: '20px' }}>Access Denied</div>;
    }

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    <h2>Admin Dashboard</h2>
                    <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #dbdbdb', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #dbdbdb' }}>Username</th>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #dbdbdb' }}>Role</th>
                                    <th style={{ padding: '15px', borderBottom: '1px solid #dbdbdb' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} style={{ borderBottom: '1px solid #efefef' }}>
                                        <td style={{ padding: '15px' }}>{user.username}</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                background: user.role === 'owner' ? '#ffd700' : user.role === 'admin' ? '#e0e0e0' : 'transparent',
                                                fontWeight: '500'
                                            }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px' }}>
                                            {currentUserRole === 'owner' && user.role !== 'owner' && (
                                                <>
                                                    {user.role === 'user' && (
                                                        <button
                                                            onClick={() => handleRoleUpdate(user._id, 'admin')}
                                                            style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
                                                        >
                                                            Promote
                                                        </button>
                                                    )}
                                                    {user.role === 'admin' && (
                                                        <button
                                                            onClick={() => handleRoleUpdate(user._id, 'user')}
                                                            style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}
                                                        >
                                                            Demote
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                            {user.role !== 'owner' && (
                                                <button
                                                    onClick={() => handleDelete(user._id)}
                                                    style={{ background: '#ed4956', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

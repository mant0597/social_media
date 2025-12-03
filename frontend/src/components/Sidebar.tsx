import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className="sidebar">
            <div className="sidebar-logo">Inkle Feed</div>
            <div className="nav-item" onClick={() => navigate('/feed')}>
                <span>🏠 Home</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/search')}>
                <span>🔍 Search</span>
            </div>
            <div className="nav-item" onClick={() => navigate('/notifications')}>
                <span>❤️ Notifications</span>
            </div>
            <div className="nav-item" onClick={() => navigate(`/profile/${localStorage.getItem('userId')}`)}>
                <span>👤 Profile</span>
            </div>
            {(role === 'admin' || role === 'owner') && (
                <div className="nav-item" onClick={() => navigate('/admin')}>
                    <span>🛡️ Admin</span>
                </div>
            )}
            <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto' }}>
                <span>🚪 Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import Search from './pages/Search';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/search" element={<Search />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/profile/:id" element={<Profile />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
};

export default App;

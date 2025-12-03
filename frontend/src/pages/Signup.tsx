import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../Auth.css';

const Signup: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', { username, password });
            alert('Signup successful! Please login.');
            navigate('/');
        } catch (error) {
            alert('Signup failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="shape shape-1"></div>
                <div className="auth-left-content">
                    <h1>Join the Inkle Community.</h1>
                    <p>Connect with investors and founders on the most powerful platform.</p>
                    <img src="/auth_hero_illustration.png" alt="Hero" className="hero-image" />
                </div>
            </div>

            <div className="auth-right">
                <div className="emoji">🚀</div>
                <div className="top-nav">
                    <span>Already a member?</span>
                    <button className="btn-secondary" onClick={() => navigate('/')}>Sign in</button>
                </div>

                <div className="auth-form-container">
                    <h2>Sign up Now.</h2>
                    <span className="subtitle">Create your account below</span>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Username</label>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    placeholder="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-wrapper">
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>Sign up</button>
                    </form>
                </div>
                <div className="shape shape-2"></div>
            </div>
        </div>
    );
};

export default Signup;

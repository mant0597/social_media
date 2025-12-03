import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import '../Auth.css';
// We will import the generated image later, for now assuming it's in assets or public
// import heroImg from '../assets/auth_hero.png'; 

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.result._id);
            localStorage.setItem('role', data.result.role);
            navigate('/feed');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-left">
                <div className="shape shape-1"></div>
                <div className="auth-left-content">
                    <h1>The World Most Powerful Social Tool.</h1>
                    <p>Create your own network with the Fastest Inkle Building Platform.</p>
                    <img src="/auth_hero_illustration.png" alt="Hero" className="hero-image" />
                </div>
            </div>

            <div className="auth-right">
                <div className="emoji">😍</div>
                <div className="top-nav">
                    <span>Not a member?</span>
                    <button className="btn-secondary" onClick={() => navigate('/signup')}>Sign up now</button>
                </div>

                <div className="auth-form-container">
                    <h2>Sign in Now.</h2>
                    <span className="subtitle">Enter your detail below</span>

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

                        <div className="forgot-password">
                            <a href="#">Forget password?</a>
                        </div>

                        <button type="submit" className="btn-primary">Sign in</button>
                    </form>
                </div>
                <div className="shape shape-2"></div>
            </div>
        </div>
    );
};

export default Login;

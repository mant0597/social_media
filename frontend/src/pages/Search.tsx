import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import '../App.css';

interface UserResult {
    _id: string;
    username: string;
}

const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<UserResult[]>([]);
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query) return;
        try {
            const { data } = await api.get(`/users/search?query=${query}`);
            setResults(data);
        } catch (error) {
            console.error('Error searching users');
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    <h2>Search Users</h2>
                    <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by username..."
                            style={{ padding: '10px', width: '80%', borderRadius: '8px', border: '1px solid #dbdbdb', marginRight: '10px' }}
                        />
                        <button type="submit" style={{ padding: '10px 20px', background: '#0095f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Search</button>
                    </form>

                    <div className="search-results">
                        {results.map((user) => (
                            <div key={user._id} onClick={() => navigate(`/profile/${user._id}`)} style={{ padding: '15px', borderBottom: '1px solid #efefef', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <div className="avatar"></div>
                                <span style={{ fontWeight: '600' }}>{user.username}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Search;

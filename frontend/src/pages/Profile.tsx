import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import '../App.css';

interface Post {
    _id: string;
    content: string;
    createdAt: string;
}

interface UserProfile {
    user: { _id: string; username: string };
    posts: Post[];
    stats: { postsCount: number; followersCount: number; followingCount: number };
    relationship: { isFollowing: boolean; isRequested: boolean; isBlocked: boolean };
}

const Profile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const currentUserId = localStorage.getItem('userId');

    const fetchProfile = async () => {
        try {
            const { data } = await api.get(`/users/${id}`);
            setProfile(data);
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                alert('User not found');
            } else {
                console.error('Error fetching profile');
            }
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const handleFollow = async () => {
        try {
            await api.post(`/users/${id}/follow`);
            fetchProfile();
            alert('Follow request sent');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error following user');
        }
    };

    const handleUnfollow = async () => {
        try {
            await api.post(`/users/${id}/unfollow`);
            fetchProfile();
        } catch (error) {
            alert('Error unfollowing user');
        }
    };

    const handleBlock = async () => {
        if (window.confirm('Are you sure you want to block this user?')) {
            try {
                await api.post(`/users/${id}/block`);
                fetchProfile(); // Refresh to show Unblock button
            } catch (error) {
                alert('Error blocking user');
            }
        }
    };

    const handleUnblock = async () => {
        if (window.confirm('Are you sure you want to unblock this user?')) {
            try {
                await api.post(`/users/${id}/unblock`);
                fetchProfile(); // Refresh to show Follow/Block buttons
            } catch (error) {
                alert('Error unblocking user');
            }
        }
    };

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div style={{ width: '100%', maxWidth: '800px' }}>
                    <div className="profile-header">
                        <div className="profile-avatar"></div>
                        <div className="profile-info">
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                                <h2>{profile.user.username}</h2>
                                {currentUserId !== id && (
                                    <>
                                        {profile.relationship.isBlocked ? (
                                            <button className="btn-block" style={{ marginLeft: '20px', borderColor: '#0095f6', color: '#0095f6' }} onClick={handleUnblock}>Unblock</button>
                                        ) : (
                                            <>
                                                {profile.relationship.isFollowing ? (
                                                    <button className="btn-reject" style={{ marginLeft: '20px' }} onClick={handleUnfollow}>Following</button>
                                                ) : profile.relationship.isRequested ? (
                                                    <button className="btn-reject" style={{ marginLeft: '20px' }}>Requested</button>
                                                ) : (
                                                    <button className="btn-follow" style={{ marginLeft: '20px' }} onClick={handleFollow}>Follow</button>
                                                )}
                                                <button className="btn-block" onClick={handleBlock}>Block</button>
                                            </>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="profile-stats">
                                <div><span className="stat-count">{profile.stats.postsCount}</span> posts</div>
                                <div><span className="stat-count">{profile.stats.followersCount}</span> followers</div>
                                <div><span className="stat-count">{profile.stats.followingCount}</span> following</div>
                            </div>
                            <div>
                                <strong>{profile.user.username}</strong>
                                <p>Inkle Developer Assignment</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                        {profile.posts.map((post) => (
                            <div key={post._id} style={{ background: 'white', height: '250px', border: '1px solid #dbdbdb', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                                {post.content}
                            </div>
                        ))}
                        {profile.posts.length === 0 && <p>No posts yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

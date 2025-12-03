import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Sidebar from '../components/Sidebar';
import '../App.css';

interface Activity {
    _id: string;
    type: string;
    actor: { _id: string; username: string };
    target?: { _id: string; username: string };
    relatedPost?: { _id: string; content: string };
    createdAt: string;
}

const Feed: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [postContent, setPostContent] = useState('');
    const [feedType, setFeedType] = useState<'following' | 'global'>('following');
    const navigate = useNavigate();

    const fetchFeed = async () => {
        try {
            const { data } = await api.get(`/feed?type=${feedType}`);
            setActivities(data);
        } catch (error) {
            console.error('Error fetching feed');
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [feedType]);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/posts', { content: postContent });
            setPostContent('');
            fetchFeed();
        } catch (error) {
            alert('Error creating post');
        }
    };

    const handleLike = async (postId: string) => {
        try {
            await api.post(`/posts/${postId}/like`);
            fetchFeed();
        } catch (error) {
            console.error('Error liking post');
        }
    };

    const handleFollow = async (userId: string) => {
        try {
            await api.post(`/users/${userId}/follow`);
            alert('Follow request sent');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error following user');
        }
    };

    const renderActivityText = (activity: Activity) => {
        switch (activity.type) {
            case 'post_created':
                return (
                    <>
                        <span style={{ fontWeight: '600' }}>{activity.actor.username}</span> made a post
                    </>
                );
            case 'user_followed':
                return (
                    <>
                        <span style={{ fontWeight: '600' }}>{activity.actor.username}</span> followed <span style={{ fontWeight: '600' }}>{activity.target?.username}</span>
                    </>
                );
            case 'post_liked':
                return (
                    <>
                        <span style={{ fontWeight: '600' }}>{activity.actor.username}</span> liked <span style={{ fontWeight: '600' }}>{activity.target?.username}</span>'s post
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <div className="feed-container">
                    {/* Feed Toggles */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '20px' }}>
                        <button
                            onClick={() => setFeedType('following')}
                            style={{
                                background: feedType === 'following' ? '#0095f6' : 'transparent',
                                color: feedType === 'following' ? 'white' : 'black',
                                border: '1px solid #dbdbdb', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            Following
                        </button>
                        <button
                            onClick={() => setFeedType('global')}
                            style={{
                                background: feedType === 'global' ? '#0095f6' : 'transparent',
                                color: feedType === 'global' ? 'white' : 'black',
                                border: '1px solid #dbdbdb', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600'
                            }}
                        >
                            Global Wall
                        </button>
                    </div>

                    {/* Create Post Section */}
                    <div className="post-card" style={{ padding: '20px' }}>
                        <form onSubmit={handleCreatePost}>
                            <textarea
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                style={{ width: '100%', border: 'none', outline: 'none', resize: 'none', fontSize: '1rem' }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <button type="submit" style={{ background: '#0095f6', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>Post</button>
                            </div>
                        </form>
                    </div>

                    {/* Feed Items */}
                    {activities.map((activity) => (
                        <div key={activity._id} className="post-card">
                            {/* Activity Header / Text */}
                            <div className="post-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '10px' }}>
                                    <div className="avatar" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${activity.actor._id}`)}></div>
                                    <div style={{ fontSize: '0.9rem' }}>
                                        {renderActivityText(activity)}
                                    </div>
                                    {activity.actor._id !== localStorage.getItem('userId') && (
                                        <button
                                            onClick={() => handleFollow(activity.actor._id)}
                                            style={{ marginLeft: 'auto', background: 'transparent', color: '#0095f6', border: 'none', fontWeight: '600', cursor: 'pointer', fontSize: '0.8rem' }}
                                        >
                                            Follow
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Content (if post) */}
                            {activity.type === 'post_created' && activity.relatedPost && (
                                <>
                                    <div className="post-content">
                                        {activity.relatedPost.content}
                                    </div>
                                    <div className="post-actions">
                                        <span className="action-icon" onClick={() => handleLike(activity.relatedPost!._id)}>❤️</span>
                                        <span className="action-icon">💬</span>
                                    </div>
                                    <div className="likes-count">0 likes</div>
                                </>
                            )}
                            <div className="timestamp">{new Date(activity.createdAt).toDateString()}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;

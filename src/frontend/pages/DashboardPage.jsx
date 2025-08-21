import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultprofilepic from '../../assets/images/default-profile.jpg';

function DashboardPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user, isLoggedIn, logout } = useAuth();
    const navigate = useNavigate();

    const imageUrl = user?.profilePic
        ? `${API_BASE_URL}/api/profile_picture/${user.profilePic}?t=${Date.now()}`
        : defaultprofilepic;


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <HeaderBar />
            <main style={{
                padding: '2rem',
                paddingBottom: '5rem',
                maxWidth: '900px',
                margin: 'auto',
                fontFamily: 'Arial, sans-serif',
                color: '#222'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '0.5rem',
                    textAlign: 'center'
                }}>
                    User Dashboard
                </h1>

                {isLoggedIn ? (
                    <div style={{
                        backgroundColor: '#f9f9f9',
                        padding: '2rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
                        textAlign: 'center'
                    }}>
                        <img
                            key={user.profilePic}
                            src={imageUrl}
                            alt="Profile"
                            onError={(e) => { e.target.src = defaultprofilepic }}
                            style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                border: '2px solid #ddd',
                                marginBottom: '1rem'
                            }}
                        />
                        <h2 style={{ marginBottom: '0.5rem' }}>Welcome back, <span style={{ color: '#0077cc' }}>{user.username}</span>!</h2>
                        <h3 style={{ fontWeight: 'normal', color: '#555', marginBottom: '2rem' }}>
                            What would you like to do today?
                        </h3>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '1rem'
                        }}>
                            <Link to="/edit-profile" style={buttonStyle}>Edit Profile</Link>
                            <Link to="/leaderboards" style={buttonStyle}>View Leaderboards</Link>
                            <Link to="/settings" style={buttonStyle}>Account Settings</Link>
                            <Link to="/view-achievements" style={buttonStyle}>View Achievements</Link>
                            <Link to="/view-game-reports" style={buttonStyle}>View Game Reports</Link>
                            <button onClick={handleLogout} style={{
                                ...buttonStyle,
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none'
                            }}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <p style={{ textAlign: 'center' }}>
                        Please <Link to="/login" style={{ color: '#0077cc', textDecoration: 'underline' }}>login</Link> to access your dashboard.
                    </p>
                )}
            </main>
            <Footer />
        </>
    );
}

// 🔧 Extracted reusable button style for consistency
const buttonStyle = {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    borderRadius: '8px',
    textDecoration: 'none',
    backgroundColor: '#0077cc',
    color: '#fff',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    cursor: 'pointer'
};

export default DashboardPage;

import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultprofilepic from '../../assets/images/default-profile.jpg';



function AccountSettingsPage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user, isLoggedIn, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const imageUrl = user?.profilePic
        ? `/api/profile_picture/${user.profilePic}?t=${Date.now()}`
        : defaultprofilepic;


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        const res = await fetch(`${API_BASE_URL}/api/change_password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user._id, newPassword }),
        });

        if (res.ok) {
            alert('Password updated!');
            setNewPassword('');
        } else {
            alert('Failed to update password.');
        }
    };

    const handleAccountDelete = async () => {
        const res = await fetch(`${API_BASE}/api/delete_account`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: user._id }),
        });

        if (res.ok) {
            alert('Account deleted.');
            logout();
            navigate('/');
        } else {
            alert('Failed to delete account.');
        }
    };

    const getPasswordStrength = (password) => {
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLong = password.length >= 8;

        const score = [hasLower, hasUpper, hasNumber, hasSpecial, isLong].filter(Boolean).length;

        switch (score) {
            case 5:
                return {
                    label: '🟩 Great job! You are implementing best practices!',
                    color: 'green'
                };
            case 4:
                return {
                    label: '🟧 Almost there. You are almost a step ahead from Mr. Phish.',
                    color: 'orange'
                };
            case 3:
                return {
                    label: '🟨 Good, but you can do better. Mr. Phish is still lurking.',
                    color: '#FFD700'
                };
            case 2:
                return {
                    label: '🟧 You are not out of the woods yet. A little more effort could go a long way.',
                    color: '#ccaa00'
                };
            default:
                return {
                    label: '🟥 Do you have a death wish?! You should make it more complex!',
                    color: 'red'
                };
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <>
            <main style={{
                padding: '2rem',
                paddingBottom: '5rem',
                maxWidth: '700px',
                margin: 'auto',
                fontFamily: 'Arial, sans-serif',
                color: '#222',
                lineHeight: '1.6'
            }}>
                <h1 style={{
                    fontSize: '2rem',
                    marginBottom: '2rem',
                    borderBottom: '2px solid #eee',
                    paddingBottom: '0.5rem'
                }}>
                    Account Settings
                </h1>

                {/* Profile Section */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    backgroundColor: '#f9f9f9',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
                }}>
                    <img src={imageUrl} alt="Profile"
                        style={{
                            width: '150px',
                            height: '150px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            marginBottom: '1rem',
                            border: '2px solid #ddd'
                        }}
                    />
                    <h2 style={{ marginBottom: 0 }}>{user.username}</h2>
                    <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
                </div>

                {/* Change Password Section */}
                <section style={{
                    marginBottom: '3rem',
                    padding: '1.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Change Password</h3>
                    <form onSubmit={handlePasswordChange}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder="New password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                style={{
                                    padding: '0.6rem 1rem',
                                    fontSize: '1rem',
                                    borderRadius: '6px',
                                    border: '1px solid #ccc',
                                    width: '100%',
                                    maxWidth: '300px'
                                }}
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                padding: '0.6rem 1rem',
                                backgroundColor: '#0077cc',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                            >
                            {showPassword ? '🙈 Hide' : '👁️ Show'}
                            </button>
                            
                        </div>
                        {newPassword && (
                            <p style={{
                                marginTop: '0.5rem',
                                fontWeight: 'bold',
                                color: passwordStrength.color
                            }}>
                                {passwordStrength.label}
                            </p>
                        )}
                        <button
                            type="submit"
                            style={{
                                marginTop: '1rem',
                                padding: '0.6rem 1.5rem',
                                fontSize: '1rem',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                            >
                            ✅ Confirm Changes
                        </button>

                        
                    </form>
                    <button
                        type="button"
                        onClick={() => setNewPassword('')}
                        style={{
                            marginTop: '1rem',
                            background: 'none',
                            border: 'none',
                            color: '#555',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                        }}
                        >
                        Cancel
                    </button>


                </section>

                {/* Danger Zone */}
                <section style={{
                    padding: '1.5rem',
                    border: '2px solid #dc3545',
                    backgroundColor: '#fff0f0',
                    borderRadius: '8px'
                }}>
                    <h3 style={{ fontSize: '1.25rem', color: '#dc3545' }}>Danger Zone</h3>
                    {!confirmDelete ? (
                        <button onClick={() => setConfirmDelete(true)} style={{
                            padding: '0.6rem 1rem',
                            fontSize: '1rem',
                            color: '#fff',
                            backgroundColor: '#dc3545',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer'
                        }}>
                            Delete My Account
                        </button>
                    ) : (
                        <>
                            <p style={{ marginBottom: '1rem' }}>Are you sure? This action cannot be undone.</p>
                            <button onClick={handleAccountDelete} style={{
                                padding: '0.6rem 1rem',
                                fontSize: '1rem',
                                backgroundColor: '#dc3545',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                marginRight: '1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}>
                                Yes, delete my account
                            </button>
                            <button onClick={() => setConfirmDelete(false)} style={{
                                padding: '0.6rem 1rem',
                                fontSize: '1rem',
                                backgroundColor: '#ccc',
                                color: '#000',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>
                                Cancel
                            </button>
                        </>
                    )}
                </section>
            </main>
            <Footer />
        </>
    );
}

export default AccountSettingsPage;

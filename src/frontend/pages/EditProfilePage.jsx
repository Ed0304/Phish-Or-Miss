import { useState } from 'react'
import '../../App.css'
import HeaderBar from '../components/HeaderBar'
import Footer from '../components/Footer'
import mrphish from '../../assets/images/Mr-Phish.png'
import defaultprofilepic from '../../assets/images/default-profile.jpg'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth} from '../../contexts/AuthContext'; 

function EditProfilePage() {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const { user, isLoggedIn, logout, refreshUser } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState(user?.username || '');
    const [profilePic, setProfilePic] = useState(null);
    const [preview, setPreview] = useState(defaultprofilepic);
    const imageUrl = user?.profilePic
        ? `${API_BASE_URL}/api/profile_picture/${user.profilePic}?t=${Date.now()}`
        : defaultprofilepic;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("username", username);
        if (profilePic) {
            formData.append("profilePic", profilePic);
        }
        formData.append("id", user._id); 

        const response = await fetch(`${API_BASE_URL}/api/update_profile`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            await refreshUser(); 
            navigate('/dashboard');
        } else {
            alert("Failed to update profile.");
        }
    };

    return (
        <>
            <HeaderBar />
            <main style={{
                padding: '2rem',
                maxWidth: '600px',
                margin: 'auto',
                fontFamily: 'Arial, sans-serif',
                color: '#222'
            }}>
                <h1 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Edit Your Profile
                </h1>

                {isLoggedIn ? (
                    <form onSubmit={handleSubmit} encType="multipart/form-data"
                        style={{
                            backgroundColor: '#f9f9f9',
                            padding: '2rem',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
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
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="username" style={{ fontWeight: 'bold' }}>Username:</label><br />
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    marginTop: '0.3rem',
                                    borderRadius: '5px',
                                    border: '1px solid #ccc',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label htmlFor="profilePic" style={{ fontWeight: 'bold' }}>Change Profile Picture:</label><br />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ marginTop: '0.5rem' }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#0077cc',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005fa3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0077cc'}
                        >
                            Save Changes
                        </button>
                        <div>
                            <button
                                type="button"
                                onClick={() => navigate("/generate-profile-picture")}
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    padding: '0.75rem 1.5rem',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginTop: '1rem',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
                                >
                                Generate Profile Picture with Sogni
                                </button>

                        </div>
                    </form>
                    
                ) : (
                    <p>Please <Link to="/login" style={{ color: '#0077cc', textDecoration: 'underline' }}>login</Link> to edit your profile.</p>
                )}
                
            </main>
            <Footer />
        </>
    );
}

export default EditProfilePage;

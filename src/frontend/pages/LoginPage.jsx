import { useState, useEffect } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [error, setError] = useState(null);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('from') === 'register') {
      setShowSuccessMsg(true);
      setTimeout(() => setShowSuccessMsg(false), 3000);
    }
  }, [location.search]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const user = await response.json();
      login(user);
      navigate('/?from=login');
    } else {
      const errorData = await response.json();
      setError(errorData.error);
    }
  };

  const handleForgotPassword = async () => {
  const usernameInput = prompt("Enter your username:");
  if (!usernameInput) return alert("Username is required!");

  const newPassword = prompt("Enter your new password:");
  if (!newPassword) return alert("New password cannot be empty!");

  const confirmPassword = prompt("Confirm your new password:");
  if (newPassword !== confirmPassword) {
    return alert("❌ Passwords do not match. Please try again.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: usernameInput, newPassword }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("✅ Password reset successful! Please login with your new password.");
    } else {
      alert(`❌ ${data.error}`);
    }
  } catch (err) {
    alert("🚨 Failed to reset password. Please try again later.");
  }
};


  return (
    <>
      <HeaderBar />
      <main style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ maxWidth: '420px', width: '100%', padding: '2rem', borderRadius: '16px', backgroundColor: '#ffffff', boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', border: '1px solid #e0e0e0', textAlign: 'center' }}>
          <img src={mrphish} alt="Mr. Phish" style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: '700', color: '#222' }}>Login</h1>

          {showSuccessMsg && (
            <p style={{ color: 'green', fontWeight: '600', marginBottom: '1rem', background: '#e6ffed', padding: '0.75rem', borderRadius: '8px', border: '1px solid #b2f2bb' }}>
              🎉 Account created successfully! Please log in.
            </p>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem', textAlign: 'left', marginRight: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', marginRight: '0.5rem' }}>Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: '#fff', color: '#000', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }} />
            </div>

            <div style={{ marginBottom: '1rem', textAlign: 'left', marginRight: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', marginRight: '0.5rem' }}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #ccc', fontSize: '1rem', backgroundColor: '#fff', color: '#000', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)' }} />
            </div>

            {error && <p style={{ color: 'red', marginBottom: '1rem', fontWeight: '500' }}>{error}</p>}

            <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0077cc', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginTop: '1rem', transition: 'background-color 0.3s ease' }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#005fa3')} onMouseOut={(e) => (e.target.style.backgroundColor = '#0077cc')}>Login</button>
          </form>

          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#0077cc', textDecoration: 'none', fontWeight: '500' }}>
              Register
            </Link>
          </p>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            <button type="button" style={{ background: 'none', border: 'none', color: '#0077cc', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
              onClick={handleForgotPassword}>Forgot Password?</button>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default LoginPage;

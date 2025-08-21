import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';
import { useNavigate, Link } from 'react-router-dom';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const evaluatePasswordStrength = (pwd) => {
    if (!pwd) return '';

    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[@$!%*?&#]/.test(pwd);
    const isLong = pwd.length >= 8;

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

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    console.log("ENV VALUE:", import.meta.env.VITE_API_BASE_URL);


    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      navigate('/login?from=register');
    } else {
      const errorData = await response.json();
      setError(errorData.error);
    }
  };

  return (
    <>
      <HeaderBar />
      <main
        style={{
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '100%',
            padding: '2rem',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e0e0e0',
            textAlign: 'center',
          }}
        >
          <img
            src={mrphish}
            alt="Mr. Phish"
            style={{
              width: '72px',
              height: '72px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: '1rem',
            }}
          />
          <h1 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', fontWeight: '700', color: '#222' }}>
            Register
          </h1>
          <div style={{ marginTop: '1rem', textAlign: 'left' }}>
        <button
            type="button"
            onClick={() => setShowGuidelines(!showGuidelines)}
            style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: '#0077cc',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: '500',
            padding: '0',
            textDecoration: 'underline'
            }}
        >
            {showGuidelines ? 'Hide password guidelines ▲' : 'Show password guidelines ▼'}
        </button>

        {showGuidelines && (
            <div style={{
            backgroundColor: '#f5f5f5',
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '0.8rem',
            fontSize: '0.95rem',
            color: '#333',
            border: '1px solid #ddd',
            transition: 'all 0.3s ease'
            }}>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🔐 To ensure your account is safe (and not hacked by Mr. Phish):
            </h2>
            <ul style={{ paddingLeft: '1.2rem', marginBottom: '0.8rem' }}>
                <li>✅ At least 8 characters in length</li>
                <li>✅ Include lowercase & uppercase letters, numbers, and symbols</li>
                <li>❌ Avoid common passwords like <code>password</code> or <code>123456</code></li>
                <li>❌ Do not reuse or resemble your username or email</li>
            </ul>
            <h3 style={{ fontSize: '1rem', color: '#0077cc', marginTop: '0.8rem' }}>
                🔒 MFA (Multi-Factor Authentication) coming soon!
            </h3>
            </div>
        )}
        </div>
          <form onSubmit={handleRegister}>
            {/* Username */}
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Username</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
              }}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'transparent',
                    color: '#000',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Password</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
              }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordStrength(evaluatePasswordStrength(e.target.value));
                  }}
                  required
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'transparent',
                    color: '#000',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0077cc',
                    fontSize: '0.9rem',
                    paddingRight: '1rem'
                  }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordStrength && (
                <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: passwordStrength.color }}>
                  {passwordStrength.label}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
              <label style={{ display: 'inline-block', marginBottom: '0.5rem' }}>Confirm Password</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.05)',
                backgroundColor: '#fff'
              }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    border: 'none',
                    fontSize: '1rem',
                    backgroundColor: 'transparent',
                    color: '#000',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#0077cc',
                    fontSize: '0.9rem',
                    paddingRight: '1rem'
                  }}
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ color: 'red', marginBottom: '1rem', fontWeight: '500' }}>{error}</p>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#0077cc',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '1rem',
                transition: 'background-color 0.3s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#005fa3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#0077cc')}
            >
              Register
            </button>
          </form>

          <p style={{ marginTop: '1rem', fontSize: '0.95rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#0077cc', textDecoration: 'none', fontWeight: '500' }}>
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default RegisterPage;

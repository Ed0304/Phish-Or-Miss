import { useState, useEffect } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; 

function HomePage() {
  const [count, setCount] = useState(0);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('from') === 'login') {
      setShowSuccessMsg(true);
      setTimeout(() => setShowSuccessMsg(false), 3000); // auto-hide
    }
  }, [location.search]);

  return (
    <>
      <HeaderBar />

      <main style={{
        padding: '2rem',
        maxWidth: '900px',
        margin: 'auto',
        color: '#000',
        fontFamily: 'Arial, sans-serif'
      }}>

        {/* ✅ Success banner */}
        {showSuccessMsg && (
          <div style={{
            backgroundColor: '#d4edda',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            border: '1px solid #c3e6cb',
            marginBottom: '2rem',
            color: '#155724',
            fontWeight: 'bold'
          }}>
            ✅ Logged in successfully! Welcome to Phish or Miss.
          </div>
        )}

        {/* Welcome Section */}
        <section style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Welcome to <span style={{ color: '#0077cc' }}>Phish or Miss!</span>
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'normal' }}>
            How aware are you in detecting phishing attempts?
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>
            This game challenges you to identify phishing emails and links! Test your instincts and sharpen your awareness.
          </p>
        </section>

        {/* Lore Section */}
        <section style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>🕵️‍♂️ Who is Mr. Phish?</h2>
          <p style={{ maxWidth: '600px', margin: 'auto', fontSize: '1.1rem' }}>
            In a world obsessed with speed, someone lurks in the shadows of your inbox...
          </p>
          <Link
            to="/lore"
            style={{
              display: 'inline-block',
              marginTop: '1rem',
              padding: '10px 20px',
              background: '#d62828',
              color: '#fff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: 'bold'
            }}
          >
            Read the Lore
          </Link>
        </section>

        {/* CTA Section */}
        <section style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
            Are you ready to prove <span style={{ color: '#0077cc' }}>Mr. Phish</span> wrong?
          </h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#282c34',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#444')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#282c34')}
              onClick={() => navigate('/how-to-play')}
            >
              How to play?
            </button>

            <button
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                backgroundColor: '#0077cc',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#005fa3')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#0077cc')}
              onClick={() => navigate('/game-modes')}
            >
              Let's Go!
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HomePage;

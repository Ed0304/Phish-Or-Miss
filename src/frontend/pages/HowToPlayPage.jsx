import { useNavigate, Link } from 'react-router-dom';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import mrphish from '../../assets/images/Mr-Phish.png';

function HowToPlay() {
  const navigate = useNavigate();

  // 🛡️ Safe link component to prevent XSS and simulate redirection warning
  const SafeLink = ({ displayText, url, alertMessage }) => (
    <button
      onClick={() => alert(alertMessage || `⚠️ Warning: This link points to ${url}`)}
      title={url}
      style={{
        background: 'none',
        border: 'none',
        color: '#0077cc',
        textDecoration: 'underline',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit'
      }}
    >
      {displayText}
    </button>
  );

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
        <section style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>How to Play?</h1>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 'normal',
            color: '#ff4444',
            marginBottom: '2rem'
          }}>
            ⚠️ Disclaimer: This is a Hackathon demo version. Only one mode is available: <strong>Timed Mode (10 Emails)</strong>.
          </h2>

          <img src={mrphish} alt="Mr. Phish" style={{
            maxWidth: '250px',
            width: '100%',
            margin: '1rem auto',
            display: 'block'
          }} />

          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            In <strong>Phish or Miss</strong>, your job is to inspect a series of emails and decide whether each one is:
          </p>
          <ul style={{
            listStyle: 'none',
            paddingLeft: 0,
            fontSize: '1.1rem'
          }}>
            <li>✅ A legitimate email</li>
            <li>🚫 A phishing attempt</li>
          </ul>

          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            You’ll have limited time to make a decision for each email, so think fast and trust your instincts!
          </p>

          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => navigate('/game-modes')} style={{
              backgroundColor: '#0077cc',
              color: '#fff',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'background-color 0.3s ease'
            }}>
              Start the Game
            </button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <Link to="/" style={{
              color: '#0077cc',
              textDecoration: 'underline',
              fontSize: '0.95rem'
            }}>Back to Homepage</Link>
          </div>
        </section>

        {/* Example Emails Section */}
        <section style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center' }}>Examples</h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            maxWidth: '700px',
            margin: '0 auto',
            wordBreak: 'break-word',
          }}>
            {/* Legitimate Email Example */}
            <div style={{
              border: '2px solid #4caf50',
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: '#f0fff4',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Legitimate Email</h3>
              <p><strong>From:</strong> noreply@amazon.com</p>
              <p><strong>Subject:</strong> Your Order #123-4567890-1234567 Has Shipped</p>
              <p><strong>Message:</strong> Thank you for shopping with us. Your order has been shipped and is expected to arrive on August 20. Track your order <SafeLink displayText="here" url="https://www.amazon.com/trackorder" alertMessage="ℹ️ This is a safe link: https://www.amazon.com/trackorder" />.</p>
            </div>

            {/* Phishing Email Example */}
            <div style={{
              border: '2px solid #f44336',
              padding: '1.5rem',
              borderRadius: '10px',
              backgroundColor: '#fff0f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
            }}>
              <h3 style={{ color: '#c62828', marginTop: 0 }}>🚫 Phishing Email</h3>
              <p><strong>From:</strong> amazon-security@secure-verify.com</p>
              <p><strong>Subject:</strong> Urgent: Your Account Will Be Suspended!</p>
              <p><strong>Message:</strong> We noticed suspicious activity in your account. Please verify your login info immediately by clicking <SafeLink displayText="this link" url="http://amaz0n-security-checks.ru" alertMessage="🚨 This is a phishing domain: http://amaz0n-security-checks.ru" /> to avoid suspension.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default HowToPlay;

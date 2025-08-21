import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import defaultprofilepic from '../../assets/images/default-profile.jpg';
import { useNavigate, Link } from 'react-router-dom';

function TimedModeSelect() {
  const navigate = useNavigate();
  
  const handleStartNormal = () => {
    navigate('/timed-game'); // assumes you have a route for actual gameplay
  };

  return (
    <>
      <HeaderBar />
      <main className="timed-mode-select">
        <h1 className="mode-title">🕒 Select Timed Mode</h1>
        <p className="mode-subtitle">Choose the type of emails you want to face:</p>

        <div className="mode-grid">
          <div className="mode-card" onClick={handleStartNormal}>
            <h2>📥 Normal Mode</h2>
            <p>A mix of phishing and legitimate emails received by everyday users. <strong>(Including you, probably.)</strong></p>
            <button className="start-btn">Start</button>
          </div>

          <div className="mode-card disabled">
            <h2>🎯 Spear Phishing Mode</h2>
            <p>Simulates real-world, highly targeted phishing attacks.</p>
            <p className="coming-soon">Coming Soon</p>
          </div>

          <div className="mode-card disabled">
            <h2>👔 Whaling Mode</h2>
            <p>Designed for high-profile targets with advanced techniques.</p>
            <p className="coming-soon">Coming Soon</p>
          </div>
          <div>
            <Link to="/how-to-play" className="how-to-play-link">
              Return to How to Play Menu
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default TimedModeSelect;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const HeaderBar = ({ gameInProgress = false }) => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const handleLogout = () => {
    if (gameInProgress) return alert('⚠️ You must finish the game before logging out!');
    logout();
    navigate('/login');
  };

  const handleNavClick = (e) => {
    if (gameInProgress) {
      e.preventDefault();
      alert('🚫 Navigation is disabled while the game is in progress.');
    } else {
      setMenuOpen(false); // close mobile menu on nav
    }
  };

  // Detect screen width changes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header style={headerStyle}>
      <h1 style={{ margin: 0, fontSize: '1.2rem' }}>
        Phish or Miss – A Game of Detection
      </h1>

      {isMobile && (
        <button onClick={() => setMenuOpen(!menuOpen)} style={hamburgerStyle}>
          ☰
        </button>
      )}

      <nav
        style={{
          ...navStyle,
          ...(isMobile && (menuOpen ? navOpenStyle : { display: 'none' })),
        }}
      >
        {navLinks.map(({ label, path }, index) => {
          const shouldShow = !isLoggedIn || (label !== 'Login' && label !== 'Register');
          if (!shouldShow) return null;

          return (
            <Link
              key={index}
              to={path}
              style={{
                ...navLinkStyle,
                ...(gameInProgress ? disabledLinkStyle : {}),
              }}
              onClick={handleNavClick}
              title={gameInProgress ? 'Finish the game to unlock navigation' : ''}
            >
              {label}
            </Link>
          );
        })}

        {isLoggedIn && (
          <>
            <Link
              to="/dashboard"
              style={{
                ...navLinkStyle,
                ...(gameInProgress ? disabledLinkStyle : {}),
              }}
              onClick={handleNavClick}
              title={gameInProgress ? 'Finish the game to unlock navigation' : ''}
            >
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                ...logoutButtonStyle,
                ...(gameInProgress ? disabledButtonStyle : {}),
              }}
              title={gameInProgress ? 'Finish the game to logout' : ''}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

const navLinks = [
  { label: 'Homepage', path: '/' },
  { label: 'How to Play', path: '/how-to-play' },
  { label: 'Game Modes', path: '/game-modes' },
  { label: 'Lore', path: '/lore' },
  { label: 'Leaderboards', path: '/leaderboards' },
  { label: 'Login', path: '/login' },
  { label: 'Register', path: '/register' },
];

const headerStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  background: '#282c34',
  color: '#fff',
  padding: '6px 24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  boxSizing: 'border-box',
  zIndex: 1000,
};

const navStyle = {
  display: 'flex',
  gap: '16px',
  alignItems: 'center',
};

const navOpenStyle = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  marginTop: '12px',
  display: 'flex',
};

const navLinkStyle = {
  color: '#fff',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '1rem',
  transition: 'color 0.2s ease-in-out',
};

const disabledLinkStyle = {
  pointerEvents: 'none',
  opacity: 0.5,
  cursor: 'not-allowed',
};

const logoutButtonStyle = {
  background: 'transparent',
  border: '1px solid #fff',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '6px',
  fontSize: '0.95rem',
  fontWeight: '500',
  cursor: 'pointer',
};

const disabledButtonStyle = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

const hamburgerStyle = {
  display: 'block',
  background: 'transparent',
  fontSize: '1.5rem',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
};

export default HeaderBar;

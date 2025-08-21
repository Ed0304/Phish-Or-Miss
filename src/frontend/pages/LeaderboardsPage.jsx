import { useEffect, useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useAuth } from '../../contexts/AuthContext';
import ReactModal from 'react-modal';
import defaultBadge from '../../assets/images/default-medal.png';
ReactModal.setAppElement('#root');

function LeaderboardsPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [badgeList, setBadgeList] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user, isLoggedIn } = useAuth();

  const achievementDetails = {
    first_steps: {
      title: 'First Steps',
      desc: 'Successfully identified your first phishing email.',
    },
    first_mistake: {
      title: 'First Mistake',
      desc: 'Made your first wrong prediction in the game.',
    },
    perfect_combo: {
      title: 'Perfect Combo',
      desc: 'Got all emails correct in one round.',
    },
    what_are_you_doing: {
      title: 'What Are You Doing?',
      desc: 'Made 3 or more mistakes in a single session.',
    },
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/leaderboard`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error('No players found yet. Be the first to play!');
        }
        return res.json();
      })
      .then((data) => setLeaderboard(data))
      .catch((err) => setError(err.message));
  }, []);

  const handleViewBadges = (username) => {
    fetch(`${API_BASE_URL}/api/user/achievements?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        setBadgeList(data);
        setSelectedUser(username);
        setShowModal(true);
      });
  };

  return (
    <>
      <HeaderBar />
      <main style={{ padding: '2rem', maxWidth: '900px', margin: 'auto' }}>
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '12px 16px',
          borderRadius: '6px',
          border: '1px solid #ffeeba',
          marginBottom: '1.5rem',
          fontSize: '0.95rem'
        }}>
          ⚠️ <strong>Disclaimer:</strong> This is a Hackathon demo version. Rankings for <strong>Timed Mode (10 Emails)</strong> is only available for now.
        </div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏆 Leaderboards</h1>

        {isLoggedIn ? (
          <p>See your personalized leaderboard!</p>
        ) : (
          <p style={{ marginBottom: '1rem' }}>
            Please <a href="/login">log in</a> to save your score and get a badge!
          </p>
        )}

        {error ? (
          <p style={{ color: '#777', textAlign: 'center', marginTop: '2rem' }}>{error}</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            marginTop: '2rem',
            fontSize: '1rem',
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f3f5' }}>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Username</th>
                <th style={thStyle}>Highest Score</th>
                <th style={thStyle}>Game Mode</th>
                <th style={thStyle}>Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => {
                const isCurrentUser = user && entry.username === user.username;
                const rowColor = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
                const rankIcon =
                  index === 0 ? '🥇' :
                  index === 1 ? '🥈' :
                  index === 2 ? '🥉' : `${index + 1}`;

                return (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: rowColor,
                      fontWeight: isCurrentUser ? 'bold' : 'normal',
                      color: isCurrentUser ? '#0077cc' : 'inherit',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9f5ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowColor}
                  >
                    <td style={tdStyle}>{rankIcon}</td>
                    <td style={tdStyle}>{entry.username}</td>
                    <td style={tdStyle}>{entry.score}</td>
                    <td style={tdStyle}>{entry.gameMode}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => handleViewBadges(entry.username)}
                        style={{
                          background: '#007bff',
                          color: '#fff',
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        View Badges
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <ReactModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="User Badges"
          style={{
            content: {
              maxWidth: '600px',
              margin: 'auto',
              borderRadius: '10px',
              padding: '2rem',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)'
            }
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>{selectedUser}'s Achievements</h2>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {badgeList.length === 0 ? (
              <p>No achievements yet!</p>
            ) : (
              badgeList.map((badge, i) => {
                const imageSource = badge.imageUrl
                  ? `${API_BASE_URL}${badge.imageUrl}`
                  : defaultBadge;

                return (
                  <div key={i} style={{
                    width: '120px',
                    textAlign: 'center',
                    opacity: badge.earned ? 1 : 0.3,
                    transition: 'opacity 0.3s'
                  }}>
                    <img
                      src={imageSource}
                      alt={badge.id}
                      style={{ width: '100%', borderRadius: '8px' }}
                      onError={(e) => e.target.src = defaultBadge}
                    />
                    <p style={{ fontSize: '1rem', fontWeight: 'bold', margin: '0.3rem 0 0' }}>
                      {achievementDetails[badge.id]?.title || badge.id}
                    </p>
                    <p style={{ fontSize: '0.85rem', color: '#555' }}>
                      {achievementDetails[badge.id]?.desc || 'No description available.'}
                    </p>
                  </div>
                );
              })
            )}
          </div>
          <div style={{ textAlign: 'right', marginTop: '2rem' }}>
            <button onClick={() => setShowModal(false)} style={{
              padding: '0.5rem 1rem',
              background: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Close</button>
          </div>
        </ReactModal>

      </main>
      <Footer />
    </>
  );
}

const thStyle = {
  padding: '1rem',
  borderBottom: '1px solid #ccc',
  textAlign: 'left',
  backgroundColor: '#f1f3f5'
};

const tdStyle = {
  padding: '1rem',
  borderBottom: '1px solid #eee'
};

export default LeaderboardsPage;

import { useState, useEffect } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import defaultBadge from '../../assets/images/default-medal.png';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function MedalsPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const [achievementsMap, setAchievementsMap] = useState({});
  const navigate = useNavigate();

  const achievementDetails = {
    first_steps: {
      title: 'First Steps',
      desc: 'Successfully classify your first email in the game.',
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
    if (!user || (!user.username && !user.email)) return;

    const username = user.username || user.email;

    fetch(`${API_BASE_URL}/api/achievements?username=${username}`)
      .then((res) => res.json())
      .then((data) => {
        const map = {};
        data.achievements.forEach((ach) => {
          map[ach.id] = ach;
        });
        setAchievementsMap(map);
      })
      .catch((err) => {
        console.error('Failed to fetch achievements:', err);
      });
  }, [user]);

  const handleGenerate = (achievementId) => {
    navigate(`/generate-medal?achievementId=${achievementId}`);
  };

  return (
    <>
      <HeaderBar />
      <main className="medals-container">
        <h1 className="medals-title">🎖️ Achievement Library</h1>
        <h2 style={{
          fontSize: '1.2rem',
          fontWeight: 'normal',
          color: '#ff4444',
          marginBottom: '1.5rem'
        }}>
          ⚠️ Disclaimer: This is a Hackathon demo version. These achievements only apply for <strong>Timed Mode (10 Emails)</strong>.
        </h2>

        <div className="medals-grid">
          {Object.entries(achievementDetails).map(([id, detail], index) => {
            const userAch = achievementsMap[id] || { earned: false, imageUrl: '' };
            const { earned, imageUrl } = userAch;

            const hasMeme = earned && imageUrl;
            const canGenerate = earned && !imageUrl;

            return (
              <div className="medal-card" key={index}>
                <img
                  src={hasMeme ? `${API_BASE_URL}${imageUrl}` : defaultBadge}
                  alt={detail.title}
                  className="medal-image"
                  onError={(e) => e.target.src = defaultBadge}
                />

                <h3 className="medal-title">{detail.title}</h3>
                <p className="medal-desc">{detail.desc}</p>

                {hasMeme && (
                  <>
                    <p className="status-label" style={{ color: 'green' }}>✅ Meme Generated</p>
                    <button
                      className="generate-btn"
                      onClick={() => handleGenerate(id)}
                      style={{ marginTop: '0.5rem', backgroundColor: '#ffbb33' }}
                    >
                      🔄 Regenerate Meme
                    </button>
                  </>
                )}

                {canGenerate && (
                  <button
                    className="generate-btn"
                    onClick={() => handleGenerate(id)}
                  >
                    Generate with Sogni
                  </button>
                )}

                {earned && (
                  <form
                    encType="multipart/form-data"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const form = e.target;
                      const file = form.image.files[0];

                      if (!file) {
                        alert("Please select a file to upload.");
                        return;
                      }

                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("username", user.username || user.email);
                      formData.append("achievementId", id);

                      const res = await fetch(`${API_BASE_URL}/api/upload-medal-image`, {
                        method: "POST",
                        body: formData,
                      });

                      const result = await res.json();

                      if (res.ok) {
                        alert("✅ Meme uploaded successfully!");
                        window.location.reload();
                      } else {
                        alert("❌ Upload failed: " + (result.error || "Unknown error"));
                      }
                    }}
                  >
                    <input
                      type="file"
                      name="image"
                      accept="image/png, image/jpeg"
                      style={{ marginTop: "0.5rem" }}
                    />
                    <button type="submit" className="generate-btn" style={{ backgroundColor: "#33b5e5", marginTop: "0.5rem" }}>
                      📤 Upload Meme Manually
                    </button>
                  </form>
                )}

                {!earned && (
                  <p className="locked-msg">
                    🔒 Locked — Play to unlock this achievement.
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="medals-footer">
          <p>
            Want to earn more achievements? Play the game and improve your skills!
          </p>
          <button className="play-btn" onClick={() => navigate('/play-timed')}>
            ▶️ Play Timed Mode
          </button>
          <br />
          <Link to="/dashboard">🏠 Go to Dashboard</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default MedalsPage;

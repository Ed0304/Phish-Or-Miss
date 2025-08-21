import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth,} from '../../contexts/AuthContext';

function GenerateMedalPage() {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState('Anime Style');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [previewPrompt, setPreviewPrompt] = useState('');
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const achievementId = new URLSearchParams(window.location.search).get('achievementId');

  const achievementMapping = {
    first_steps: {
      title: 'First Steps',
      desc: 'Successfully identified which email was legit or not – you can be proud of yourself!',
      color: 'bronze'
    },
    first_mistake: {
      title: 'First Mistake',
      desc: 'Misidentified your first email as phishing or not phishing.',
      color: 'bronze'
    },
    perfect_combo: {
      title: 'Perfect Combo',
      desc: 'Got all emails correct in one round.',
      color: 'gold'
    },
    what_are_you_doing: {
      title: 'What Are You Doing?',
      desc: 'Made 3 or more mistakes in a single session.',
      color: 'silver'
    },
  };

  const symbolPrompt = {
    first_steps: 'small footprint or checkmark symbol',
    first_mistake: 'confused emoji or warning icon',
    perfect_combo: 'trophy or lightning bolt',
    what_are_you_doing: 'question mark or surprised emoji'
  };

  const stylePrompt = {
    'Anime Style': 'anime style, soft shading',
    'Cartoon Style': 'cartoon, bold lines',
    'Realistic Style': 'realistic, high detail',
    'Abstract Style': 'abstract, geometric'
  };

  const getMemeText = (achievement) => {
    const desc = achievement.desc.toLowerCase();

    if (desc.includes("mistake") || desc.includes("wrong")) {
      return {
        top: "THOUGHT I ATE 💀",
        bottom: "BUT I GOT COOKED 🍳"
      };
    } else if (desc.includes("first") || desc.includes("beginner") || desc.includes("started")) {
      return {
        top: "DAY 1, ALREADY CRACKED",
        bottom: "EZ CLAP"
      };
    } else if (desc.includes("identified") || desc.includes("spotted")) {
      return {
        top: "NO CLUE WHAT I WAS DOING",
        bottom: "BUT IT WORKED 😎"
      };
    } else if (desc.includes("perfect") || desc.includes("combo")) {
      return {
        top: "I UNDERSTOOD THE ASSIGNMENT",
        bottom: "FLAWLESS VICTORY 🏆"
      };
    } else {
      return {
        top: `ACHIEVEMENT UNLOCKED`,
        bottom: achievement.title.toUpperCase()
      };
    }
  };

  const handleGenerate = async () => {
  setLoading(true);
  setError('');
  setSuccess('');
  setImage(null);

  const achievement = achievementMapping[achievementId];
  if (!achievement) {
    setError("❌ Invalid achievement ID.");
    setLoading(false);
    return;
  }

  function emotionForAchievement(id) {
  switch (id) {
    case "first_mistake": return "confused and nervous";
    case "perfect_combo": return "smug and victorious";
    case "what_are_you_doing": return "facepalming in disbelief";
    case "first_steps": return "pleasantly surprised";
    default: return "shocked or amazed";
  }
}

function backgroundForAchievement(id) {
  switch (id) {
    case "first_mistake": return "floating red question marks";
    case "perfect_combo": return "explosive sparkles and fireworks";
    case "what_are_you_doing": return "chaotic glitch noise";
    case "first_steps": return "green checkmarks and stars";
    default: return "distorted vaporwave noise";
  }
}


  const meme = getMemeText(achievement);
  const prompt = `
    close-up of a character in ${stylePrompt[style]},
    ${symbolPrompt[achievementId]} in the background,
    expression: ${emotionForAchievement(achievementId)},
    background: ${backgroundForAchievement(achievementId)},
    top text: "${meme.top}", bottom text: "${meme.bottom}",
    text style: bold white Impact font with black outline,
    film grain, harsh flash, dramatic lighting, messy, meme aesthetic
    ${customPrompt || ''}
    `.trim();


  // Show alert before continuing
  const confirm = window.confirm(`🎯 Prompt Preview:\n\n${prompt}\n\nProceed to generate this meme?`);

  if (!confirm) {
    setLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (data?.images?.[0]) {
      setImage(data.images[0]);
      setSuccess("✅ Meme generated successfully!");
    } else {
      setError("⚠️ Generation failed. Try again.");
    }
  } catch (err) {
    setError("❌ Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  const handleSetMedal = async () => {
    if (!user || !image || !achievementId) {
      setSaveMessage("⚠️ Missing data or user not logged in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/set-medal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          achievementId,
          imageUrl: image
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSaveMessage("✅ Meme set successfully!");
      } else {
        setSaveMessage(`⚠️ Failed to set meme: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      setSaveMessage("❌ Error setting meme.");
    }
  };

  const achievement = achievementMapping[achievementId];

  return (
    <div className="generate-medal-page">
      <HeaderBar />
      <div className="container">
        <h1>Generate Meme</h1>
        <h4>Warning! Images generated will be deleted after 24 hours. Downloading them is recommended if you store them long term.</h4>
        <h2>{achievement ? `Achievement: ${achievement.title}` : 'Unknown Achievement'}</h2>
        <h4>Rarity: {achievement ? achievement.color : 'Unknown'}</h4>

        

        <div style={{ marginBottom: '1rem' }}>
          <label>Choose a style:</label>
          <select value={style} onChange={e => setStyle(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
            {Object.keys(stylePrompt).map(option => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Custom Prompt:</label>
          <textarea
            value={customPrompt}
            onChange={e => setCustomPrompt(e.target.value)}
            placeholder="e.g. glowing border, stars around the meme, ribbon attached"
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          {loading ? 'Generating...' : 'Generate Meme'}
        </button>

        

        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        {image && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <img
              src={image}
              alt="Generated Meme"
              style={{
                width: '256px',
                height: '256px',
                objectFit: 'contain',
                border: '4px solid #ccc',
                borderRadius: '10px',
                boxShadow: '0 0 8px rgba(0,0,0,0.2)'
              }}
            />
            <div style={{ marginTop: '1rem' }}>
              <a href={image} download="generated_meme.png">
                <button style={{ padding: '0.5rem 1.2rem' }}>📥 Download Meme</button>
              </a>
              <button
                onClick={handleSetMedal}
                style={{ padding: '0.5rem 1.2rem', marginLeft: '1rem' }}
              >
                🏅 Use This Meme
              </button>
              {saveMessage && <p style={{ marginTop: '0.5rem' }}>{saveMessage}</p>}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default GenerateMedalPage;

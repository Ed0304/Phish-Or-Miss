import { useState } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultprofilepic from '../../assets/images/default-profile.jpg';

function GenerateProfilePicturePage() {
  const [image, setImage] = useState(defaultprofilepic);
  const [customPrompt, setCustomPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const basePrompt = customPrompt?.trim() || `${currentUser?.displayName || 'A friendly hacker'} profile photo`;
    const finalPrompt = `${basePrompt}, cartoon style, clean background, close-up face, soft lighting, portrait orientation`;

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        console.error("❌ Invalid JSON from server:", err);
        setError("⚠️ Server returned an invalid response.");
        setLoading(false);
        return;
      }

      console.log("🔥 Full server response:", data);

      if (data?.images?.[0]) {
        setImage(data.images[0]);
        setSuccess("✅ Image generated successfully!");
      } else if (data?.error) {
        setError(`⚠️ Server error: ${data.error}`);
      } else {
        setError("⚠️ Image generation failed. Try again.");
      }

    } catch (err) {
      console.error("❌ Image generation failed:", err);
      setError("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-profile-picture-page">
      <HeaderBar />

      <div className="container">
        <h1>Generate Profile Picture</h1>
        <h4>Warning! Images generated will be deleted after 24 hours. Downloading them is recommended if you store them long term.</h4>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="prompt">Describe your ideal profile picture:</label>
          <input
            id="prompt"
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="e.g. A cyberpunk-themed hacker girl with headphones"
            style={{ width: '100%', padding: '0.5rem', fontSize: '1rem' }}
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}
        >
          {loading ? 'Generating...' : 'Generate New Picture'}
        </button>

        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <img
            src={image}
            alt="Generated profile"
            style={{
              width: '256px',
              height: '256px',
              objectFit: 'cover',
              borderRadius: '50%',
              border: '4px solid #ccc',
              boxShadow: '0 0 8px rgba(0,0,0,0.2)',
            }}
          />
          {
            image !== defaultprofilepic && (
              <div style={{ marginTop: '1rem' }}>
                <a href={image} download="generated_profile.png">
                  <button style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                    📥 Download Image
                  </button>
                </a>
              </div>
            )
          }
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default GenerateProfilePicturePage;

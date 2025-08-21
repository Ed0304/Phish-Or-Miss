import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import '../../App.css'; // Make sure you have styles for table/report-box
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ReportPage() {
  const location = useLocation();
  const { username } = location.state || {};
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const achievementLabels = {
    first_steps: '🟢 First Legit Detection',
    first_mistake: '🔴 First Phishing Detection',
    perfect_combo: '🌟 Perfect Combo (10/10)',
    what_are_you_doing: '🤔 At Least 3 Mistakes'
    };
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/report/latest?username=${username}`);
        const data = await res.json();
        setReport(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch report:', err);
        setLoading(false);
      }
    };

    if (username) fetchReport();
  }, [username]);

  if (loading) return <div>Loading report...</div>;
  if (!report) return <div>No report available.</div>;

  return (
    <>
      <HeaderBar />
      <main className="report-container">
        <h1>📊 Report for <span style={{ color: '#007acc' }}>{username}</span></h1>

        <section className="report-box">
          <h2>Summary</h2>
          <p>✅ <strong>Correct:</strong> {report.correct}</p>
          <p>❌ <strong>Incorrect:</strong> {report.incorrect}</p>
          <p>⏳ <strong>Missed:</strong> {report.missed}</p>
          <p>🏆 <strong>Achievements Earned:</strong>{' '}
            {report.achievements?.length > 0 
                ? report.achievements.map((a, i) => (
                    <span key={i} style={{ marginRight: '8px' }}>
                    {achievementLabels[a] || a}{report.firstTime?.includes(a) ? ' ✨' : ''}
                    </span>
                )) 
                : 'None this time.'
            }
            </p>

        </section>

        <section className="email-results">
          <h2>📬 Emails You Faced</h2>
          <div className="table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Sender</th>
                  <th>Correct Type</th>
                  <th>Your Answer</th>
                  <th>Result</th>
                  <th>Time Taken (s)</th>
                </tr>
              </thead>
              <tbody>
                {report.answers?.map((email, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{email.subject}</td>
                    <td>{email.sender}</td>
                    <td>{email.correctType}</td>
                    <td>{email.userAnswer}</td>
                    <td style={{ color: email.isCorrect ? 'green' : (email.userAnswer === 'miss' ? '#999' : 'red') }}>
                      {email.isCorrect ? '✅ Correct' : (email.userAnswer === 'miss' ? '⏳ Missed' : '❌ Wrong')}
                    </td>
                    <td>{email.timeTaken}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 24px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.8',
      color: '#222'
    }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>
        How to Spot a Phishing Email
      </h1>

      <h2 style={{ fontSize: '1.25rem', textAlign: 'center', fontWeight: '500', color: '#444', marginBottom: '2rem' }}>
        Phishing emails often pretend to be from trusted sources, making them tricky to detect.
      </h2>

      <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⚠️ Watch out for these red flags:</h3>

      <ul style={{ paddingLeft: '1.2rem' }}>
        <li><strong>Generic greetings:</strong> Phrases like <em>"Dear Customer"</em> instead of your name can be a warning sign.</li>
        <li><strong>Suspicious sender addresses:</strong> Look closely—typos or strange domains (like <code>micros0ft-support.com</code>) are red flags. Trust your instincts!</li>
        <li><strong>Urgency and threats:</strong> "Act now!" or "Your account will be locked" messages are designed to pressure you. Take a breath and verify before reacting.</li>
        <li><strong>Check links before clicking:</strong> Hover over them to preview the real URL. Watch for sneaky misspellings or strange endings like <code>.xyz</code> or <code>.info</code>.</li>
        <li><strong>Grammar and spelling mistakes:</strong> Sloppy writing is a common trait of phishing emails sent in bulk.</li>
      </ul>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link to="/dashboard" style={{
          textDecoration: 'none',
          color: '#4CAF50',
          fontWeight: '600'
        }}>
          ← Back to Dashboard
        </Link>
      </div>
    </section>

      </main>
      <Footer />
    </>
  );
}

export default ReportPage;

// ViewGameReports.jsx
import { useState, useEffect } from 'react';
import '../../App.css';
import HeaderBar from '../components/HeaderBar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

function ViewGameReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate()
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!user || (!user.username && !user.email)) return;
    const username = user.username || user.email;

    fetch(`${API_BASE_URL}/api/reports?username=${username}`)
      .then(res => res.json())
      .then(data => {
        setReports(data.reports || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching reports:', err);
        setError('Failed to load game reports.');
        setLoading(false);
      });
  }, [user]);

  const openModal = (report) => setSelectedReport(report);
  const closeModal = () => setSelectedReport(null);

  return (
    <>
      <HeaderBar />
      <div className="container">
        <h1>📊 Your Game Reports</h1>

        {loading && <p>Loading reports...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && reports.length === 0 && (
          <p>You haven't played any games yet. Try Timed Mode to generate reports!</p>
        )}

        {!loading && reports.length > 0 && (
          <table className="reports-table">
            <thead>
              <tr>
                <th>📅 Date</th>
                <th>✅ Correct</th>
                <th>❌ Mistakes</th>
                <th>🎯 Accuracy</th>
                <th>🏆 Score</th>
                <th>🔍 Details</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report, index) => {
                const date = new Date(report.timestamp || Date.now());
                const correct = report.correct || 0;
                const incorrect = report.incorrect || 0;
                const total = correct + incorrect + (report.missed || 0);
                const accuracy = total ? Math.round((correct / total) * 100) : 0;
                return (
                  <tr key={index}>
                    <td>{date.toLocaleString()}</td>
                    <td>{correct}</td>
                    <td>{incorrect}</td>
                    <td>{accuracy}%</td>
                    <td>{report.score || report.highScore || 0}</td>
                    <td>
                      <button className="generate-btn" onClick={() => openModal(report)}>
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button className="play-btn" onClick={() => navigate('/play-timed')}>
            ▶️ Play Again
          </button>
        </div>
      </div>

      <ReactModal
        isOpen={!!selectedReport}
        onRequestClose={closeModal}
        contentLabel="Game Report Details"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>📋 Game Details</h2>
        {selectedReport?.answers?.map((a, i) => (
          <div key={i} className="email-answer">
            <h4>{a.subject} </h4>
            <p><strong>Sender:</strong> {a.sender}</p>
            <p>📩 Type: <strong>{a.correctType}</strong> | Your Answer: <strong>{a.userAnswer || 'none'}</strong></p>
            <p>Body: <strong>{a.body}</strong></p>
            <p>✅ Correct? {a.isCorrect ? 'Yes' : 'No'}</p>
            <p>📝 Explanation: {a.explanation || 'No explanation provided.'}</p>
            <hr />
          </div>
        ))}
        <button onClick={closeModal} className="play-btn" style={{ marginTop: '1rem' }}>Close</button>
      </ReactModal>
      <Footer />
    </>
  );
}

export default ViewGameReports;

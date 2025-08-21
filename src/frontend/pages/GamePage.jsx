import { useState } from 'react'
import '../../App.css'
import HeaderBar from '../components/HeaderBar'
import Footer from '../components/Footer'
import mrphish from '../../assets/images/Mr-Phish.png'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'; 
//This is a menu that displays available game mode to users, not the main game logic itself.
function GamePage() {
    const { isLoggedIn } = useAuth();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Game Modes</h1>

                <h2 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'normal',
                    color: '#ff4444',
                    marginBottom: '1.5rem'
                }}>
                    ⚠️ Disclaimer: This is a Hackathon demo version. Only one mode is available: <strong>Timed Mode (10 Emails)</strong>.
                </h2>

                <div style={{
                    backgroundColor: '#f9f9f9',
                    padding: '1rem 1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #ddd',
                    marginBottom: '2rem'
                }}>
                    <h3 style={{ marginTop: 0 }}>🎯 Timed Mode</h3>
                    <p>You’ll face 10 emails, each with a countdown timer. Identify whether each email is real or a phishing attempt before time runs out. Speed and accuracy matter!</p>
                </div>

                {isLoggedIn ? (
                    <div style={{
                        backgroundColor: '#d4edda',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #c3e6cb',
                        marginBottom: '2rem',
                        color: '#155724'
                    }}>
                        ✅ You're logged in! Stay sharp — phishing attempts can come anytime. Good luck, agent!
                    </div>
                    ) : (
                    <div style={{
                        backgroundColor: '#fff3cd',
                        padding: '1rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #ffeeba',
                        marginBottom: '2rem',
                        color: '#856404'
                    }}>
                        <strong>🧠 For the best experience:</strong> Please <Link to="/register" style={{ color: '#0077cc', textDecoration: 'underline' }}>create an account</Link> or <Link to="/login" style={{ color: '#0077cc', textDecoration: 'underline' }}>login</Link>.
                        <br />
                        <em>But whatever you do... <strong>never share your password</strong>, or you might become Mr. Phish’s next victim! 🐟💀</em>
                    </div>
                    )}
                    

                <h3>Choose a game mode:</h3>
                <h4>Don't worry, Mr. Phish is very patient! Take your time to decide.</h4>

                <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <Link to="/play-timed" style={{
                        display: 'inline-block',
                        padding: '14px 28px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        transition: 'background-color 0.3s ease'
                    }}>
                        ▶️ Start Timed Mode
                    </Link>

                    <Link to="/how-to-play" style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#0077cc',
                        color: '#fff',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        📘 How to Play
                    </Link>
                    </div>
                    <div style={{
                        marginTop: '3rem',
                        padding: '1.5rem',
                        backgroundColor: '#f0f8ff',
                        border: '1px dashed #0077cc',
                        borderRadius: '10px',
                        textAlign: 'center'
                        }}>
                        <h3 style={{ marginBottom: '1rem', color: '#0077cc' }}>🚧 Coming Soon</h3>
                        <p style={{ margin: '0.5rem 0' }}>
                            🧘‍♂️ <strong>Relaxed Mode</strong> – Take your time without a countdown. Perfect for learning at your own pace.
                        </p>
                        <p style={{ margin: '0.5rem 0' }}>
                            ♾️ <strong>Endless Mode</strong> – Keep playing until you miss. How long can you survive the phishing waves?
                        </p>
                        <p style={{ marginTop: '1rem', fontStyle: 'italic', color: '#666' }}>
                            Stay tuned… Mr. Phish is cooking something devious.
                        </p>
                        </div>


            </main>
            <Footer />
        </>
    )
}

export default GamePage;

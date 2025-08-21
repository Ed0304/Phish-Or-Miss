import React from 'react';

const Footer = () => (
    <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#282c34',
        color: '#fff',
        padding: '12px 32px',
        textAlign: 'center',
        zIndex: 9999
    }}>
        © 2025 <strong>Phish or Miss</strong>. This game was created for the <strong>NTUxBase3 Hackathon – Sogni Track</strong>.<br />
  Some images were AI-generated using <strong>Sogni</strong>.
    </footer>
);

export default Footer;

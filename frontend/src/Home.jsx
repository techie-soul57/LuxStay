import React from 'react';
import './App.css';

function Home() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Welcome to Hotel Modern</h1>
        <p className="subtitle">A seamless solution for managing your hotel's rooms, reservations, and more.</p>
        <a href="#features" className="cta-btn">Get Started</a>
      </div>
      <div className="features" id="features">
        <h2>What You Can Do</h2>
        <div className="features-list">
          <div className="feature-card">
            <span className="feature-icon">🛏️</span>
            <h3>Room Management</h3>
            <p>Add, edit, and view all your hotel rooms in one place.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📅</span>
            <h3>Reservations</h3>
            <p>Book, view, and manage guest reservations easily.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">📊</span>
            <h3>Dashboard</h3>
            <p>See analytics and quick stats for your hotel's performance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 
import React, { useState } from 'react';
import InteractiveMap from './InteractiveMap';
import './Homepage.css';

const Homepage = () => {
  const [showMap, setShowMap] = useState(false);

  if (showMap) {
    return (
      <div className="map-fullpage">
        <InteractiveMap onClose={() => setShowMap(false)} />
      </div>
    );
  }

  return (
    <div className="homepage">
      <header className="site-header">
        <div className="brand">MITS Way-Finder</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero" id="home">
        <h1 className="hero-title">Real-Time Campus Way-Finder</h1>
        <p className="hero-subtitle">
          Navigate the MITS campus with a live, interactive map and
          easy directions to buildings, facilities, and services.
        </p>
        <div className="hero-actions">
          <button className="map-button" onClick={() => setShowMap(true)}>Open Map</button>
        </div>
      </section>

      <section className="about" id="about">
        <h2>About MITS Way-Finder</h2>
        <p>
          A simple tool for students and staff to view campus locations,
          find points of interest, and get turn-by-turn directions in real time.
        </p>
      </section>

      <footer className="site-footer" id="contact">
        <p>Contact us: support@mitsride.com</p>
        <p>© 2026 MITS Way-Finder</p>
      </footer>
    </div>
  );
};

export default Homepage;
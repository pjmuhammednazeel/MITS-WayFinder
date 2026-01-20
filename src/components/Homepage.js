import React from 'react';
import './Homepage.css';

const Homepage = () => {
  const openMapPage = () => {
    window.location.href = '/map';
  };

  const openLoginPage = () => {
    window.location.href = '/login';
  };

  return (
    <div className="homepage">
      <header className="site-header">
        <div className="brand">MITS Way-Finder</div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="ghost-button" onClick={openLoginPage}>Admin Login</button>
      </header>

      <section className="hero" id="home">
        <div className="background-orbs" aria-hidden="true">
          <span className="orb orb-one"></span>
          <span className="orb orb-two"></span>
          <span className="orb orb-three"></span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="pill">Live beta - Updated routes</div>
            <h1 className="hero-title">Navigate campus in real time</h1>
            <p className="hero-subtitle">
              Track shuttles, locate buildings, and find the fastest route with a single, responsive map experience made for MITS students and staff.
            </p>
            <div className="hero-actions">
              <button className="primary-button" onClick={openMapPage}>Open interactive map</button>
              <a className="text-link" href="#about">How it works</a>
            </div>
            <div className="hero-stats">
              <div className="stat-card">
                <span className="stat-value">45+</span>
                <span className="stat-label">Buildings indexed</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">Live</span>
                <span className="stat-label">Shuttle positions</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">Smart</span>
                <span className="stat-label">Indoor + outdoor paths</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="glow-card">
              <div className="card-header">
                <span className="pill soft">Suggested routes</span>
                <span className="dot-pulse"></span>
              </div>
              <ul className="route-list">
                <li>
                  <div>
                    <div className="route-name">Library to Lab Block</div>
                    <div className="route-meta">7 min - shaded walkway</div>
                  </div>
                  <span className="badge">On time</span>
                </li>
                <li>
                  <div>
                    <div className="route-name">Hostel to Cafeteria</div>
                    <div className="route-meta">5 min - least crowded</div>
                  </div>
                  <span className="badge badge-warm">Fast</span>
                </li>
                <li>
                  <div>
                    <div className="route-name">Main Gate to Admin</div>
                    <div className="route-meta">4 min - shuttle pickup</div>
                  </div>
                  <span className="badge badge-cool">Live</span>
                </li>
              </ul>
              <div className="mini-legend">
                <span className="legend-dot live"></span> Live vehicles
                <span className="legend-dot quiet"></span> Low traffic
                <span className="legend-dot alert"></span> Detours
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="about">
        <div className="section-heading">
          <h2>Built for quick decisions</h2>
          <p>Everything you need to move confidently across campus—without digging through menus.</p>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="icon-pill">//</div>
            <h3>Live layers</h3>
            <p>Toggle shuttles, parking, and accessibility paths in one tap.</p>
          </div>
          <div className="feature-card">
            <div className="icon-pill">[]</div>
            <h3>Precision search</h3>
            <p>Find buildings, rooms, or services instantly with smart suggestions.</p>
          </div>
          <div className="feature-card">
            <div className="icon-pill">-></div>
            <h3>Reliable reroutes</h3>
            <p>Automatic detour alerts keep you on the fastest track when conditions change.</p>
          </div>
        </div>
      </section>

      <section className="cta-strip" id="contact">
        <div className="cta-content">
          <div>
            <h2>Ready to move smarter?</h2>
            <p>Open the live map to view routes, see shuttle ETAs, and stay ahead of campus rush.</p>
          </div>
          <button className="primary-button" onClick={openMapPage}>Open map</button>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <div className="brand">MITS Way-Finder</div>
            <p className="footer-note">Designed for fast, clear navigation across MITS.</p>
          </div>
          <div className="footer-links">
            <a href="mailto:support@mitsride.com">support@mitsride.com</a>
            <span>© 2026 MITS Way-Finder</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
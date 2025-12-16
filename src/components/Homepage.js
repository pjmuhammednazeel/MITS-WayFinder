import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Users, 
  Clock, 
  Book, 
  Coffee, 
  Car, 
  Wifi,
  Star,
  ArrowRight
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';
import './Homepage.css';

const Homepage = () => {
  const features = [
    {
      icon: <MapPin className="feature-icon" />,
      title: "Interactive Campus Map",
      description: "Navigate through MITS campus with our detailed interactive map showing all buildings, facilities, and points of interest."
    },
    {
      icon: <Navigation className="feature-icon" />,
      title: "Turn-by-Turn Directions",
      description: "Get precise directions from your current location to any destination on campus with step-by-step guidance."
    },
    {
      icon: <Clock className="feature-icon" />,
      title: "Real-time Updates",
      description: "Stay informed with live updates on building hours, event schedules, and facility availability."
    },
    {
      icon: <Users className="feature-icon" />,
      title: "Student Services",
      description: "Quickly locate student services, administrative offices, and academic support centers."
    }
  ];

  const quickAccess = [
    { icon: <Book />, label: "Library", color: "#4CAF50" },
    { icon: <Coffee />, label: "Cafeteria", color: "#FF9800" },
    { icon: <Car />, label: "Parking", color: "#2196F3" },
    { icon: <Wifi />, label: "WiFi Zones", color: "#9C27B0" }
  ];

  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <MapPin className="nav-logo" />
            <span className="nav-title">Muthoot Way-Finder</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#map">Campus Map</a>
            <a href="#contact">Contact</a>
            <a href="#map" className="nav-cta">Explore Map</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Navigate Muthoot Campus
              <span className="hero-highlight"> Effortlessly</span>
            </h1>
            <p className="hero-description">
              Your smart campus companion for finding buildings, facilities, and services 
              at Muthoot Institute of Technology & Science. Never get lost on campus again!
            </p>
            <div className="hero-actions">
              <a href="#map" className="btn btn-primary">
                Start Navigation <ArrowRight className="btn-icon" />
              </a>
              <a href="#map" className="btn btn-secondary">
                Explore Campus Map
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-map-preview">
              <a href="#map" className="map-placeholder">
                <MapPin className="map-icon" />
                <p>Interactive Campus Map</p>
                <span className="map-overlay">Click to Explore</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="quick-access">
        <h2>Quick Access</h2>
        <div className="quick-grid">
          {quickAccess.map((item, index) => (
            <div key={index} className="quick-card" style={{ borderTopColor: item.color }}>
              <div className="quick-icon" style={{ color: item.color }}>
                {item.icon}
              </div>
              <span className="quick-label">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2 className="section-title">Why Choose Muthoot Way-Finder?</h2>
          <p className="section-subtitle">
            Designed specifically for the Muthoot Institute community with features that matter most to students and faculty.
          </p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Buildings Mapped</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100+</div>
            <div className="stat-label">Points of Interest</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Available Service</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5000+</div>
            <div className="stat-label">Happy Users</div>
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section id="map" className="map-section">
        <div className="section-header">
          <h2 className="section-title">Explore Campus Live</h2>
          <p className="section-subtitle">
            Use our interactive map to find your way around campus and see your current location in real-time.
          </p>
        </div>
        <div className="map-container">
          <InteractiveMap />
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2 className="section-title">What Students Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="star filled" />
              ))}
            </div>
            <p className="testimonial-text">
              "MITS Way-Finder saved me so much time during my first semester. 
              I could easily find all my classrooms and never missed a lecture!"
            </p>
            <div className="testimonial-author">
              <strong>Sarah M.</strong>
              <span>Computer Science Student</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="star filled" />
              ))}
            </div>
            <p className="testimonial-text">
              "The real-time updates feature is amazing! I always know when 
              facilities are open and can plan my day accordingly."
            </p>
            <div className="testimonial-author">
              <strong>Raj P.</strong>
              <span>Electronics Engineering Student</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Explore Muthoot Institute?</h2>
          <p className="cta-description">
            Join thousands of students who navigate campus smartly with Muthoot Way-Finder
          </p>
          <a href="#map" className="btn btn-primary btn-large">
            Start Your Journey <ArrowRight className="btn-icon" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <MapPin className="footer-logo" />
              <span className="footer-title">Muthoot Way-Finder</span>
            </div>
            <p className="footer-description">
              Your trusted campus navigation companion for Muthoot Institute of Technology & Science.
            </p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#map">Campus Map</a></li>
              <li><a href="#buildings">Buildings</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#events">Events</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#feedback">Feedback</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <ul className="footer-links">
              <li><a href="#facebook">Facebook</a></li>
              <li><a href="#twitter">Twitter</a></li>
              <li><a href="#instagram">Instagram</a></li>
              <li><a href="#linkedin">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 MITS Way-Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
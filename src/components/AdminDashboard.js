import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (only once on mount)
    const storedAdmin = localStorage.getItem('adminSession');
    if (!storedAdmin) {
      window.location.href = '/login';
      return;
    }
    setAdminUser(JSON.parse(storedAdmin));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    window.location.href = '/';
  };

  const openManageBuildings = () => {
    window.location.href = '/admin-dashboard/manage-buildings';
  };

  if (!adminUser) return null;

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">MITS Way-Finder Admin</div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </header>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {adminUser.username}</h1>
          <p className="muted">Manage campus navigation, locations, and system settings.</p>
        </div>

        <div className="dashboard-grid">
          <div className="feature-card">
            <div className="icon-pill">//</div>
            <h3>Manage Buildings</h3>
            <p>Add, edit, or remove campus buildings and points of interest.</p>
            <button className="secondary-button" onClick={openManageBuildings}>View Buildings</button>
          </div>

          <div className="feature-card">
            <div className="icon-pill">[]</div>
            <h3>Routes & Paths</h3>
            <p>Configure walking paths, shuttle routes, and navigation preferences.</p>
            <button className="secondary-button">Manage Routes</button>
          </div>

          <div className="feature-card">
            <div className="icon-pill">-></div>
            <h3>System Settings</h3>
            <p>Update map settings, notifications, and system configurations.</p>
            <button className="secondary-button">Open Settings</button>
          </div>

          <div className="feature-card">
            <div className="icon-pill">##</div>
            <h3>Analytics</h3>
            <p>View usage statistics, popular routes, and user engagement data.</p>
            <button className="secondary-button">View Analytics</button>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => window.location.href = '/map'}>View Live Map</button>
            <button className="action-btn">Export Data</button>
            <button className="action-btn">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

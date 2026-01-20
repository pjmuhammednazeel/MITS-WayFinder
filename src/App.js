import React from 'react';
import Homepage from './components/Homepage';
import InteractiveMap from './components/InteractiveMap';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ManageBuildings from './components/ManageBuildings';
import './App.css';

function App() {
  const path = window.location.pathname;

  return (
    <div className="App">
      {path === '/map' ? (
        <InteractiveMap onClose={() => (window.location.href = '/')} />
      ) : path === '/login' ? (
        <AdminLogin />
      ) : path === '/admin-dashboard/manage-buildings' ? (
        <ManageBuildings />
      ) : path === '/admin-dashboard' ? (
        <AdminDashboard />
      ) : (
        <Homepage />
      )}
    </div>
  );
}

export default App;
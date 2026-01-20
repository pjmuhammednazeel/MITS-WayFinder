import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './ManageFloors.css';

const ManageFloors = () => {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [floorName, setFloorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('adminSession');
    if (!storedAdmin) {
      window.location.href = '/login';
      return;
    }
    fetchBuildings();
    fetchFloors();
  }, []);

  const fetchBuildings = async () => {
    try {
      const { data, error } = await supabase
        .from('building')
        .select('building_id, building_name')
        .order('building_name', { ascending: true });

      if (error) throw error;
      setBuildings(data || []);
    } catch (err) {
      console.error('Error fetching buildings:', err);
      setError('Failed to load buildings');
    }
  };

  const fetchFloors = async () => {
    try {
      const { data, error } = await supabase
        .from('floors')
        .select(`
          floor_id,
          floor_name,
          building_id,
          building:building_id (building_name)
        `)
        .order('building_id', { ascending: true })
        .order('floor_name', { ascending: true });

      if (error) throw error;
      setFloors(data || []);
    } catch (err) {
      console.error('Error fetching floors:', err);
      setError('Failed to load floors');
    }
  };

  const handleAddFloor = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedBuildingId || !floorName.trim()) {
      setError('Please select a building and enter floor name');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('floors')
        .insert([
          {
            building_id: parseInt(selectedBuildingId),
            floor_name: floorName.trim()
          }
        ])
        .select();

      if (error) throw error;

      setSuccess('Floor added successfully!');
      setFloorName('');
      setSelectedBuildingId('');
      fetchFloors();
    } catch (err) {
      console.error('Error adding floor:', err);
      setError('Failed to add floor: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFloor = async (floorId) => {
    if (!window.confirm('Are you sure you want to delete this floor?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('floors')
        .delete()
        .eq('floor_id', floorId);

      if (error) throw error;

      setSuccess('Floor deleted successfully!');
      fetchFloors();
    } catch (err) {
      console.error('Error deleting floor:', err);
      setError('Failed to delete floor: ' + err.message);
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="brand">MITS Way-Finder Admin</div>
        <button className="logout-button" onClick={() => {
          localStorage.removeItem('adminSession');
          window.location.href = '/';
        }}>Logout</button>
      </header>

      <div className="manage-floors">
        <div className="page-header">
          <h2>Manage Floors</h2>
          <button className="back-button" onClick={() => window.location.href = '/admin-dashboard'}>
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-section">
          <h3>Add New Floor</h3>
          <form onSubmit={handleAddFloor} className="floor-form">
            <div className="form-group">
              <label>Select Building</label>
              <select
                value={selectedBuildingId}
                onChange={(e) => setSelectedBuildingId(e.target.value)}
                required
              >
                <option value="">-- Choose Building --</option>
                {buildings.map((building) => (
                  <option key={building.building_id} value={building.building_id}>
                    {building.building_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Floor Name</label>
              <input
                type="text"
                value={floorName}
                onChange={(e) => setFloorName(e.target.value)}
                placeholder="e.g., Ground Floor, 1st Floor, 2nd Floor"
                required
              />
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Floor'}
            </button>
          </form>
        </div>

        <div className="floors-list">
          <h3>Registered Floors ({floors.length})</h3>
          {floors.length === 0 ? (
            <p className="empty-state">No floors added yet. Add your first floor above!</p>
          ) : (
            <div className="floors-grid">
              {floors.map((floor) => (
                <div key={floor.floor_id} className="floor-card">
                  <div className="floor-info">
                    <h4>{floor.floor_name}</h4>
                    <p className="building-name">
                      Building: {floor.building?.building_name || 'Unknown'}
                    </p>
                    <p className="floor-id">Floor ID: {floor.floor_id}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteFloor(floor.floor_id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageFloors;

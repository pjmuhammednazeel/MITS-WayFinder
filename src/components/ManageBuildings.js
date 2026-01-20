import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabaseClient';
import './ManageBuildings.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

// Map click handler
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
};

const ManageBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mapCenter] = useState([9.964102, 76.408134]); // MITS campus

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('adminSession');
    if (!storedAdmin) {
      window.location.href = '/login';
      return;
    }
    fetchBuildings();
  }, []);

  const handleMapClick = (lat, lng) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setSuccess('Location selected from map');
  };

  const fetchBuildings = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('building')
        .select('building_id, building_name, latitude, longitude')
        .order('building_id', { ascending: false });

      if (fetchError) throw fetchError;
      setBuildings(data || []);
    } catch (err) {
      console.error('Error fetching buildings:', err);
      setError(err.message || 'Failed to load buildings');
    }
  };

  const handleAddBuilding = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !latitude || !longitude) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('building')
        .insert([
          {
            building_name: name,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude)
          }
        ])
        .select();

      if (insertError) throw insertError;

      setSuccess('Building added successfully!');
      setName('');
      setLatitude('');
      setLongitude('');
      fetchBuildings();
    } catch (err) {
      console.error('Error adding building:', err);
      setError(err.message || 'Failed to add building');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuilding = async (id) => {
    if (!window.confirm('Are you sure?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('building')
        .delete()
        .eq('building_id', id);

      if (deleteError) throw deleteError;
      setSuccess('Building deleted');
      fetchBuildings();
    } catch (err) {
      console.error('Error deleting building:', err);
      setError('Failed to delete building');
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

      <div className="manage-buildings">
      <div className="mb-header">
        <h2>Manage Buildings</h2>
        <button 
          type="button"
          className="back-btn" 
          onClick={() => {
            window.location.href = '/admin-dashboard';
          }}
        >Back</button>
      </div>

      <div className="mb-container">
        <div className="form-and-map">
          <form className="add-building-form" onSubmit={handleAddBuilding}>
            <h3>Add New Building</h3>

            <label className="field">
              <span>Building Name</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Library, Lab Block A"
                disabled={loading}
              />
            </label>

            <div className="coords-grid">
              <label className="field">
                <span>Latitude</span>
                <input
                  type="number"
                  step="0.000001"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="e.g., 9.964102"
                  disabled={loading}
                />
              </label>

              <label className="field">
                <span>Longitude</span>
                <input
                  type="number"
                  step="0.000001"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="e.g., 76.408134"
                  disabled={loading}
                />
              </label>
            </div>

            <div className="map-hint">
              <small>💡 Click on the map to set location</small>
            </div>

            {error && <div className="error-box">{error}</div>}
            {success && <div className="success-box">{success}</div>}

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Building'}
            </button>
          </form>

          <div className="map-picker">
            <h3>Select Location</h3>
            <MapContainer
              center={mapCenter}
              zoom={16}
              className="picker-map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onLocationSelect={handleMapClick} />
              {latitude && longitude && (
                <Marker position={[parseFloat(latitude), parseFloat(longitude)]} />
              )}
            </MapContainer>
          </div>
        </div>

        <div className="buildings-list">
          <h3>Buildings ({buildings.length})</h3>
          {buildings.length === 0 ? (
            <p className="no-data">No buildings added yet</p>
          ) : (
            <div className="buildings-grid">
              {buildings.map((building) => (
                <div key={building.building_id} className="building-card">
                  <div className="card-content">
                    <h4>{building.building_name}</h4>
                    <div className="coords">
                      <span>Lat: {building.latitude}</span>
                      <span>Lng: {building.longitude}</span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteBuilding(building.building_id)}
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
    </div>
  );
};

export default ManageBuildings;

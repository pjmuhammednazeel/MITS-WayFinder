import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import './ManageRooms.css';

const ManageRooms = () => {
  const [buildings, setBuildings] = useState([]);
  const [floors, setFloors] = useState([]);
  const [filteredFloors, setFilteredFloors] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedBuildingId, setSelectedBuildingId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
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
    fetchRooms();
  }, []);

  useEffect(() => {
    // Filter floors when building is selected
    if (selectedBuildingId) {
      const filtered = floors.filter(
        floor => floor.building_id === parseInt(selectedBuildingId)
      );
      setFilteredFloors(filtered);
      setSelectedFloorId(''); // Reset floor selection when building changes
    } else {
      setFilteredFloors([]);
      setSelectedFloorId('');
    }
  }, [selectedBuildingId, floors]);

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
        .select('floor_id, floor_name, building_id')
        .order('floor_name', { ascending: true });

      if (error) throw error;
      setFloors(data || []);
    } catch (err) {
      console.error('Error fetching floors:', err);
      setError('Failed to load floors');
    }
  };

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          room_id,
          room_name,
          room_number,
          building_id,
          floor_id,
          building:building_id (building_name),
          floor:floor_id (floor_name)
        `)
        .order('building_id', { ascending: true })
        .order('floor_id', { ascending: true })
        .order('room_number', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedBuildingId || !selectedFloorId || !roomName.trim() || !roomNumber.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            building_id: parseInt(selectedBuildingId),
            floor_id: parseInt(selectedFloorId),
            room_name: roomName.trim(),
            room_number: roomNumber.trim()
          }
        ])
        .select();

      if (error) throw error;

      setSuccess('Room added successfully!');
      setRoomName('');
      setRoomNumber('');
      setSelectedBuildingId('');
      setSelectedFloorId('');
      fetchRooms();
    } catch (err) {
      console.error('Error adding room:', err);
      setError('Failed to add room: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('room_id', roomId);

      if (error) throw error;

      setSuccess('Room deleted successfully!');
      fetchRooms();
    } catch (err) {
      console.error('Error deleting room:', err);
      setError('Failed to delete room: ' + err.message);
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

      <div className="manage-rooms">
        <div className="page-header">
          <h2>Manage Rooms</h2>
          <button className="back-button" onClick={() => window.location.href = '/admin-dashboard'}>
            ← Back to Dashboard
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-section">
          <h3>Add New Room</h3>
          <form onSubmit={handleAddRoom} className="room-form">
            <div className="form-row">
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
                <label>Select Floor</label>
                <select
                  value={selectedFloorId}
                  onChange={(e) => setSelectedFloorId(e.target.value)}
                  required
                  disabled={!selectedBuildingId}
                >
                  <option value="">-- Choose Floor --</option>
                  {filteredFloors.map((floor) => (
                    <option key={floor.floor_id} value={floor.floor_id}>
                      {floor.floor_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="e.g., Computer Lab, Lecture Hall"
                  required
                />
              </div>

              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g., 101, A-204"
                  required
                />
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Room'}
            </button>
          </form>
        </div>

        <div className="rooms-list">
          <h3>Registered Rooms ({rooms.length})</h3>
          {rooms.length === 0 ? (
            <p className="empty-state">No rooms added yet. Add your first room above!</p>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.room_id} className="room-card">
                  <div className="room-info">
                    <h4>{room.room_name}</h4>
                    <p className="room-number">Room Number: {room.room_number}</p>
                    <p className="building-name">
                      Building: {room.building?.building_name || 'Unknown'}
                    </p>
                    <p className="floor-name">
                      Floor: {room.floor?.floor_name || 'Unknown'}
                    </p>
                    <p className="room-id">Room ID: {room.room_id}</p>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteRoom(room.room_id)}
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

export default ManageRooms;

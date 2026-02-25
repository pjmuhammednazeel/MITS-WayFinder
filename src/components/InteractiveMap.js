import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Navigation,
  Crosshair,
  Building2,
  Coffee,
  Book,
  Car,
  Users,
  Wifi,
  AlertCircle,
  Search
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import './InteractiveMap.css';

// User location marker — blue pulsing dot
const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `<div class="user-marker">
    <div class="user-marker-inner"></div>
    <div class="user-marker-pulse"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

// Destination marker — teal pulsing dot with label
const createDestinationIcon = (label = '') => L.divIcon({
  className: 'campus-marker',
  html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;">
    <div style="
      background:#4de2c1;
      border-radius:50%;
      width:22px;
      height:22px;
      border:3px solid white;
      box-shadow:0 0 0 5px rgba(77,226,193,0.3), 0 3px 12px rgba(0,0,0,0.3);
      animation:dest-pulse 2s infinite;
    "></div>
    ${label ? `<div style="
      margin-top:6px;
      background:rgba(11,18,36,0.92);
      color:#4de2c1;
      font-family:'Space Grotesk',sans-serif;
      font-size:11px;
      font-weight:700;
      padding:3px 8px;
      border-radius:6px;
      border:1px solid rgba(77,226,193,0.4);
      white-space:nowrap;
      max-width:140px;
      overflow:hidden;
      text-overflow:ellipsis;
    ">${label}</div>` : ''}
  </div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  popupAnchor: [0, -16]
});


// Component to handle map centering when user location changes
const MapController = ({ userLocation }) => {
  const map = useMap();

  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 16);
    }
  }, [map, userLocation]);

  return null;
};

// Component to set map reference
const MapRefSetter = ({ mapRef }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
};

const InteractiveMap = ({ onClose }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const mapRef = useRef();

  // Fetch rooms from database
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          room_id,
          room_name,
          room_number::text,
          floor:floor_id (
            floor_id,
            floor_name,
            building:building_id (
              building_id,
              building_name,
              latitude,
              longitude
            )
          )
        `);

      if (error) {
        console.error('Error fetching rooms:', error);
      } else {
        console.log('Fetched rooms:', data);
        setRooms(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  // Handle room search
  const handleRoomSearch = () => {
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    console.log('Searching for:', query);
    console.log('Available rooms:', rooms);

    const results = rooms.filter(room => {
      const roomName = (room.room_name || '').toLowerCase();
      const roomNumber = (room.room_number || '').toLowerCase();
      const matches = roomName.includes(query) || roomNumber.includes(query);

      if (matches) {
        console.log('Match found:', room);
      }

      return matches;
    });

    console.log('Search results:', results);
    setSearchResults(results);
    setShowSearchResults(true);
  };

  // Handle Enter key in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRoomSearch();
    }
  };

  // Handle clicking on a room search result
  const handleRoomClick = async (room) => {
    console.log('Room clicked:', room);
    const building = room.floor?.building;
    if (!building) {
      console.log('No building data found');
      return;
    }

    console.log('Building:', building);
    const lat = parseFloat(building.latitude);
    const lng = parseFloat(building.longitude);

    console.log('Coordinates:', lat, lng);
    console.log('Map ref:', mapRef.current);

    if (lat && lng && mapRef.current) {
      console.log('Setting map view to:', [lat, lng]);
      mapRef.current.setView([lat, lng], 18);

      // Set selected location for marker highlight
      setSelectedLocation({
        name: building.building_name,
        position: [lat, lng],
        roomInfo: room
      });

      // Create path from user location to building (if user location exists)
      if (userLocation) {
        // Fetch route from OSRM
        try {
          const response = await fetch(
            `https://router.project-osrm.org/route/v1/foot/${userLocation.lng},${userLocation.lat};${lng},${lat}?overview=full&geometries=geojson`
          );
          const data = await response.json();

          if (data.code === 'Ok' && data.routes && data.routes[0]) {
            const route = data.routes[0].geometry.coordinates;
            // Convert [lng, lat] to [lat, lng] for Leaflet
            const routeCoords = route.map(coord => [coord[1], coord[0]]);
            setPathCoordinates(routeCoords);
          } else {
            // Fallback to straight line if routing fails
            setPathCoordinates([
              [userLocation.lat, userLocation.lng],
              [lat, lng]
            ]);
          }
        } catch (error) {
          console.error('Routing error:', error);
          // Fallback to straight line
          setPathCoordinates([
            [userLocation.lat, userLocation.lng],
            [lat, lng]
          ]);
        }
      } else {
        setPathCoordinates([]);
      }
    } else {
      console.log('Missing coordinates or map reference');
    }
  };

  // Muthoot Institute of Technology & Science - Real campus locations
  const campusLocations = [
    {
      id: 1,
      name: "Muthoot Institute of Technology & Science",
      position: [9.964102, 76.408134],
      type: "building",
      color: "#D32F2F",
      description: "Main academic institution building",
      facilities: ["Administrative Offices", "Academic Departments", "Faculty Rooms"]
    },
    {
      id: 2,
      name: "Department of Electronics Engineering",
      position: [9.963850, 76.407900],
      type: "building",
      color: "#FF6B35",
      description: "Electronics Engineering department with modern labs",
      facilities: ["Electronics Labs", "Project Rooms", "Faculty Offices"]
    },
    {
      id: 3,
      name: "Department of Computer Application",
      position: [9.963700, 76.408050],
      type: "building",
      color: "#FF8A50",
      description: "Computer Science and Application department",
      facilities: ["Computer Labs", "Software Labs", "Research Centers"]
    },
    {
      id: 4,
      name: "MITS Canteen",
      position: [9.964200, 76.407800],
      type: "cafeteria",
      color: "#4CAF50",
      description: "Main campus canteen for students and staff",
      facilities: ["Food Court", "Dining Area", "Snack Counter"]
    },
    {
      id: 5,
      name: "MITS Cafe",
      position: [9.964000, 76.408200],
      type: "cafeteria",
      color: "#66BB6A",
      description: "Campus cafe with refreshments and light meals",
      facilities: ["Coffee Bar", "Snacks", "Seating Area"]
    },
    {
      id: 6,
      name: "Michael Jordan Basketball Arena",
      position: [9.964300, 76.407700],
      type: "sports",
      color: "#FF9800",
      description: "Basketball court named after Michael Jordan",
      facilities: ["Basketball Court", "Spectator Seating", "Sports Equipment"]
    },
    {
      id: 7,
      name: "Sachin Tendulkar Arena",
      position: [9.963500, 76.408800],
      type: "sports",
      color: "#FFA726",
      description: "Cricket arena named after Sachin Tendulkar",
      facilities: ["Cricket Ground", "Practice Nets", "Pavilion"]
    },
    {
      id: 8,
      name: "Cricket Net",
      position: [9.963600, 76.408600],
      type: "sports",
      color: "#FFCC02",
      description: "Cricket practice nets for training",
      facilities: ["Practice Nets", "Batting Cages", "Equipment Storage"]
    },
    {
      id: 9,
      name: "MITS New Hostel",
      position: [9.964800, 76.408500],
      type: "hostel",
      color: "#9C27B0",
      description: "New student accommodation facility",
      facilities: ["Student Rooms", "Common Areas", "Mess", "Recreation Room"]
    },
    {
      id: 10,
      name: "MITS Mens Hostel",
      position: [9.964600, 76.408700],
      type: "hostel",
      color: "#673AB7",
      description: "Male student accommodation",
      facilities: ["Student Rooms", "Study Areas", "Common Room", "Mess"]
    },
    {
      id: 11,
      name: "MITS Girls Hostel",
      position: [9.963300, 76.409200],
      type: "hostel",
      color: "#E91E63",
      description: "Female student accommodation with modern amenities",
      facilities: ["Student Rooms", "Study Hall", "Recreation Area", "Mess"]
    },
    {
      id: 12,
      name: "Ramanujan Block",
      position: [9.963900, 76.408300],
      type: "building",
      color: "#795548",
      description: "Academic block named after mathematician Ramanujan",
      facilities: ["Classrooms", "Lecture Halls", "Faculty Offices", "Labs"]
    },
    {
      id: 13,
      name: "Main Parking Area",
      position: [9.964000, 76.407600],
      type: "parking",
      color: "#607D8B",
      description: "Primary parking facility for campus visitors",
      facilities: ["Car Parking", "Two-Wheeler Parking", "Visitor Parking"]
    },
    {
      id: 14,
      name: "Bus Parking",
      position: [9.963800, 76.407500],
      type: "parking",
      color: "#78909C",
      description: "Dedicated bus parking area",
      facilities: ["Bus Stand", "Student Transport", "Public Transport"]
    }
  ];

  // Get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          accuracy: position.coords.accuracy
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
          default:
            errorMessage = "An unknown error occurred.";
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Filter locations based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(campusLocations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = campusLocations.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.description.toLowerCase().includes(query) ||
        location.type.toLowerCase().includes(query)
      );
      setFilteredLocations(filtered);
    }
  }, [searchQuery]);

  // Watch user location for continuous updates
  useEffect(() => {
    let watchId;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({
            lat: latitude,
            lng: longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => console.log("Watch location error:", error),
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 30000
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Default center (Muthoot Institute of Technology & Science)
  const defaultCenter = [9.964102, 76.408134];
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter;

  return (
    <div className="interactive-map-container">
      <div className="map-header">
        <div className="map-title">
          <MapPin className="title-icon" />
          <h2>Muthoot Institute of Technology & Science</h2>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search by room name or room number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearchKeyPress}
          />
          <button className="search-btn" onClick={handleRoomSearch}>
            <Search className="btn-icon" style={{ width: '18px', height: '18px', marginRight: '5px' }} />
            Search
          </button>
        </div>
        <div className="map-controls">
          <button
            className={`location-btn ${isLoadingLocation ? 'loading' : ''}`}
            onClick={getUserLocation}
            disabled={isLoadingLocation}
          >
            <Crosshair className="btn-icon" />
            {isLoadingLocation ? 'Getting Location...' : 'My Location'}
          </button>
        </div>
      </div>

      {locationError && (
        <div className="error-banner">
          <AlertCircle className="error-icon" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Search Results Panel */}
      {showSearchResults && (
        <div className="search-results-panel">
          <div className="search-results-header">
            <h3>Search Results ({searchResults.length})</h3>
            <button
              className="close-results-btn"
              onClick={() => setShowSearchResults(false)}
            >
              ×
            </button>
          </div>
          <div className="search-results-list">
            {searchResults.length > 0 ? (
              searchResults.map((room) => (
                <div
                  key={room.room_id}
                  className="search-result-item"
                  onClick={() => handleRoomClick(room)}
                >
                  <div className="result-header">
                    <h4>{room.room_name}</h4>
                    <span className="room-number-badge">{room.room_number}</span>
                  </div>
                  <div className="result-details">
                    <p><strong>Building:</strong> {room.floor?.building?.building_name || 'N/A'}</p>
                    <p><strong>Floor:</strong> {room.floor?.floor_name || 'N/A'}</p>
                    <p className="click-hint">📍 Click to view on map</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <Search className="no-results-icon" />
                <p>No rooms found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="map-info-panel">
        <div className="location-status">
          {userLocation ? (
            <div className="status-item success">
              <Navigation className="status-icon" />
              <span>Location: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</span>
              <span className="accuracy">±{Math.round(userLocation.accuracy)}m</span>
            </div>
          ) : (
            <div className="status-item">
              <MapPin className="status-icon" />
              <span>Click "My Location" to see your position on the map</span>
            </div>
          )}
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={userLocation ? 17 : 16}
        className="leaflet-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapRefSetter mapRef={mapRef} />
        <MapController userLocation={userLocation} />

        {/* User location marker — shown after tapping My Location */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="user-popup">
                <h4>📍 Your Location</h4>
                <p>Lat: {userLocation.lat.toFixed(6)}</p>
                <p>Lng: {userLocation.lng.toFixed(6)}</p>
                <p>Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Destination building marker — shown only after a room search */}
        {selectedLocation && selectedLocation.position && (
          <Marker
            position={selectedLocation.position}
            icon={createDestinationIcon(selectedLocation.name)}
          >
            <Popup>
              <div className="campus-popup">
                <h3>{selectedLocation.name}</h3>
                {selectedLocation.roomInfo && (
                  <>
                    <p><strong>Room:</strong> {selectedLocation.roomInfo.room_name}</p>
                    <p><strong>Room No:</strong> {selectedLocation.roomInfo.room_number}</p>
                    <p><strong>Floor:</strong> {selectedLocation.roomInfo.floor?.floor_name}</p>
                  </>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Path from user location to selected building */}
        {pathCoordinates.length > 0 && (
          <>
            <Polyline
              positions={pathCoordinates}
              color="#0066cc"
              weight={6}
              opacity={0.6}
            />
            <Polyline
              positions={pathCoordinates}
              color="#4de2c1"
              weight={4}
              opacity={1}
            />
          </>
        )}

        {/* Campus location markers removed */}

      </MapContainer>


    </div>
  );
};

// Helper function to calculate distance between two points
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lng2 - lng1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default InteractiveMap;
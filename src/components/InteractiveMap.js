import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  ArrowLeft
} from 'lucide-react';
import './InteractiveMap.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

// Custom icons
const userLocationIcon = L.divIcon({
  className: 'user-location-icon',
  html: `<div class="user-marker">
    <div class="user-marker-inner"></div>
    <div class="user-marker-pulse"></div>
  </div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

const createCampusIcon = (color = '#D32F2F', iconType = 'building') => {
  const iconMap = {
    building: '🏢',
    library: '📚',
    cafeteria: '🍽️',
    parking: '🅿️',
    admin: '🏛️',
    sports: '⚽',
    hostel: '🏠'
  };

  return L.divIcon({
    className: 'campus-marker',
    html: `<div style="
      background: ${color};
      color: white;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 3px solid white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    ">${iconMap[iconType] || '🏢'}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

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

const InteractiveMap = ({ onClose }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef();

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
        <div className="map-controls">
          <button 
            className="location-btn"
            onClick={() => onClose && onClose()}
            disabled={!onClose}
          >
            <ArrowLeft className="btn-icon" />
            Back
          </button>
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
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController userLocation={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="user-popup">
                <h4>Your Location</h4>
                <p>Coordinates: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}</p>
                <p>Accuracy: ±{Math.round(userLocation.accuracy)} meters</p>
              </div>
            </Popup>
          </Marker>
        )}


      </MapContainer>


    </div>
  );
};

// Helper function to calculate distance between two points
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export default InteractiveMap;
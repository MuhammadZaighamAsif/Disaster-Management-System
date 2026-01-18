import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const ViewMap = () => {
  const [victims, setVictims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [volunteerLocation, setVolunteerLocation] = useState(null);

  useEffect(() => {
    // Get volunteer's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setVolunteerLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          fetchNearbyVictims(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location if geolocation fails
          setVolunteerLocation({ lat: 33.6844, lng: 73.0479 }); // Islamabad default
          fetchNearbyVictims(33.6844, 73.0479);
        }
      );
    }
  }, []);

  const fetchNearbyVictims = async (lat, lng) => {
    try {
      const response = await fetch(`http://localhost:5000/api/volunteers/victims/nearby?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        setVictims(data);
      } else {
        setError('Failed to load victim locations');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching victims:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = (priority) => {
    switch (priority) {
      case 'high':
        return redIcon;
      case 'medium':
        return yellowIcon;
      case 'low':
        return greenIcon;
      default:
        return greenIcon;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">View Victims Within 5km Radius</h1>
          <p className="text-gray-600 text-sm">
            Powered by <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenStreetMap</a> & <a href="https://leafletjs.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Leaflet</a>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {loading ? (
                <div className="h-96 md:h-96 lg:h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-600">Loading map and victim locations...</p>
                </div>
              ) : volunteerLocation ? (
                <MapContainer 
                  center={[volunteerLocation.lat, volunteerLocation.lng]} 
                  zoom={13} 
                  style={{ height: '500px', width: '100%' }}
                >
                  {/* OpenStreetMap Tiles */}
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  
                  {/* Volunteer's Location */}
                  <Marker position={[volunteerLocation.lat, volunteerLocation.lng]}>
                    <Popup>
                      <div>
                        <p className="font-semibold">Your Location</p>
                        <p className="text-xs text-gray-600">Volunteer Position</p>
                      </div>
                    </Popup>
                  </Marker>
                  
                  {/* Victims' Locations */}
                  {victims.map((victim) => (
                    <Marker 
                      key={victim.id}
                      position={[victim.latitude, victim.longitude]}
                      icon={getMarkerIcon(victim.priority)}
                    >
                      <Popup>
                        <div className="w-48">
                          <p className="font-semibold">{victim.name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            <FontAwesomeIcon icon={faLocationDot} className="mr-1" />
                            {victim.location}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            Distance: {victim.distance?.toFixed(2) || 'N/A'} km
                          </p>
                          <p className={`text-xs font-semibold mt-1 ${
                            victim.priority === 'high' ? 'text-red-600' :
                            victim.priority === 'medium' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            Priority: {victim.priority?.toUpperCase() || 'NORMAL'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Status: {victim.status}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              ) : (
                <div className="h-96 md:h-96 lg:h-full flex items-center justify-center bg-gray-100">
                  <p className="text-gray-600">Unable to get your location</p>
                </div>
              )}
            </div>
          </div>

          {/* Victims List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">Nearby Victims ({victims.length})</h2>
            {victims.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No victim locations nearby</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {victims.map((victim) => (
                  <div
                    key={victim.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      victim.priority === 'high'
                        ? 'border-red-600 bg-red-50'
                        : victim.priority === 'medium'
                        ? 'border-yellow-600 bg-yellow-50'
                        : 'border-green-600 bg-green-50'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{victim.name}</p>
                    <p className="text-xs text-gray-600">
                      <FontAwesomeIcon icon={faLocationDot} className="mr-1" /> {victim.location}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Distance: {victim.distance?.toFixed(2) || 'N/A'} km
                    </p>
                    <p className="text-xs text-gray-600">
                      Status: {victim.status}
                    </p>
                    <button className="mt-2 w-full bg-forest text-white text-xs py-1 rounded hover:bg-sage transition">
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-sm font-semibold mb-3">Priority Levels:</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-600 rounded-full mr-2"></div>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  <span>Low Priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMap;

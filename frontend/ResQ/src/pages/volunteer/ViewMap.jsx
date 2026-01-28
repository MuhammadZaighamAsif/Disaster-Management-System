import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faLocationDot, faArrowLeft, faExclamationTriangle, faWater, faFire, faWind, faUsers } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker, Popup, Circle, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../styles/map.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { useNavigate } from "react-router-dom"

// Fix default Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom marker icons - Blue for user location
const blueIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icons - Red for disasters
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icons - Green for victims (low priority)
const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom marker icons - Yellow for medium priority
const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Helper function to generate random position within radius (in km)
const generateRandomPositionWithinRadius = (centerLat, centerLng, radiusKm) => {
  const radiusInDegrees = radiusKm / 111; // Approximate conversion
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * radiusInDegrees;

  const lat = centerLat + (distance * Math.cos(angle));
  const lng = centerLng + (distance * Math.sin(angle));

  return { lat, lng };
};

// Helper function to calculate distance between two points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Generate hardcoded disasters within 5km radius
const generateNearbyDisasters = (userLat, userLng) => {
  const disasterTypes = [
    { type: 'Flood', icon: faWater, severity: 'high', color: '#3B82F6' },
    { type: 'Fire', icon: faFire, severity: 'critical', color: '#EF4444' },
    { type: 'Earthquake', icon: faExclamationTriangle, severity: 'medium', color: '#F59E0B' },
    { type: 'Storm', icon: faWind, severity: 'high', color: '#8B5CF6' }
  ];

  const disasters = [];

  // Generate 4 disasters within 5km radius
  for (let i = 0; i < 4; i++) {
    const position = generateRandomPositionWithinRadius(userLat, userLng, 4.5); // Within 4.5km to ensure all are under 5km
    const disasterInfo = disasterTypes[i];
    const distance = calculateDistance(userLat, userLng, position.lat, position.lng);

    disasters.push({
      id: `disaster-${i + 1}`,
      name: `${disasterInfo.type} Alert Zone ${i + 1}`,
      type: disasterInfo.type,
      latitude: position.lat,
      longitude: position.lng,
      severity: disasterInfo.severity,
      icon: disasterInfo.icon,
      color: disasterInfo.color,
      distance: distance,
      affectedPeople: Math.floor(Math.random() * 500) + 50,
      reportedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleString(),
      status: ['Active', 'Monitoring', 'Critical'][Math.floor(Math.random() * 3)]
    });
  }

  return disasters.sort((a, b) => a.distance - b.distance);
};

const ViewMap = () => {
  const [victims, setVictims] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [volunteerLocation, setVolunteerLocation] = useState(null);
  const [activeTab, setActiveTab] = useState('disasters'); // 'disasters' or 'victims'
  const navigate = useNavigate();

  useEffect(() => {
    // Get volunteer's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          setVolunteerLocation({
            lat: userLat,
            lng: userLng
          });

          // Generate hardcoded disasters based on user location
          const nearbyDisasters = generateNearbyDisasters(userLat, userLng);
          setDisasters(nearbyDisasters);

          fetchNearbyVictims(userLat, userLng);
        },
        (error) => {
          console.error('Error getting location:', error);
          // Use default location if geolocation fails (Islamabad)
          const defaultLat = 33.6844;
          const defaultLng = 73.0479;

          setVolunteerLocation({ lat: defaultLat, lng: defaultLng });

          // Generate hardcoded disasters based on default location
          const nearbyDisasters = generateNearbyDisasters(defaultLat, defaultLng);
          setDisasters(nearbyDisasters);

          fetchNearbyVictims(defaultLat, defaultLng);
        }
      );
    }
  }, []);

  const fetchNearbyVictims = async (lat, lng) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/volunteers/victims/nearby?lat=${lat}&lng=${lng}`);
      if (response.ok) {
        const data = await response.json();
        setVictims(data);
      } else {
        // Don't set error for victims, just leave empty
        setVictims([]);
      }
    } catch (error) {
      console.error('Error fetching victims:', error);
      setVictims([]);
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

  const getDisasterIcon = (severity) => {
    switch (severity) {
      case 'critical':
        return redIcon;
      case 'high':
        return orangeIcon;
      case 'medium':
        return yellowIcon;
      default:
        return greenIcon;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/volunteer/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Disaster Response Map</h1>
              <p className="text-gray-300 text-lg">View disasters and victims within 5km radius of your location</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faMap} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#0F2854]/60 backdrop-blur-md border border-[#4988C4]/30 rounded-xl p-4 shadow-lg">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Your Location</p>
            <p className="text-white font-semibold mt-1 text-sm">
              {volunteerLocation ? `${volunteerLocation.lat.toFixed(4)}°, ${volunteerLocation.lng.toFixed(4)}°` : 'Fetching...'}
            </p>
          </div>
          <div className="bg-[#0F2854]/60 backdrop-blur-md border border-red-500/30 rounded-xl p-4 shadow-lg">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Nearby Disasters</p>
            <p className="text-red-400 font-bold text-2xl mt-1">{disasters.length}</p>
          </div>
          <div className="bg-[#0F2854]/60 backdrop-blur-md border border-[#629FAD]/30 rounded-xl p-4 shadow-lg">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Victims Found</p>
            <p className="text-[#629FAD] font-bold text-2xl mt-1">{victims.length}</p>
          </div>
          <div className="bg-[#0F2854]/60 backdrop-blur-md border border-[#5A7863]/30 rounded-xl p-4 shadow-lg">
            <p className="text-gray-400 text-xs uppercase tracking-wider">Search Radius</p>
            <p className="text-[#90AB8B] font-bold text-2xl mt-1">5 km</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-[#4988C4]/30">
              <div className="p-4 border-b border-[#4988C4]/30 flex items-center justify-between">
                <h2 className="text-white font-semibold flex items-center gap-2">
                  <FontAwesomeIcon icon={faMap} className="text-[#4988C4]" />
                  Live Map View
                </h2>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-gray-400">
                    <span className="w-2 h-2 bg-[#90AB8B] rounded-full animate-pulse"></span>
                    Live
                  </span>
                </div>
              </div>
              {loading ? (
                <div className="h-125 flex items-center justify-center bg-[#0a1628]">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#4988C4]/30 border-t-[#4988C4] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Fetching your location & nearby disasters...</p>
                  </div>
                </div>
              ) : volunteerLocation ? (
                <MapContainer
                  center={[volunteerLocation.lat, volunteerLocation.lng]}
                  zoom={13}
                  style={{ height: '500px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                  {/* 5km Radius Circle */}
                  <Circle
                    center={[volunteerLocation.lat, volunteerLocation.lng]}
                    radius={5000}
                    pathOptions={{
                      color: '#4988C4',
                      fillColor: '#4988C4',
                      fillOpacity: 0.1,
                      weight: 2,
                      dashArray: '10, 5'
                    }}
                  />

                  {/* Volunteer's Location */}
                  <Marker position={[volunteerLocation.lat, volunteerLocation.lng]} icon={blueIcon}>
                    <Tooltip direction="top" offset={[0, -35]} permanent className="custom-tooltip">
                      <span className="font-bold">YOU</span>
                    </Tooltip>
                    <Popup>
                      <div className="text-center">
                        <p className="font-bold text-[#4988C4]">📍 Your Location</p>
                        <p className="text-xs text-gray-600 mt-1">Volunteer Position</p>
                        <p className="text-xs text-gray-500">
                          {volunteerLocation.lat.toFixed(4)}°, {volunteerLocation.lng.toFixed(4)}°
                        </p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Disaster Markers */}
                  {disasters.map((disaster) => (
                    <Marker
                      key={disaster.id}
                      position={[disaster.latitude, disaster.longitude]}
                      icon={redIcon}
                    >
                      <Tooltip direction="top" offset={[0, -35]} permanent className="disaster-tooltip">
                        <span className="font-bold">{disaster.type}</span>
                      </Tooltip>
                      <Popup>
                        <div className="w-56">
                          <div className="flex items-center gap-2 mb-2">
                            <FontAwesomeIcon icon={disaster.icon} style={{ color: disaster.color }} />
                            <p className="font-bold text-gray-800">{disaster.name}</p>
                          </div>
                          <div className="space-y-1 text-xs">
                            <p className="text-gray-600">
                              <span className="font-semibold">Type:</span> {disaster.type}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Distance:</span> {disaster.distance.toFixed(2)} km
                            </p>
                            <p className="text-gray-600">
                              <span className="font-semibold">Affected:</span> ~{disaster.affectedPeople} people
                            </p>
                            <p className={`font-semibold ${disaster.severity === 'critical' ? 'text-red-600' :
                              disaster.severity === 'high' ? 'text-orange-600' :
                                'text-yellow-600'
                              }`}>
                              Severity: {disaster.severity.toUpperCase()}
                            </p>
                            <p className="text-gray-500">
                              Reported: {disaster.reportedAt}
                            </p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

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
                          <p className={`text-xs font-semibold mt-1 ${victim.priority === 'high' ? 'text-red-600' :
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
                <div className="h-125 flex items-center justify-center bg-[#0a1628]">
                  <div className="text-center">
                    <FontAwesomeIcon icon={faLocationDot} className="text-4xl text-gray-600 mb-4" />
                    <p className="text-gray-400">Unable to get your location</p>
                    <p className="text-gray-500 text-sm mt-2">Please enable location services</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-xl p-1 border border-[#4988C4]/30 flex">
              <button
                onClick={() => setActiveTab('disasters')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'disasters'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                Disasters ({disasters.length})
              </button>
              <button
                onClick={() => setActiveTab('victims')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${activeTab === 'victims'
                  ? 'bg-[#629FAD]/20 text-[#629FAD] border border-[#629FAD]/30'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Victims ({victims.length})
              </button>
            </div>

            {/* Disasters List */}
            {activeTab === 'disasters' && (
              <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-red-500/30 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-red-500/30">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-400" />
                    Nearby Disasters
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">Within 5km of your location</p>
                </div>
                <div className="max-h-100 overflow-y-auto">
                  {disasters.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-400">No disasters reported nearby</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#0F2854]">
                      {disasters.map((disaster) => (
                        <div
                          key={disaster.id}
                          className="p-4 hover:bg-[#0F2854]/40 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: `${disaster.color}20` }}
                            >
                              <FontAwesomeIcon
                                icon={disaster.icon}
                                style={{ color: disaster.color }}
                                className="text-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm">{disaster.name}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {disaster.distance.toFixed(2)} km away • {disaster.affectedPeople} affected
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${disaster.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                  disaster.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                    'bg-yellow-500/20 text-yellow-400'
                                  }`}>
                                  {disaster.severity.toUpperCase()}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${disaster.status === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                  disaster.status === 'Active' ? 'bg-[#5A7863]/20 text-[#90AB8B]' :
                                    'bg-[#4988C4]/20 text-[#4988C4]'
                                  }`}>
                                  {disaster.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Victims List */}
            {activeTab === 'victims' && (
              <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 overflow-hidden shadow-lg">
                <div className="p-4 border-b border-[#629FAD]/30">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <FontAwesomeIcon icon={faUsers} className="text-[#629FAD]" />
                    Nearby Victims
                  </h2>
                  <p className="text-gray-500 text-xs mt-1">People in need of assistance</p>
                </div>
                <div className="max-h-100 overflow-y-auto">
                  {victims.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-gray-400">No victims reported nearby</p>
                      <p className="text-gray-500 text-xs mt-2">This area appears to be safe</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-[#0F2854]">
                      {victims.map((victim) => (
                        <div
                          key={victim.id}
                          className="p-4 hover:bg-[#0F2854]/40 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${victim.priority === 'high' ? 'bg-red-500/20' :
                              victim.priority === 'medium' ? 'bg-yellow-500/20' :
                                'bg-[#5A7863]/20'
                              }`}>
                              <FontAwesomeIcon
                                icon={faLocationDot}
                                className={`text-lg ${victim.priority === 'high' ? 'text-red-400' :
                                  victim.priority === 'medium' ? 'text-yellow-400' :
                                    'text-[#90AB8B]'
                                  }`}
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-semibold text-sm">{victim.name}</p>
                              <p className="text-gray-400 text-xs mt-1">
                                {victim.distance?.toFixed(2) || 'N/A'} km away
                              </p>
                              <p className="text-gray-500 text-xs">{victim.location}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${victim.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                                  victim.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-[#5A7863]/20 text-[#90AB8B]'
                                  }`}>
                                  {victim.priority?.toUpperCase() || 'NORMAL'} PRIORITY
                                </span>
                              </div>
                              <button className="mt-3 w-full bg-[#4988C4] text-white text-xs py-2 rounded-lg hover:bg-[#296374] transition font-semibold">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-5 border border-[#5A7863]/30 shadow-lg">
              <p className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#90AB8B] rounded-full"></span>
                Map Legend
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#4988C4] rounded-full"></div>
                  <span className="text-gray-300">Your Location</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-gray-300">Critical Severity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300">High Severity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-300">Medium Severity</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-[#90AB8B] rounded-full"></div>
                  <span className="text-gray-300">Low Severity</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-[#5A7863]/30">
                  <div className="w-4 h-4 border-2 border-dashed border-[#4988C4] rounded-full"></div>
                  <span className="text-gray-300">5km Search Radius</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 text-center border border-[#5A7863]/30 shadow-lg mt-8">
          <h3 className="text-xl font-bold mb-2 text-white">Real-Time Disaster Monitoring</h3>
          <p className="text-gray-300 text-sm">
            Powered by <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="text-[#4988C4] hover:underline">OpenStreetMap</a> • Stay alert and help those in need
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewMap;

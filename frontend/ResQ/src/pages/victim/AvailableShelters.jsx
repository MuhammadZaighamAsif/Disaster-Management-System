import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faPhone, faMapMarkerAlt, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const AvailableShelters = () => {
  const navigate = useNavigate();
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ city: '', disaster: '' });
  const [disasters, setDisasters] = useState([]);

  useEffect(() => {
    fetchShelters();
    fetchDisasters();
  }, []);

  const fetchShelters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/shelters', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setShelters(result.data || result);
      }
    } catch (error) {
      console.error('Error fetching shelters:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDisasters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setDisasters(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const filteredShelters = shelters.filter(shelter => {
    if (filter.city && !shelter.address.toLowerCase().includes(filter.city.toLowerCase())) {
      return false;
    }
    if (filter.disaster && shelter.disaster?._id !== filter.disaster) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-gray-400">Loading shelters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {/* Back Button */}
              <button
                onClick={() => navigate('/victim/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Available Shelters</h1>
              <p className="text-gray-300 text-lg">Find safe places to stay in your area</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8 border border-[#4988C4]/30">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-white">🔍 Filter Shelters</h3>
            <div className="text-sm text-gray-400">
              <span className="font-bold text-[#4988C4]">{filteredShelters.length}</span> shelter{filteredShelters.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                City
              </label>
              <input
                type="text"
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                placeholder="Enter city name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Disaster
              </label>
              <select
                value={filter.disaster}
                onChange={(e) => setFilter({ ...filter, disaster: e.target.value })}
                className="w-full px-4 py-3 pr-10 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white transition"
              >
                <option value="">All Disasters</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.location}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Shelters Grid */}
        {filteredShelters.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center border border-[#4988C4]/30">
            <p className="text-gray-300 text-lg">No shelters available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredShelters.map((shelter) => (
              <div key={shelter._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#629FAD]/30 hover:border-[#629FAD] transition duration-300">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-bold text-white">{shelter.shelterName}</h3>
                  <span className="bg-[#629FAD]/20 text-[#629FAD] px-4 py-2 rounded-full text-sm font-bold border border-[#629FAD]/30">
                    🛏️ {shelter.bedsAvailable} beds
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">Address</p>
                    <p className="text-white font-medium">{shelter.address}, {shelter.city}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-sm font-semibold">📞 Contact</p>
                    <p className="text-white font-medium">{shelter.contactPhone}</p>
                  </div>

                  {shelter.disaster?.name && (
                    <div>
                      <p className="text-gray-400 text-sm font-semibold">For Disaster</p>
                      <p className="text-white font-medium">{shelter.disaster.name}</p>
                    </div>
                  )}

                  {shelter.additionalInfo && (
                    <div>
                      <p className="text-gray-400 text-sm font-semibold">ℹ️ Additional Information</p>
                      <p className="text-gray-300 text-sm">{shelter.additionalInfo}</p>
                    </div>
                  )}

                  {shelter.donor?.name && (
                    <div>
                      <p className="text-gray-400 text-sm font-semibold">Provided by</p>
                      <p className="text-gray-300 text-sm">{shelter.donor.name}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#3a6fa0] transition text-center font-bold uppercase tracking-wide"
                  >
                    <FontAwesomeIcon icon={faPhone} className="mr-2" />
                    Call Now
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#5A7863] text-white py-3 rounded-lg hover:bg-[#4a6853] transition text-center font-bold uppercase tracking-wide"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" />
                    View Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 border border-[#629FAD]/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-[#629FAD] mr-3" />
            Need Help?
          </h3>
          <p className="text-gray-300 mb-3">
            If you need immediate shelter assistance, please contact the shelter directly using the phone number provided.
          </p>
          <p className="text-gray-300">
            For emergencies, call our helpline: <strong className="text-[#4988C4]">042-37501-442</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableShelters;

import { useState, useEffect } from 'react';

const AvailableShelters = () => {
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading shelters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Available Shelters</h1>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Filter Shelters</h3>
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-blue-600">{filteredShelters.length}</span> shelter{filteredShelters.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter city name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disaster
              </label>
              <select
                value={filter.disaster}
                onChange={(e) => setFilter({ ...filter, disaster: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No shelters available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredShelters.map((shelter) => (
              <div key={shelter._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{shelter.shelterName}</h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {shelter.bedsAvailable} beds
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Address</p>
                    <p className="text-gray-800 font-medium">{shelter.address}, {shelter.city}</p>
                  </div>

                  <div>
                    <p className="text-gray-600 text-sm">Contact</p>
                    <p className="text-gray-800 font-medium">{shelter.contactPhone}</p>
                  </div>

                  {shelter.disaster?.name && (
                    <div>
                      <p className="text-gray-600 text-sm">For Disaster</p>
                      <p className="text-gray-800 font-medium">{shelter.disaster.name}</p>
                    </div>
                  )}

                  {shelter.additionalInfo && (
                    <div>
                      <p className="text-gray-600 text-sm">Additional Information</p>
                      <p className="text-gray-700 text-sm">{shelter.additionalInfo}</p>
                    </div>
                  )}

                  {shelter.donor?.name && (
                    <div>
                      <p className="text-gray-600 text-sm">Provided by</p>
                      <p className="text-gray-700 text-sm">{shelter.donor.name}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Call Now
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-center"
                  >
                    View Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Need Help?</h3>
          <p className="text-blue-800 mb-2">
            If you need immediate shelter assistance, please contact the shelter directly using the phone number provided.
          </p>
          <p className="text-blue-800">
            For emergencies, call our helpline: <strong>051-XXXX-XXX</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableShelters;

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
      <div className="min-h-screen bg-linear-to-br from-[#EBF4DD] to-[#F5F7F3] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374]">Loading shelters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#EBF4DD] to-[#F5F7F3] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#0F2854] mb-2">Available Shelters</h1>
          <p className="text-[#296374]">Find safe places to stay in your area</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border-l-4 border-[#4988C4]">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-lg font-bold text-[#0F2854]">🔍 Filter Shelters</h3>
            <div className="text-sm text-[#296374]">
              <span className="font-bold text-[#4988C4]">{filteredShelters.length}</span> shelter{filteredShelters.length !== 1 ? 's' : ''} available
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                City
              </label>
              <input
                type="text"
                value={filter.city}
                onChange={(e) => setFilter({ ...filter, city: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                placeholder="Enter city name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Disaster
              </label>
              <select
                value={filter.disaster}
                onChange={(e) => setFilter({ ...filter, disaster: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
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
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-[#296374] text-lg">No shelters available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredShelters.map((shelter) => (
              <div key={shelter._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition border-l-4 border-[#629FAD]">
                <div className="flex justify-between items-start mb-5">
                  <h3 className="text-2xl font-bold text-[#0F2854]">{shelter.shelterName}</h3>
                  <span className="bg-[#EBF4DD] text-[#0F2854] px-4 py-2 rounded-full text-sm font-bold border-2 border-[#4988C4]">
                    🛏️ {shelter.bedsAvailable} beds
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-[#296374] text-sm font-semibold">Address</p>
                    <p className="text-[#0F2854] font-medium">{shelter.address}, {shelter.city}</p>
                  </div>

                  <div>
                    <p className="text-[#296374] text-sm font-semibold">📞 Contact</p>
                    <p className="text-[#0F2854] font-medium">{shelter.contactPhone}</p>
                  </div>

                  {shelter.disaster?.name && (
                    <div>
                      <p className="text-[#296374] text-sm font-semibold">For Disaster</p>
                      <p className="text-[#0F2854] font-medium">{shelter.disaster.name}</p>
                    </div>
                  )}

                  {shelter.additionalInfo && (
                    <div>
                      <p className="text-[#296374] text-sm font-semibold">ℹ️ Additional Information</p>
                      <p className="text-[#296374] text-sm">{shelter.additionalInfo}</p>
                    </div>
                  )}

                  {shelter.donor?.name && (
                    <div>
                      <p className="text-[#296374] text-sm font-semibold">Provided by</p>
                      <p className="text-[#296374] text-sm">{shelter.donor.name}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <a
                    href={`tel:${shelter.contactPhone}`}
                    className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#629FAD] transition text-center font-bold uppercase tracking-wide"
                  >
                    ☎️ Call Now
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#5A7863] text-white py-3 rounded-lg hover:bg-[#296374] transition text-center font-bold uppercase tracking-wide"
                  >
                    🗺️ View Map
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Section */}
        <div className="bg-[#EBF4DD] border-l-4 border-[#629FAD] rounded-2xl p-8">
          <h3 className="text-xl font-bold text-[#0F2854] mb-4">Need Help?</h3>
          <p className="text-[#296374] mb-3">
            If you need immediate shelter assistance, please contact the shelter directly using the phone number provided.
          </p>
          <p className="text-[#296374]">
            For emergencies, call our helpline: <strong className="text-[#0F2854]">051-XXXX-XXX</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AvailableShelters;

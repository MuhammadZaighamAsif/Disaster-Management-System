import { useState, useEffect } from 'react';

const ManageDisasters = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setDisasters(result.data || []);
      } else {
        setError(result.message || 'Failed to load disasters');
      }
    } catch (error) {
      setError('Failed to load disasters');
      console.error('Error fetching disasters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this disaster? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/disasters/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        alert('Disaster removed successfully!');
        fetchDisasters(); // Refresh the list
      } else {
        alert(result.message || 'Failed to remove disaster');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      console.error('Error removing disaster:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Manage Disasters</h1>
            <p className="text-[#BDE8F5]">View and remove active disasters</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading disasters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Manage Disasters</h1>
          <p className="text-[#BDE8F5]">View and remove active disaster entries</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {disasters.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <p className="text-[#296374] text-2xl font-semibold">✅ No active disasters found.</p>
            <p className="text-[#5A7863] mt-2">All situations are managed or resolved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {disasters.map((disaster) => (
              <div key={disaster._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-[#0F2854] mb-1">{disaster.name}</h3>
                      <p className="text-[#5A7863]">Disaster ID: {disaster._id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-bold text-white whitespace-nowrap ml-4 ${
                      disaster.severity === 'CRITICAL' ? 'bg-red-600' :
                      disaster.severity === 'HIGH' ? 'bg-orange-500' :
                      disaster.severity === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {disaster.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Location</p>
                      <p className="text-[#0F2854] font-bold">{disaster.location}, {disaster.city}</p>
                      <p className="text-[#296374] text-sm">Area: {disaster.areaCode}</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Status</p>
                      <p className="text-[#0F2854] font-bold">{disaster.status}</p>
                      <p className="text-[#296374] text-sm">Active & Managed</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#629FAD]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Severity</p>
                      <p className="text-[#0F2854] font-bold">{disaster.severity}</p>
                      <p className="text-[#296374] text-sm">Priority Level</p>
                    </div>
                  </div>

                  <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#90AB8B]">
                    <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Description</p>
                    <p className="text-[#3B4953]">{disaster.description}</p>
                  </div>

                  {disaster.requiredResources && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#5A7863]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">🛠️ Required Resources</p>
                      <p className="text-[#3B4953]">{disaster.requiredResources}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#EDEDCE]">
                    <button
                      onClick={() => handleRemove(disaster._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      🗑️ Remove Disaster
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDisasters;

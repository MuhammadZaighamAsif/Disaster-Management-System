import { useState, useEffect } from 'react';

const VerifyDisasters = () => {
  const [pendingIncidents, setPendingIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingIncidents();
  }, []);

  const fetchPendingIncidents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disasters?status=PENDING', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setPendingIncidents(result.data || []);
      } else {
        setError(result.message || 'Failed to load disasters');
      }
    } catch (error) {
      setError('Failed to load pending incidents');
      console.error('Error fetching pending incidents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/disasters/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        alert('Disaster verified and added to the system!');
        fetchPendingIncidents(); // Refresh the list
      } else {
        alert(result.message || 'Failed to verify disaster');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      console.error('Error verifying disaster:', error);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm('Are you sure you want to reject this incident report?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/disasters/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      if (response.ok) {
        alert('Incident report rejected.');
        fetchPendingIncidents(); // Refresh the list
      } else {
        alert(result.message || 'Failed to reject incident');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      console.error('Error rejecting incident:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Verify Disasters</h1>
            <p className="text-[#BDE8F5]">Review and approve pending disaster reports</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading pending incidents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Verify Disasters</h1>
          <p className="text-[#BDE8F5]">Review and approve pending disaster reports for the system</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {pendingIncidents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <p className="text-[#296374] text-2xl font-semibold">✅ No pending incidents to verify.</p>
            <p className="text-[#5A7863] mt-2">All disaster reports have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingIncidents.map((incident) => (
              <div key={incident._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">Pending</span>
                        <span className="text-[#5A7863] text-sm font-semibold">Reported by: {incident.reportedBy?.name || 'System'}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#0F2854]">{incident.name}</h3>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-bold text-white whitespace-nowrap ml-4 ${
                      incident.severity === 'CRITICAL' ? 'bg-red-600' :
                      incident.severity === 'HIGH' ? 'bg-orange-500' :
                      incident.severity === 'MEDIUM' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Location</p>
                      <p className="text-[#0F2854] font-bold">{incident.location}, {incident.city}</p>
                      <p className="text-[#296374] text-sm">Area: {incident.areaCode}</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Type</p>
                      <p className="text-[#0F2854] font-bold">{incident.type}</p>
                      <p className="text-[#296374] text-sm">Disaster Category</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#629FAD]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">👥 Reported</p>
                      <p className="text-[#0F2854] font-bold">{incident.reportedBy?.name || 'Anonymous'}</p>
                      <p className="text-[#296374] text-sm">Date: {new Date(incident.occurredAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#90AB8B]">
                    <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Description</p>
                    <p className="text-[#3B4953]">{incident.description}</p>
                  </div>

                  {incident.requiredResources && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#5A7863]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">🛠️ Required Resources</p>
                      <p className="text-[#3B4953]">{incident.requiredResources}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#EDEDCE]">
                    <button
                      onClick={() => handleVerify(incident._id)}
                      className="flex-1 bg-[#90AB8B] hover:bg-[#5A7863] text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      ✅ Approve Disaster
                    </button>
                    <button
                      onClick={() => handleReject(incident._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      Reject
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

export default VerifyDisasters;

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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading pending incidents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Verify Disaster Reports</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {pendingIncidents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No pending incidents to verify.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingIncidents.map((incident) => (
              <div key={incident._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Pending Verification
                  </span>
                  <span className="ml-3 text-gray-500 text-sm">
                    Reported by: {incident.reportedBy?.name || 'Unknown'}
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-4">{incident.name}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>Location:</strong> {incident.location}
                    </p>
                    <p className="text-gray-600">
                      <strong>City:</strong> {incident.city}
                    </p>
                    <p className="text-gray-600">
                      <strong>Area Code:</strong> {incident.areaCode}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Severity:</strong>{' '}
                      <span className={`font-semibold ${
                        incident.severity === 'CRITICAL' ? 'text-red-600' :
                        incident.severity === 'HIGH' ? 'text-orange-600' :
                        incident.severity === 'MEDIUM' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {incident.severity}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      <strong>Occurred:</strong> {new Date(incident.occurredAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Reported:</strong> {new Date(incident.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700">
                    <strong>Description:</strong>
                  </p>
                  <p className="text-gray-600 mt-2">{incident.description}</p>
                </div>

                {incident.requiredResources && (
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <strong>Required Resources:</strong>
                    </p>
                    <p className="text-gray-600 mt-2">{incident.requiredResources}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleVerify(incident._id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    ✓ Verify & Approve
                  </button>
                  <button
                    onClick={() => handleReject(incident._id)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
                  >
                    ✗ Reject
                  </button>
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

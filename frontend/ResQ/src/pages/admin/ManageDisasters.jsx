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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading disasters...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Manage Disasters</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {disasters.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No disasters found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {disasters.map((disaster) => (
              <div key={disaster._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{disaster.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-gray-600">
                          <strong>Location:</strong> {disaster.location}
                        </p>
                        <p className="text-gray-600">
                          <strong>City:</strong> {disaster.city}
                        </p>
                        <p className="text-gray-600">
                          <strong>Area Code:</strong> {disaster.areaCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <strong>Severity:</strong>{' '}
                          <span className={`font-semibold ${
                            disaster.severity === 'CRITICAL' ? 'text-red-600' :
                            disaster.severity === 'HIGH' ? 'text-orange-600' :
                            disaster.severity === 'MEDIUM' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {disaster.severity}
                          </span>
                        </p>
                        <p className="text-gray-600">
                          <strong>Status:</strong> {disaster.status}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">
                      <strong>Description:</strong> {disaster.description}
                    </p>
                    {disaster.requiredResources && (
                      <p className="text-gray-700">
                        <strong>Required Resources:</strong> {disaster.requiredResources}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(disaster._id)}
                    className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    Remove
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

export default ManageDisasters;

import { useState, useEffect } from 'react';

const ViewVolunteers = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setVolunteers(result.data || []);
      } else {
        setError('Failed to load volunteers');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading volunteers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">View Volunteers</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {volunteers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No Volunteers Found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {volunteers.map((volunteer) => (
              <div key={volunteer._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">{volunteer.name}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">
                          <strong>Email:</strong> {volunteer.email}
                        </p>
                        <p className="text-gray-600">
                          <strong>Phone:</strong> {volunteer.phone}
                        </p>
                        <p className="text-gray-600">
                          <strong>Status:</strong>{' '}
                          <span className={`font-semibold ${
                            volunteer.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {volunteer.status || 'Pending'}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">
                          <strong>Role:</strong> {volunteer.role || 'Not set'}
                        </p>
                        <p className="text-gray-600">
                          <strong>Task Type:</strong> {volunteer.taskType || 'None'}
                        </p>
                        <p className="text-gray-600">
                          <strong>Assigned Tasks:</strong> {volunteer.assignedTasks || 0}
                        </p>
                      </div>
                    </div>
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

export default ViewVolunteers;

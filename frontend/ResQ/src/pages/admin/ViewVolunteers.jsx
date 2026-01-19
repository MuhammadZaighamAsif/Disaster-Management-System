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
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">View Volunteers</h1>
            <p className="text-[#BDE8F5]">See all registered volunteers</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading volunteers...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">View Volunteers</h1>
          <p className="text-[#BDE8F5]">Manage and view all registered volunteers</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {volunteers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <p className="text-[#296374] text-2xl font-semibold">😊 No Volunteers Found</p>
            <p className="text-[#5A7863] mt-2">Volunteers will appear here once they register.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {volunteers.map((volunteer) => (
              <div key={volunteer._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-[#0F2854] mb-2">{volunteer.name}</h3>
                      <div className="flex gap-4 items-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          volunteer.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                        }`}>
                          {volunteer.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                        <span className="text-[#5A7863] text-sm font-semibold">Role: {volunteer.role || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">📧 Contact Information</p>
                      <p className="text-[#0F2854] font-bold mb-2">{volunteer.email}</p>
                      <p className="text-[#296374] text-sm">Phone: {volunteer.phone}</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Assignment</p>
                      <p className="text-[#0F2854] font-bold mb-2">{volunteer.taskType || 'None'}</p>
                      <p className="text-[#296374] text-sm">Tasks: {volunteer.assignedTasks || 0}</p>
                    </div>
                  </div>

                  <div className="bg-[#F5F5F5] rounded-lg p-4 border-l-2 border-[#629FAD]">
                    <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Status Summary</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-[#296374] text-xs uppercase font-semibold">Status</p>
                        <p className="text-[#0F2854] font-bold">{volunteer.status || 'Pending'}</p>
                      </div>
                      <div>
                        <p className="text-[#296374] text-xs uppercase font-semibold">Tasks Assigned</p>
                        <p className="text-[#0F2854] font-bold">{volunteer.assignedTasks || 0}</p>
                      </div>
                      <div>
                        <p className="text-[#296374] text-xs uppercase font-semibold">Role</p>
                        <p className="text-[#0F2854] font-bold">{volunteer.role || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[#296374] text-xs uppercase font-semibold">ID</p>
                        <p className="text-[#0F2854] font-bold text-xs">{volunteer._id.substring(0, 6)}</p>
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

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faEnvelope, faPhone, faBriefcase, faClipboardList, faCircleCheck, faClock, faExclamationTriangle, faIdCard, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ViewVolunteers = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4">
          {/* Header Card */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#629FAD]/30 shadow-lg">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Admin Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">View Volunteers</h1>
                <p className="text-gray-300 text-lg">See all registered volunteers</p>
              </div>
              <div className="text-7xl text-[#629FAD]/30">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading volunteers...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#629FAD]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">View Volunteers</h1>
              <p className="text-gray-300 text-lg">Manage and view all registered volunteers</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faUsers} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {volunteers.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#629FAD]/30 shadow-lg">
            <p className="text-white text-2xl font-semibold">😊 No Volunteers Found</p>
            <p className="text-gray-400 mt-2">Volunteers will appear here once they register.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {volunteers.map((volunteer) => (
              <div key={volunteer._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 hover:border-[#629FAD] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#629FAD]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{volunteer.name}</h3>
                      <div className="flex gap-4 items-center">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${volunteer.status === 'active'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                          <FontAwesomeIcon icon={volunteer.status === 'active' ? faCircleCheck : faClock} />
                          {volunteer.status === 'active' ? 'Active' : 'Pending'}
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">Role: {volunteer.role || 'Not Set'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#5A7863]" />
                        Contact Information
                      </p>
                      <p className="text-white font-bold text-xl mb-1">{volunteer.email}</p>
                      <p className="text-gray-400 text-xl flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-[#629FAD]" />
                        {volunteer.phone}
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-xl font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBriefcase} className="text-[#4988C4]" />
                        Assignment
                      </p>
                      <p className="text-white font-bold mb-1">{volunteer.taskType || 'None'}</p>
                      <p className="text-gray-400 text-xl flex items-center gap-2">
                        <FontAwesomeIcon icon={faClipboardList} className="text-[#90AB8B]" />
                        Tasks: {volunteer.assignedTasks || 0}
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#629FAD]/20">
                    <p className="text-gray-400 text-xl font-semibold uppercase tracking-wider mb-3">Status Summary</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-gray-500 text-xl uppercase font-semibold mb-1">Status</p>
                        <p className="text-white font-bold">{volunteer.status || 'Pending'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xl uppercase font-semibold mb-1">Tasks Assigned</p>
                        <p className="text-white text-xl font-bold">{volunteer.assignedTasks || 0}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xl uppercase font-semibold mb-1">Role</p>
                        <p className="text-white font-bold">{volunteer.role || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xl uppercase font-semibold mb-1 flex items-center gap-1">
                          <FontAwesomeIcon icon={faIdCard} className="text-[#BDE8F5]" />
                          ID
                        </p>
                        <p className="text-white font-bold text-xl">{volunteer._id.substring(0, 6)}</p>
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

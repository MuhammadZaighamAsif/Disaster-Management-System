import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faTrash, faLocationDot, faShieldHalved, faExclamationTriangle, faFileAlt, faTools, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ManageDisasters = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4">
          {/* Header Card */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#90AB8B]/30 shadow-lg">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Admin Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Manage Disasters</h1>
                <p className="text-gray-300 text-lg">View and remove active disasters</p>
              </div>
              <div className="text-7xl text-[#90AB8B]/30">
                <FontAwesomeIcon icon={faTrashCan} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading disasters...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#90AB8B]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Manage Disasters</h1>
              <p className="text-gray-300 text-lg">View and remove active disaster entries</p>
            </div>
            <div className="text-7xl text-[#90AB8B]/30">
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {disasters.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#5A7863]/30 shadow-lg">
            <p className="text-white text-2xl font-semibold">✅ No active disasters found.</p>
            <p className="text-gray-400 mt-2">All situations are managed or resolved.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {disasters.map((disaster) => (
              <div key={disaster._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-1">{disaster.name}</h3>
                      <p className="text-gray-400 text-sm">Disaster ID: {disaster._id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-bold text-white whitespace-nowrap ml-4 ${
                      disaster.severity === 'CRITICAL' ? 'bg-red-600/80' :
                      disaster.severity === 'HIGH' ? 'bg-orange-500/80' :
                      disaster.severity === 'MEDIUM' ? 'bg-yellow-500/80' :
                      'bg-green-500/80'
                    }`}>
                      {disaster.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#5A7863]" />
                        Location
                      </p>
                      <p className="text-white font-bold">{disaster.location}, {disaster.city}</p>
                      <p className="text-gray-400 text-sm">Area: {disaster.areaCode}</p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faShieldHalved} className="text-[#4988C4]" />
                        Status
                      </p>
                      <p className="text-white font-bold">{disaster.status}</p>
                      <p className="text-gray-400 text-sm">Active & Managed</p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#629FAD]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-[#629FAD]" />
                        Severity
                      </p>
                      <p className="text-white font-bold">{disaster.severity}</p>
                      <p className="text-gray-400 text-sm">Priority Level</p>
                    </div>
                  </div>

                  <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-4 border border-[#4988C4]/20">
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-[#90AB8B]" />
                      Description
                    </p>
                    <p className="text-gray-300">{disaster.description}</p>
                  </div>

                  {disaster.requiredResources && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-6 border border-[#5A7863]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faTools} className="text-[#5A7863]" />
                        Required Resources
                      </p>
                      <p className="text-gray-300">{disaster.requiredResources}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#4988C4]/20">
                    <button
                      onClick={() => handleRemove(disaster._id)}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      Remove Disaster
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

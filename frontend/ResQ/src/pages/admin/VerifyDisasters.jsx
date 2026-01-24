import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faCheck, faTimes, faLocationDot, faLayerGroup, faUser, faFileAlt, faTools, faExclamationTriangle, faClock, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VerifyDisasters = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4">
          {/* Header Card */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Admin Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Verify Disasters</h1>
                <p className="text-gray-300 text-lg">Review and approve pending disaster reports</p>
              </div>
              <div className="text-7xl text-[#4988C4]/30">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading pending incidents...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Verify Disasters</h1>
              <p className="text-gray-300 text-lg">Review and approve pending disaster reports for the system</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faClipboardCheck} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {pendingIncidents.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#5A7863]/30 shadow-lg">
            <p className="text-white text-2xl font-semibold">✅ No pending incidents to verify.</p>
            <p className="text-gray-400 mt-2">All disaster reports have been reviewed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingIncidents.map((incident) => (
              <div key={incident._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/30 flex items-center gap-2">
                          <FontAwesomeIcon icon={faClock} />
                          Pending
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">Reported by: {incident.reportedBy?.name || 'System'}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white">{incident.name}</h3>
                    </div>
                    <span className={`px-4 py-2 rounded-lg font-bold text-white whitespace-nowrap ml-4 ${
                      incident.severity === 'CRITICAL' ? 'bg-red-600/80' :
                      incident.severity === 'HIGH' ? 'bg-orange-500/80' :
                      incident.severity === 'MEDIUM' ? 'bg-yellow-500/80' :
                      'bg-green-500/80'
                    }`}>
                      {incident.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLocationDot} className="text-[#5A7863]" />
                        Location
                      </p>
                      <p className="text-white font-bold">{incident.location}, {incident.city}</p>
                      <p className="text-gray-400 text-sm">Area: {incident.areaCode}</p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faLayerGroup} className="text-[#4988C4]" />
                        Type
                      </p>
                      <p className="text-white font-bold">{incident.type}</p>
                      <p className="text-gray-400 text-sm">Disaster Category</p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#629FAD]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#629FAD]" />
                        Reported
                      </p>
                      <p className="text-white font-bold">{incident.reportedBy?.name || 'Anonymous'}</p>
                      <p className="text-gray-400 text-sm">Date: {new Date(incident.occurredAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-4 border border-[#4988C4]/20">
                    <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileAlt} className="text-[#90AB8B]" />
                      Description
                    </p>
                    <p className="text-gray-300">{incident.description}</p>
                  </div>

                  {incident.requiredResources && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-6 border border-[#5A7863]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faTools} className="text-[#5A7863]" />
                        Required Resources
                      </p>
                      <p className="text-gray-300">{incident.requiredResources}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#4988C4]/20">
                    <button
                      onClick={() => handleVerify(incident._id)}
                      className="flex-1 bg-[#5A7863]/20 hover:bg-[#5A7863]/40 text-[#90AB8B] hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-[#5A7863]/30 hover:border-[#5A7863]/50 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Approve Disaster
                    </button>
                    <button
                      onClick={() => handleReject(incident._id)}
                      className="flex-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-red-300 font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faTimes} />
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

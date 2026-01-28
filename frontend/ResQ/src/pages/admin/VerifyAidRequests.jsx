import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faUtensils, faTshirt, faHome, faMedkit, faBox, faCheck, faTimes, faUser, faEnvelope, faPhone, faPeopleGroup, faFileAlt, faClock, faExclamationTriangle, faTriangleExclamation, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VerifyAidRequests = () => {
  const navigate = useNavigate();
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/aid-requests/pending`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setPendingRequests(result.data || []);
      } else {
        setError('Failed to load aid requests');
      }
    } catch (error) {
      setError('Failed to load aid requests');
      console.error('Error fetching aid requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/aid-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert('Aid request approved successfully!');
        fetchPendingRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to approve aid request');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this aid request?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/aid-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        alert('Aid request rejected');
        fetchPendingRequests();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to reject aid request');
      }
    } catch (error) {
      alert('Connection error. Please try again.');
      console.error('Error rejecting request:', error);
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
                <h1 className="text-3xl font-bold mb-2 text-white">Verify Aid Requests</h1>
                <p className="text-gray-300 text-lg">Review and approve pending aid requests from victims</p>
              </div>
              <div className="text-7xl text-[#629FAD]/30">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading aid requests...</div>
          </div>
        </div>
      </div>
    );
  }

  const getAidTypeIcon = (aidType) => {
    switch (aidType?.toUpperCase()) {
      case 'FOOD': return faUtensils;
      case 'CLOTHES': return faTshirt;
      case 'SHELTER': return faHome;
      case 'MEDICAL': return faMedkit;
      default: return faBox;
    }
  };

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
              <h1 className="text-3xl font-bold mb-2 text-white">Verify Aid Requests</h1>
              <p className="text-gray-300 text-lg">Review and approve pending aid requests from victims</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#629FAD]/30 shadow-lg">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#5A7863]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-[#5A7863]">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
              <p className="text-gray-400 text-lg">No pending aid requests to verify at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.map((request) => (
              <div key={request._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 hover:border-[#629FAD] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#629FAD]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-start">
                        <div className="text-5xl text-[#629FAD]/50">
                          <FontAwesomeIcon icon={getAidTypeIcon(request.aidType)} />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">{request.victim?.name || 'Victim'}</h3>
                          <span className={`px-4 py-2 rounded-full text-sm font-bold mt-2 inline-flex items-center gap-2 ${
                            request.exceedsLimit 
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' 
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            <FontAwesomeIcon icon={request.exceedsLimit ? faTriangleExclamation : faClock} />
                            {request.exceedsLimit ? 'Exceeds Limit' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-500 text-sm"># {request._id.substring(0, 8)}</p>
                      <p className="text-gray-500 text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faHandHoldingHeart} className="text-[#5A7863]" />
                        Request Details
                      </p>
                      <p className="text-white font-bold mb-2">{request.aidType?.toUpperCase()} Aid</p>
                      <p className="text-gray-400 text-sm">Amount: <span className="font-bold text-white">{request.amount}</span></p>
                      <p className="text-gray-400 text-sm">System Limit: {request.systemLimit || 'N/A'}</p>
                      {request.exceedsLimit && (
                        <p className="text-orange-400 font-bold text-sm mt-1">Exceeds by: {Math.max(0, request.amount - request.systemLimit)}</p>
                      )}
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#4988C4]" />
                        Victim Info
                      </p>
                      <p className="text-white font-bold mb-2">{request.victim?.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#629FAD]" />
                        {request.victim?.email || '—'}
                      </p>
                      <p className="text-gray-400 text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faPhone} className="text-[#90AB8B]" />
                        {request.victim?.phone || request.contactPhone || '—'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#629FAD]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faPeopleGroup} className="text-[#629FAD]" />
                        Family & Disaster
                      </p>
                      <p className="text-white font-bold">Family Size: {request.familySize}</p>
                      {request.disaster && (
                        <p className="text-gray-400 text-sm">Disaster: {request.disaster?.name}</p>
                      )}
                    </div>

                    {request.description && (
                      <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/20">
                        <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                          <FontAwesomeIcon icon={faFileAlt} className="text-[#5A7863]" />
                          Description
                        </p>
                        <p className="text-gray-300">{request.description.substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-[#4988C4]/20">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="flex-1 bg-[#5A7863]/20 hover:bg-[#5A7863]/40 text-[#90AB8B] hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-[#5A7863]/30 hover:border-[#5A7863]/50 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Approve Request
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
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

export default VerifyAidRequests;

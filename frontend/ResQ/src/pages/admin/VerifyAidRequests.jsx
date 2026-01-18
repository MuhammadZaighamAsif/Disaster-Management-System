import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faTshirt, faHome, faMedkit, faBox } from '@fortawesome/free-solid-svg-icons';

const VerifyAidRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/aid-requests/pending', {
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
      const response = await fetch(`http://localhost:5000/api/aid-requests/${requestId}/approve`, {
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
      const response = await fetch(`http://localhost:5000/api/aid-requests/${requestId}/reject`, {
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
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-700">Loading aid requests...</p>
          </div>
        </div>
      </div>
    );
  }

  const getAidTypeIcon = (type) => {
    // aidType is uppercase in the API (FOOD, CLOTHES, SHELTER, MEDICAL)
    switch ((type || '').toUpperCase()) {
      case 'FOOD':
        return faUtensils;
      case 'CLOTHES':
        return faTshirt;
      case 'SHELTER':
        return faHome;
      case 'MEDICAL':
        return faMedkit;
      default:
        return faBox;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Verify Aid Requests</h1>
          <p className="text-gray-600">Review and approve pending aid requests from victims</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-r-lg mb-6 shadow-md">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-linear-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">All Caught Up!</h3>
              <p className="text-gray-600 text-lg">No pending aid requests to verify at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="flex items-start gap-6 p-6">
                  <div className="shrink-0">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <FontAwesomeIcon icon={getAidTypeIcon(request.aidType)} className="text-2xl text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">{request.victim?.name || 'Victim'}</h3>
                        <span className={`${request.exceedsLimit ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'} px-3 py-1 rounded-full text-sm font-semibold mt-2 inline-block`}>
                          {request.exceedsLimit ? 'Exceeds Limit - Pending' : 'Pending'}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">
                          <strong>Request ID:</strong> #{request._id}
                        </p>
                        <p className="text-gray-600">
                          <strong>Date:</strong> {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>Aid Type:</strong> {request.aidType.toUpperCase()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Amount/Quantity:</strong> {request.amount}
                    </p>
                    <p className="text-gray-600">
                      <strong>System Limit:</strong> {request.systemLimit}
                    </p>
                    <p className="text-gray-600">
                      <strong>Exceeds by:</strong>{' '}
                      <span className="text-red-600 font-bold">
                        {request.systemLimit ? Math.max(0, request.amount - request.systemLimit) : '—'}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Victim Email:</strong> {request.victim?.email || '—'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Phone:</strong> {request.victim?.phone || request.contactPhone || '—'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Family Size:</strong> {request.familySize}
                    </p>
                    {request.disaster && (
                      <p className="text-gray-600">
                        <strong>Disaster:</strong> {request.disaster?.name} ({request.disaster?.type})
                      </p>
                    )}
                  </div>
                </div>

                {request.description && (
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <strong>Description:</strong>
                    </p>
                    <p className="text-gray-600 mt-2">{request.description}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
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

export default VerifyAidRequests;

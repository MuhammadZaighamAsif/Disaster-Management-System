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
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Verify Aid Requests</h1>
            <p className="text-[#BDE8F5]">Review and approve pending aid requests from victims</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading aid requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Verify Aid Requests</h1>
          <p className="text-[#BDE8F5]">Review and approve pending aid requests from victims</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {pendingRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#EBF4DD] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                ✅
              </div>
              <h3 className="text-2xl font-bold text-[#0F2854] mb-2">All Caught Up!</h3>
              <p className="text-[#296374] text-lg">No pending aid requests to verify at the moment.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-start">
                        <div className="text-5xl">
                          {request.aidType?.toUpperCase() === 'FOOD' ? '' :
                           request.aidType?.toUpperCase() === 'CLOTHES' ? '👕' :
                           request.aidType?.toUpperCase() === 'SHELTER' ? '' :
                           request.aidType?.toUpperCase() === 'MEDICAL' ? '' : ''}
                        </div>
                        <div>
                          <h3 className="text-3xl font-bold text-[#0F2854]">{request.victim?.name || 'Victim'}</h3>
                          <span className={`${request.exceedsLimit ? 'bg-orange-200 text-orange-800' : 'bg-yellow-200 text-yellow-800'} px-4 py-2 rounded-full text-sm font-bold mt-2 inline-block`}>
                            {request.exceedsLimit ? 'Exceeds Limit' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[#5A7863] text-sm"># {request._id.substring(0, 8)}</p>
                      <p className="text-[#5A7863] text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Request Details</p>
                      <p className="text-[#0F2854] font-bold mb-2">{request.aidType?.toUpperCase()} Aid</p>
                      <p className="text-[#296374] text-sm">Amount: <span className="font-bold">{request.amount}</span></p>
                      <p className="text-[#296374] text-sm">System Limit: {request.systemLimit || 'N/A'}</p>
                      {request.exceedsLimit && (
                        <p className="text-red-600 font-bold text-sm mt-1">Exceeds by: {Math.max(0, request.amount - request.systemLimit)}</p>
                      )}
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Victim Info</p>
                      <p className="text-[#0F2854] font-bold mb-2">{request.victim?.name || 'Unknown'}</p>
                      <p className="text-[#296374] text-sm">Email: {request.victim?.email || '—'}</p>
                      <p className="text-[#296374] text-sm">Phone: {request.victim?.phone || request.contactPhone || '—'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#F5F5F5] rounded-lg p-4 border-l-2 border-[#629FAD]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">👨‍👩‍👧‍👦 Family & Disaster</p>
                      <p className="text-[#0F2854] font-bold">Family Size: {request.familySize}</p>
                      {request.disaster && (
                        <p className="text-[#296374] text-sm">Disaster: {request.disaster?.name}</p>
                      )}
                    </div>

                    {request.description && (
                      <div className="bg-[#F5F5F5] rounded-lg p-4 border-l-2 border-[#5A7863]">
                        <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Description</p>
                        <p className="text-[#0F2854]">{request.description.substring(0, 100)}...</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-[#EDEDCE]">
                    <button
                      onClick={() => handleApprove(request._id)}
                      className="flex-1 bg-[#90AB8B] hover:bg-[#5A7863] text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      ✅ Approve Request
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
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

export default VerifyAidRequests;

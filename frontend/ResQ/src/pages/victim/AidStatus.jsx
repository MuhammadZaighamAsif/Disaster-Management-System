import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

const AidStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [aidRequests, setAidRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAidRequests();
  }, []);

  const fetchAidRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/aid-requests/my-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setAidRequests(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching aid requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceipt = async (requestId) => {
    if (!window.confirm('Confirm that you have received this aid?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/aid-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Aid received successfully!');
        fetchAidRequests(); // Refresh the list
      } else {
        alert('Failed to confirm receipt. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming receipt:', error);
      alert('Connection error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-gray-400">Loading aid requests...</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Pending Verification', color: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
      VERIFIED: { label: 'Verified - In Progress', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30' },
      APPROVED: { label: 'Approved - Allocating', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
      ALLOCATED: { label: 'Aid Allocated', color: 'bg-green-500/20 text-green-400 border border-green-500/30' },
      DELIVERED: { label: 'Aid Delivered', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
      RECEIVED: { label: 'Aid Received', color: 'bg-gray-500/20 text-gray-400 border border-gray-500/30' },
      REJECTED: { label: 'Rejected', color: 'bg-red-500/20 text-red-400 border border-red-500/30' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-sm font-semibold`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {/* Back Button */}
              <button
                onClick={() => navigate('/victim/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Aid Request Status</h1>
              <p className="text-gray-300 text-lg">Track all your aid requests in one place</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faClipboardCheck} />
            </div>
          </div>
        </div>

        {aidRequests.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center border border-[#4988C4]/30">
            <p className="text-gray-300 text-lg mb-4">You haven't made any aid requests yet.</p>
            <a
              href="/victim/request-aid"
              className="inline-block bg-[#4988C4] text-white px-6 py-3 rounded-lg hover:bg-[#3a6fa0] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide"
            >
              Request Aid Now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {aidRequests.map((request) => (
              <div key={request._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-[#4988C4]/30 hover:border-[#4988C4] transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-white">
                      {request.aidType.charAt(0).toUpperCase() + request.aidType.slice(1)} Request
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Requested on {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">Amount/Quantity</p>
                    <p className="font-bold text-lg text-white">{request.amount} units</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">Family Size</p>
                    <p className="font-bold text-white">{request.familySize} members</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">Urgency Level</p>
                    <p className={`font-bold ${
                      request.urgency === 'critical' ? 'text-red-400' :
                      request.urgency === 'high' ? 'text-orange-400' :
                      request.urgency === 'medium' ? 'text-yellow-400' :
                      'text-green-400'
                    }`}>
                      {request.urgency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-semibold">Contact</p>
                    <p className="font-bold text-white">{request.contactPhone}</p>
                  </div>
                </div>

                {request.familyDetails && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm font-semibold">Family Details</p>
                    <p className="text-white">
                      Children: {request.childrenCount || 0} | Elders: {request.eldersCount || 0}
                    </p>
                  </div>
                )}

                {request.specialNeeds && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm font-semibold">Special Needs</p>
                    <p className="text-white">{request.specialNeeds}</p>
                  </div>
                )}

                {request.address && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm font-semibold">Address</p>
                    <p className="text-white">{request.address}</p>
                  </div>
                )}

                {/* Status-specific information */}
                {request.status === 'PENDING' && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mt-4">
                    <p className="text-yellow-400 text-sm">
                      ℹ️ Your request is pending admin verification.
                    </p>
                  </div>
                )}

                {request.status === 'VERIFIED' && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                    <p className="text-blue-400 text-sm">
                      Your request has been verified and is being processed. A volunteer will contact you soon.
                    </p>
                  </div>
                )}

                {request.status === 'APPROVED' && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mt-4">
                    <p className="text-green-400 text-sm">
                      Your request has been approved! Aid is being allocated to you.
                    </p>
                  </div>
                )}

                {request.status === 'ALLOCATED' && (
                  <div className="mt-4">
                    <div className="bg-[#0a1628] border border-[#629FAD]/30 rounded-lg p-4 mb-4">
                      <p className="text-white text-sm font-semibold mb-2">
                        Aid has been allocated to you!
                      </p>
                      {request.volunteerName && (
                        <p className="text-gray-300 text-sm">
                          Volunteer: {request.volunteerName} | Contact: {request.volunteerPhone}
                        </p>
                      )}
                      {request.expectedDelivery && (
                        <p className="text-gray-300 text-sm">
                          Expected Delivery: {formatDate(request.expectedDelivery)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleConfirmReceipt(request._id)}
                      className="w-full bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#3a6fa0] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide"
                    >
                      Confirm Receipt of Aid
                    </button>
                  </div>
                )}

                {request.status === 'DELIVERED' && (
                  <div className="bg-[#0a1628] border border-[#4988C4]/30 rounded-lg p-4 mt-4">
                    <p className="text-white text-sm">
                      Aid has been delivered on {formatDate(request.deliveredAt)}
                    </p>
                  </div>
                )}

                {request.status === 'RECEIVED' && (
                  <div className="bg-[#0a1628] border border-[#629FAD]/30 rounded-lg p-4 mt-4">
                    <p className="text-white text-sm">
                      Aid received and confirmed on {formatDate(request.receivedAt)}
                    </p>
                  </div>
                )}

                {request.status === 'REJECTED' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mt-4">
                    <p className="text-red-400 text-sm">
                      ✗ Request rejected. {request.rejectionReason || 'Please contact admin for more information.'}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AidStatus;

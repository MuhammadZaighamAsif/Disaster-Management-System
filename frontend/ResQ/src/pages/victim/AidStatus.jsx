import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, getStatusColor } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const AidStatus = () => {
  const { user } = useAuth();
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
      <div className="min-h-screen bg-linear-to-br from-[#EBF4DD] to-[#F5F7F3] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374]">Loading aid requests...</div>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { label: 'Pending Verification', color: 'bg-yellow-100 text-yellow-800' },
      VERIFIED: { label: 'Verified - In Progress', color: 'bg-blue-100 text-blue-800' },
      APPROVED: { label: 'Approved - Allocating', color: 'bg-green-100 text-green-800' },
      ALLOCATED: { label: 'Aid Allocated', color: 'bg-green-100 text-green-800' },
      DELIVERED: { label: 'Aid Delivered', color: 'bg-gray-100 text-gray-800' },
      RECEIVED: { label: 'Aid Received', color: 'bg-gray-100 text-gray-800' },
      REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800' }
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`${config.color} px-3 py-1 rounded-full text-sm font-semibold`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#EBF4DD] to-[#F5F7F3] py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#0F2854] mb-2">Aid Request Status</h1>
          <p className="text-[#296374]">Track all your aid requests in one place</p>
        </div>

        {aidRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-l-4 border-[#4988C4]">
            <p className="text-[#296374] text-lg mb-4">You haven't made any aid requests yet.</p>
            <a
              href="/victim/request-aid"
              className="inline-block bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide"
            >
              Request Aid Now
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {aidRequests.map((request) => (
              <div key={request._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#4988C4] hover:shadow-2xl transition duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {request.aidType.charAt(0).toUpperCase() + request.aidType.slice(1)} Request
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Requested on {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[#296374] text-sm font-semibold">Amount/Quantity</p>
                    <p className="font-bold text-lg text-[#0F2854]">{request.amount} units</p>
                  </div>
                  <div>
                    <p className="text-[#296374] text-sm font-semibold">Family Size</p>
                    <p className="font-bold text-[#0F2854]">{request.familySize} members</p>
                  </div>
                  <div>
                    <p className="text-[#296374] text-sm font-semibold">Urgency Level</p>
                    <p className={`font-bold ${
                      request.urgency === 'critical' ? 'text-red-600' :
                      request.urgency === 'high' ? 'text-orange-600' :
                      request.urgency === 'medium' ? 'text-[#0F2854]' :
                      'text-green-700'
                    }`}>
                      {request.urgency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[#296374] text-sm font-semibold">Contact</p>
                    <p className="font-bold text-[#0F2854]">{request.contactPhone}</p>
                  </div>
                </div>

                {request.familyDetails && (
                  <div className="mb-4">
                    <p className="text-[#296374] text-sm font-semibold">Family Details</p>
                    <p className="text-[#0F2854]">
                      Children: {request.childrenCount || 0} | Elders: {request.eldersCount || 0}
                    </p>
                  </div>
                )}

                {request.specialNeeds && (
                  <div className="mb-4">
                    <p className="text-[#296374] text-sm font-semibold">Special Needs</p>
                    <p className="text-[#0F2854]">{request.specialNeeds}</p>
                  </div>
                )}

                {request.address && (
                  <div className="mb-4">
                    <p className="text-[#296374] text-sm font-semibold">Address</p>
                    <p className="text-[#0F2854]">{request.address}</p>
                  </div>
                )}

                {/* Status-specific information */}
                {request.status === 'PENDING' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <p className="text-yellow-800 text-sm">
                      ℹ️ Your request is pending admin verification.
                    </p>
                  </div>
                )}

                {request.status === 'VERIFIED' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-blue-800 text-sm">
                      Your request has been verified and is being processed. A volunteer will contact you soon.
                    </p>
                  </div>
                )}

                {request.status === 'APPROVED' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800 text-sm">
                      Your request has been approved! Aid is being allocated to you.
                    </p>
                  </div>
                )}

                {request.status === 'ALLOCATED' && (
                  <div className="mt-4">
                    <div className="bg-[#EBF4DD] border border-[#629FAD] rounded-lg p-4 mb-4">
                      <p className="text-[#0F2854] text-sm font-semibold mb-2">
                        Aid has been allocated to you!
                      </p>
                      {request.volunteerName && (
                        <p className="text-[#296374] text-sm">
                          Volunteer: {request.volunteerName} | Contact: {request.volunteerPhone}
                        </p>
                      )}
                      {request.expectedDelivery && (
                        <p className="text-[#296374] text-sm">
                          Expected Delivery: {formatDate(request.expectedDelivery)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleConfirmReceipt(request._id)}
                      className="w-full bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide"
                    >
                      Confirm Receipt of Aid
                    </button>
                  </div>
                )}

                {request.status === 'DELIVERED' && (
                  <div className="bg-[#EBF4DD] border border-[#4988C4] rounded-lg p-4 mt-4">
                    <p className="text-[#0F2854] text-sm">
                      Aid has been delivered on {formatDate(request.deliveredAt)}
                    </p>
                  </div>
                )}

                {request.status === 'RECEIVED' && (
                  <div className="bg-[#EBF4DD] border border-[#629FAD] rounded-lg p-4 mt-4">
                    <p className="text-[#0F2854] text-sm">
                      Aid received and confirmed on {formatDate(request.receivedAt)}
                    </p>
                  </div>
                )}

                {request.status === 'REJECTED' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <p className="text-red-800 text-sm">
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

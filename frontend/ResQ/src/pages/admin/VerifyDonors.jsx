import { useState, useEffect } from 'react';

const VerifyDonors = () => {
  const [pendingDonations, setPendingDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPendingDonations();
  }, []);

  const fetchPendingDonations = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch('http://localhost:5000/api/donations/pending-verification', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPendingDonations(data);
      }
    } catch (error) {
      setError('Failed to load donation verification requests');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (donationId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        alert('Donation verified and approved!');
        fetchPendingDonations();
      } else {
        alert('Failed to approve donation');
      }
    } catch (error) {
      alert('Connection error');
      console.error('Error approving donation:', error);
    }
  };

  const handleReject = async (donationId) => {
    if (!window.confirm('Are you sure you want to reject this donation?')) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await fetch(`http://localhost:5000/api/donations/${donationId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        alert('Donation rejected');
        fetchPendingDonations();
      } else {
        alert('Failed to reject donation');
      }
    } catch (error) {
      alert('Connection error');
      console.error('Error rejecting donation:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading verification requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Verify Donations</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {pendingDonations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No pending donations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                    Pending Verification
                  </span>
                </div>

                <h3 className="text-2xl font-bold mb-4">
                  {donation.type === 'MONEY' ? 'Money Donation' : 'Items Donation'}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600">
                      <strong>Donor:</strong> {donation.user?.name || 'N/A'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Type:</strong> {donation.type}
                    </p>
                    {donation.type === 'MONEY' && (
                      <p className="text-gray-600">
                        <strong>Amount:</strong> ${donation.amount}
                      </p>
                    )}
                    {donation.type === 'ITEMS' && (
                      <>
                        <p className="text-gray-600">
                          <strong>Item Type:</strong> {donation.itemType}
                        </p>
                        <p className="text-gray-600">
                          <strong>Quantity:</strong> {donation.quantity}
                        </p>
                      </>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600">
                      <strong>Disaster:</strong> {donation.disaster?.name || 'General Fund'}
                    </p>
                    <p className="text-gray-600">
                      <strong>Submitted:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600">
                      <strong>Status:</strong> {donation.status}
                    </p>
                  </div>
                </div>

                {donation.itemDescription && (
                  <div className="mb-4">
                    <p className="text-gray-700">
                      <strong>Description:</strong>
                    </p>
                    <p className="text-gray-600 mt-2">{donation.itemDescription}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleApprove(donation.id)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() => handleReject(donation.id)}
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

export default VerifyDonors;

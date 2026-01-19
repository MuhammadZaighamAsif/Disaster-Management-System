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
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">Verify Donations</h1>
            <p className="text-[#BDE8F5]">Review and approve pending donations</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading verification requests...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Verify Donations</h1>
          <p className="text-[#BDE8F5]">Review and approve pending donation submissions</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {pendingDonations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <p className="text-[#296374] text-2xl font-semibold">✅ No pending donations</p>
            <p className="text-[#5A7863] mt-2">All donations have been verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingDonations.map((donation) => (
              <div key={donation.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="bg-yellow-200 text-yellow-800 px-4 py-2 rounded-full text-sm font-bold">Pending</span>
                        <span className="text-[#5A7863] text-sm font-semibold">{donation.type === 'MONEY' ? 'Monetary' : 'Items'}</span>
                      </div>
                      <h3 className="text-3xl font-bold text-[#0F2854]">{donation.type === 'MONEY' ? '💵 Monetary Donation' : '📦 Items Donation'}</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Donor</p>
                      <p className="text-[#0F2854] font-bold">{donation.user?.name || 'N/A'}</p>
                      <p className="text-[#296374] text-sm">{donation.user?.email || 'No email'}</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Submitted</p>
                      <p className="text-[#0F2854] font-bold">{new Date(donation.createdAt).toLocaleDateString()}</p>
                      <p className="text-[#296374] text-sm">{new Date(donation.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {donation.type === 'MONEY' ? (
                    <div className="bg-green-50 rounded-lg p-4 mb-6 border-l-4 border-green-500">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">💵 Amount</p>
                      <p className="text-3xl font-bold text-green-600">${donation.amount}</p>
                      <p className="text-[#296374] text-sm">For: {donation.disaster?.name || 'General Fund'}</p>
                    </div>
                  ) : (
                    <div className="bg-blue-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">📦 Item Details</p>
                      <p className="text-[#0F2854] font-bold mb-2">{donation.itemType}</p>
                      <p className="text-[#296374] text-sm">Quantity: {donation.quantity} units</p>
                      <p className="text-[#296374] text-sm">For: {donation.disaster?.name || 'General Relief'}</p>
                    </div>
                  )}

                  {donation.itemDescription && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Description</p>
                      <p className="text-[#3B4953]">{donation.itemDescription}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#EDEDCE]">
                    <button
                      onClick={() => handleApprove(donation.id)}
                      className="flex-1 bg-[#90AB8B] hover:bg-[#5A7863] text-white font-bold py-3 px-6 rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      ✅ Approve Donation
                    </button>
                    <button
                      onClick={() => handleReject(donation.id)}
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

export default VerifyDonors;

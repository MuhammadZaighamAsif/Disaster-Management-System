import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCheck, faCheck, faTimes, faUser, faEnvelope, faCalendar, faClock, faDollarSign, faBox, faFileAlt, faExclamationTriangle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VerifyDonors = () => {
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4">
          {/* Header Card */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#5A7863]/30 shadow-lg">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} />
              Back to Admin Dashboard
            </button>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">Verify Donations</h1>
                <p className="text-gray-300 text-lg">Review and approve pending donations</p>
              </div>
              <div className="text-7xl text-[#5A7863]/30">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
            </div>
          </div>
          <div className="text-center py-12">
            <div className="text-xl text-[#4988C4] font-semibold">Loading verification requests...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#5A7863]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Verify Donations</h1>
              <p className="text-gray-300 text-lg">Review and approve pending donation submissions</p>
            </div>
            <div className="text-7xl text-[#5A7863]/30">
              <FontAwesomeIcon icon={faUserCheck} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faExclamationTriangle} />
            {error}
          </div>
        )}

        {pendingDonations.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#5A7863]/30 shadow-lg">
            <p className="text-white text-2xl font-semibold">✅ No pending donations</p>
            <p className="text-gray-400 mt-2">All donations have been verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {pendingDonations.map((donation) => (
              <div key={donation.id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/30 hover:border-[#5A7863] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#5A7863]/10 overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex gap-4 items-center mb-3">
                        <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold border border-yellow-500/30 flex items-center gap-2">
                          <FontAwesomeIcon icon={faClock} />
                          Pending
                        </span>
                        <span className="text-gray-400 text-sm font-semibold">{donation.type === 'MONEY' ? 'Monetary' : 'Items'}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FontAwesomeIcon icon={donation.type === 'MONEY' ? faDollarSign : faBox} className="text-[#4988C4]" />
                        {donation.type === 'MONEY' ? 'Monetary Donation' : 'Items Donation'}
                      </h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} className="text-[#5A7863]" />
                        Donor
                      </p>
                      <p className="text-white font-bold">{donation.user?.name || 'N/A'}</p>
                      <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                        <FontAwesomeIcon icon={faEnvelope} className="text-[#629FAD]" />
                        {donation.user?.email || 'No email'}
                      </p>
                    </div>

                    <div className="bg-[#0a1628]/50 rounded-xl p-4 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendar} className="text-[#4988C4]" />
                        Submitted
                      </p>
                      <p className="text-white font-bold">{new Date(donation.createdAt).toLocaleDateString()}</p>
                      <p className="text-gray-400 text-sm">{new Date(donation.createdAt).toLocaleTimeString()}</p>
                    </div>
                  </div>

                  {donation.type === 'MONEY' ? (
                    <div className="bg-[#5A7863]/10 rounded-xl p-4 mb-6 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faDollarSign} className="text-[#5A7863]" />
                        Amount
                      </p>
                      <p className="text-3xl font-bold text-[#5A7863]">${donation.amount}</p>
                      <p className="text-gray-400 text-sm">For: {donation.disaster?.name || 'General Fund'}</p>
                    </div>
                  ) : (
                    <div className="bg-[#4988C4]/10 rounded-xl p-4 mb-6 border border-[#4988C4]/30">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBox} className="text-[#4988C4]" />
                        Item Details
                      </p>
                      <p className="text-white font-bold mb-2">{donation.itemType}</p>
                      <p className="text-gray-400 text-sm">Quantity: {donation.quantity} units</p>
                      <p className="text-gray-400 text-sm">For: {donation.disaster?.name || 'General Relief'}</p>
                    </div>
                  )}

                  {donation.itemDescription && (
                    <div className="bg-[#0a1628]/50 rounded-xl p-4 mb-6 border border-[#90AB8B]/20">
                      <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileAlt} className="text-[#90AB8B]" />
                        Description
                      </p>
                      <p className="text-gray-300">{donation.itemDescription}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-[#4988C4]/20">
                    <button
                      onClick={() => handleApprove(donation.id)}
                      className="flex-1 bg-[#5A7863]/20 hover:bg-[#5A7863]/40 text-[#90AB8B] hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-[#5A7863]/30 hover:border-[#5A7863]/50 flex items-center justify-center gap-2"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Approve Donation
                    </button>
                    <button
                      onClick={() => handleReject(donation.id)}
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

export default VerifyDonors;

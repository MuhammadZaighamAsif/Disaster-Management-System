import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBox, faHome, faHeart } from '@fortawesome/free-solid-svg-icons';

const ViewDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setDonations(result.data || []);
      } else {
        setError('Failed to load donations');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD]">
        <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white mb-2">View Donations</h1>
            <p className="text-[#BDE8F5]">Track incoming donations</p>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#296374] font-semibold">Loading donations...</div>
        </div>
      </div>
    );
  }

  const getDonationTypeIcon = (type) => {
    switch ((type || '').toUpperCase()) {
      case 'MONEY':
        return '';
      case 'ITEMS':
        return '';
      case 'SHELTER':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">View Donations</h1>
          <p className="text-[#BDE8F5]">Track all incoming donations from donors</p>
        </div>
      </div>

      <div className="container mx-auto px-4 mb-12">
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-8 shadow-md font-semibold">
            ⚠️ {error}
          </div>
        )}

        {donations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border-l-4 border-[#90AB8B]">
            <p className="text-[#296374] text-2xl font-semibold">No Donations</p>
            <p className="text-[#5A7863] mt-2">Donations will appear here as they come in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {donations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition overflow-hidden">
                <div className="border-l-4 border-[#4988C4] p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-6 flex-1">
                      <div className="text-6xl">{getDonationTypeIcon(donation.type)}</div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-[#0F2854] mb-2">{donation.donor?.name || 'Donor'}</h3>
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                          donation.status === 'VERIFIED' ? 'bg-green-200 text-green-800' : 
                          donation.status === 'PENDING' ? 'bg-yellow-200 text-yellow-800' : 
                          'bg-gray-200 text-gray-800'
                        }`}>
                          {donation.status === 'VERIFIED' ? '✅ Verified' : 
                           donation.status === 'PENDING' ? 'Pending' : 'Rejected'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">📧 Donor Contact</p>
                      <p className="text-[#0F2854] font-bold mb-2">{donation.donor?.email || '—'}</p>
                      <p className="text-[#296374] text-sm">Date: {new Date(donation.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="bg-[#EBF4DD] rounded-lg p-4 border border-[#4988C4]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-1">Donation Details</p>
                      <p className="text-[#0F2854] font-bold mb-2">{donation.type === 'MONEY' ? '💵 Monetary' : '📦 Items'}</p>
                      {donation.type === 'MONEY' && (
                        <p className="text-[#296374] text-sm">Amount: <span className="font-bold text-lg">PKR {(donation.amount || 0).toLocaleString()}</span></p>
                      )}
                      {donation.type === 'ITEMS' && (
                        <p className="text-[#296374] text-sm">{(donation.itemType || '').toUpperCase()} | Qty: {donation.quantity}</p>
                      )}
                      {donation.type === 'SHELTER' && (
                        <p className="text-[#296374] text-sm">Beds Available: {donation.bedsAvailable || 0}</p>
                      )}
                    </div>
                  </div>

                  {donation.disaster && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#629FAD]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">For Disaster</p>
                      <p className="text-[#0F2854] font-bold">{donation.disaster?.name}</p>
                    </div>
                  )}

                  {donation.donationType && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 mb-6 border-l-2 border-[#5A7863]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Donation Type</p>
                      <p className="text-[#0F2854] font-bold">{donation.donationType}</p>
                    </div>
                  )}

                  {donation.description && (
                    <div className="bg-[#F5F5F5] rounded-lg p-4 border-l-2 border-[#90AB8B]">
                      <p className="text-[#5A7863] text-sm font-semibold uppercase mb-2">Description</p>
                      <p className="text-[#3B4953]">{donation.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewDonations;

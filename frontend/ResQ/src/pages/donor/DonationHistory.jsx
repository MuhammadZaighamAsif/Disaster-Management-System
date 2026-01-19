import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency } from '../../utils/helpers';

const DonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/donations/my-donations', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const result = await response.json();
        setDonations(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDonations = donations.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'money') return d.type === 'MONEY';
    if (filter === 'items') return d.type === 'ITEMS';
    return true;
  });

  const totalMoney = donations
    .filter(d => d.type === 'MONEY')
    .reduce((sum, d) => sum + (d.amount || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD] py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block">
            <div className="text-6xl mb-4"></div>
            <div className="text-xl text-[#5A7863] font-semibold">Loading your donation history...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header */}
      <div className="bg-[#296374] text-white py-12 px-4 mb-8 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 text-white">Donation History</h1>
          <p className="text-[#BDE8F5]">Track your contributions and see the impact you've made</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#4988C4] transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-bold uppercase">Total Donations</p>
                <p className="text-4xl font-bold text-[#4988C4] mt-2">{donations.length}</p>
              </div>
              <div className="text-5xl opacity-30"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#629FAD] transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-bold uppercase">Money Donated</p>
                <p className="text-3xl font-bold text-[#629FAD] mt-2">{formatCurrency(totalMoney)}</p>
              </div>
              <div className="text-5xl opacity-30"></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#5A7863] transform hover:scale-105 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-bold uppercase">Items Donated</p>
                <p className="text-4xl font-bold text-[#5A7863] mt-2">
                  {donations.filter(d => d.type === 'items').length}
                </p>
              </div>
              <div className="text-5xl opacity-30">📦</div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <label className="block text-sm font-bold text-[#0F2854] mb-4 uppercase tracking-wide">
            Filter by Type
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#5A7863] focus:ring-2 focus:ring-[#5A7863] focus:ring-opacity-20"
          >
            <option value="all">All Donations</option>
            <option value="money">Money Donations</option>
            <option value="items">📦 Item Donations</option>
            <option value="shelter">Shelter Offers</option>
          </select>
        </div>

        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <p className="text-[#296374] text-lg font-semibold">No donations found.</p>
            <p className="text-[#296374] text-sm mt-2">Start making a difference today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-[#5A7863] hover:shadow-xl transition transform hover:scale-102">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[#0F2854] mb-2">
                      {donation.type === 'MONEY' ? 'Money Donation' : donation.type === 'ITEMS' ? 'Item Donation' : 'Donation'}
                    </h3>
                    <p className="text-[#296374] text-sm font-semibold">
                      {formatDate(donation.createdAt)}
                    </p>
                  </div>
                  <span className={`${donation.status === 'VERIFIED' ? 'bg-green-100 text-green-800 border-2 border-green-300' : donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300' : 'bg-gray-100 text-gray-800 border-2 border-gray-300'} px-4 py-2 rounded-full text-sm font-bold uppercase`}>
                    {donation.status === 'VERIFIED' ? 'Verified' : donation.status === 'PENDING' ? 'Pending' : donation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {donation.type === 'money' && (
                    <>
                      <div className="bg-[#EDEDCE] rounded-lg p-4">
                        <p className="text-[#296374] text-sm font-semibold uppercase">Amount</p>
                        <p className="font-bold text-2xl text-[#4988C4] mt-1">₨{formatCurrency(donation.amount)}</p>
                      </div>
                      <div className="bg-[#EDEDCE] rounded-lg p-4">
                        <p className="text-[#296374] text-sm font-semibold uppercase">Donation Type</p>
                        <p className="font-semibold text-[#5A7863] mt-1">
                          {donation.donationType === 'GENERAL' ? 'General Fund' : 'Specific Disaster'}
                        </p>
                      </div>
                    </>
                  )}

                  {donation.type === 'ITEMS' && (
                    <>
                      <div className="bg-[#EDEDCE] rounded-lg p-4">
                        <p className="text-[#296374] text-sm font-semibold uppercase">Item Type</p>
                        <p className="font-semibold text-[#5A7863] mt-1">{(donation.itemType || '').toUpperCase()}</p>
                      </div>
                      <div className="bg-[#EDEDCE] rounded-lg p-4">
                        <p className="text-[#296374] text-sm font-semibold uppercase">Quantity</p>
                        <p className="font-semibold text-[#5A7863] mt-1">{donation.quantity} units</p>
                      </div>
                    </>
                  )}

                  {donation.disaster && (
                    <div className="bg-[#5A7863] rounded-lg p-4 text-white">
                      <p className="text-sm font-semibold uppercase opacity-90">Disaster</p>
                      <p className="font-bold mt-1">{donation.disaster?.name}</p>
                    </div>
                  )}
                </div>

                {donation.description && (
                  <div className="bg-[#EBF4DD] rounded-lg p-4 border-l-4 border-[#296374]">
                    <p className="text-[#296374] text-xs font-semibold uppercase mb-1">Description</p>
                    <p className="text-[#3B4953]">{donation.description}</p>
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

export default DonationHistory;

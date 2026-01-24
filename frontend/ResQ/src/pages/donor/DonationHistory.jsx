import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faArrowLeft, faMoneyBillWave, faBox, faGift } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DonationHistory = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
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
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-[#4988C4]/30 border-t-[#4988C4] rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400 font-semibold">Loading your donation history...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => navigate('/volunteer/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Donation History</h1>
              <p className="text-gray-300 text-lg">Track your contributions and see the impact you've made</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHistory} />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#4988C4]/30 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faGift} className="text-2xl text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Total Donations</p>
                <p className="text-3xl font-bold text-[#4988C4] mt-1">{donations.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#629FAD]/30 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#629FAD]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-2xl text-[#629FAD]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Money Donated</p>
                <p className="text-2xl font-bold text-[#629FAD] mt-1">{formatCurrency(totalMoney)}</p>
              </div>
            </div>
          </div>
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border border-[#5A7863]/30 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#5A7863]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faBox} className="text-2xl text-[#90AB8B]" />
              </div>
              <div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Items Donated</p>
                <p className="text-3xl font-bold text-[#90AB8B] mt-1">
                  {donations.filter(d => d.type === 'ITEMS').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 mb-8 border border-[#4988C4]/30 shadow-lg">
          <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
            Filter by Type
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white font-medium transition duration-300"
          >
            <option value="all">All Donations</option>
            <option value="money">Money Donations</option>
            <option value="items">Item Donations</option>
            <option value="shelter">Shelter Offers</option>
          </select>
        </div>

        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-12 text-center border border-[#4988C4]/30 shadow-lg">
            <FontAwesomeIcon icon={faHistory} className="text-5xl text-gray-600 mb-4" />
            <p className="text-gray-300 text-lg font-semibold">No donations found.</p>
            <p className="text-gray-500 text-sm mt-2">Start making a difference today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 border-l-4 border-[#5A7863] hover:shadow-xl transition-all duration-300 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {donation.type === 'MONEY' ? 'Money Donation' : donation.type === 'ITEMS' ? 'Item Donation' : 'Donation'}
                    </h3>
                    <p className="text-gray-400 text-sm font-semibold">
                      {formatDate(donation.createdAt)}
                    </p>
                  </div>
                  <span className={`${donation.status === 'VERIFIED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : donation.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'} px-4 py-2 rounded-full text-xs font-bold uppercase`}>
                    {donation.status === 'VERIFIED' ? 'Verified' : donation.status === 'PENDING' ? 'Pending' : donation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {donation.type === 'MONEY' && (
                    <>
                      <div className="bg-[#0a1628] rounded-lg p-4 border border-[#4988C4]/20">
                        <p className="text-gray-500 text-xs font-semibold uppercase">Amount</p>
                        <p className="font-bold text-2xl text-[#4988C4] mt-1">{formatCurrency(donation.amount)}</p>
                      </div>
                      <div className="bg-[#0a1628] rounded-lg p-4 border border-[#5A7863]/20">
                        <p className="text-gray-500 text-xs font-semibold uppercase">Donation Type</p>
                        <p className="font-semibold text-[#90AB8B] mt-1">
                          {donation.donationType === 'GENERAL' ? 'General Fund' : 'Specific Disaster'}
                        </p>
                      </div>
                    </>
                  )}

                  {donation.type === 'ITEMS' && (
                    <>
                      <div className="bg-[#0a1628] rounded-lg p-4 border border-[#5A7863]/20">
                        <p className="text-gray-500 text-xs font-semibold uppercase">Item Type</p>
                        <p className="font-semibold text-[#90AB8B] mt-1">{(donation.itemType || '').toUpperCase()}</p>
                      </div>
                      <div className="bg-[#0a1628] rounded-lg p-4 border border-[#629FAD]/20">
                        <p className="text-gray-500 text-xs font-semibold uppercase">Quantity</p>
                        <p className="font-semibold text-[#629FAD] mt-1">{donation.quantity} units</p>
                      </div>
                    </>
                  )}

                  {donation.disaster && (
                    <div className="bg-[#5A7863]/20 rounded-lg p-4 border border-[#5A7863]/30">
                      <p className="text-gray-400 text-xs font-semibold uppercase">Disaster</p>
                      <p className="font-bold text-[#90AB8B] mt-1">{donation.disaster?.name}</p>
                    </div>
                  )}
                </div>

                {donation.description && (
                  <div className="bg-[#0a1628] rounded-lg p-4 border-l-4 border-[#629FAD]">
                    <p className="text-gray-500 text-xs font-semibold uppercase mb-1">Description</p>
                    <p className="text-gray-300">{donation.description}</p>
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

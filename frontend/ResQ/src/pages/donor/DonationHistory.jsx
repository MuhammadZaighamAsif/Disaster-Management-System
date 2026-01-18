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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading donation history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Donation History</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Donations</h3>
            <p className="text-3xl font-bold text-blue-600">{donations.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Money Donated</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(totalMoney)}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Items Donated</h3>
            <p className="text-3xl font-bold text-purple-600">
              {donations.filter(d => d.type === 'items').length}
            </p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Donations</option>
            <option value="money">Money</option>
            <option value="items">Items</option>
            <option value="shelter">Shelter</option>
          </select>
        </div>

        {/* Donations List */}
        {filteredDonations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No donations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredDonations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">
                      {donation.type === 'MONEY' ? 'Money Donation' : donation.type === 'ITEMS' ? 'Item Donation' : 'Donation'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(donation.createdAt)}
                    </p>
                  </div>
                  <span className={`${donation.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-sm font-semibold`}>
                    {donation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {donation.type === 'money' && (
                    <>
                      <div>
                        <p className="text-gray-600 text-sm">Amount</p>
                        <p className="font-semibold text-lg">{formatCurrency(donation.amount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Donation Type</p>
                        <p className="font-semibold">
                          {donation.donationType === 'GENERAL' ? 'General Fund' : 'Specific Disaster'}
                        </p>
                      </div>
                    </>
                  )}

                  {donation.type === 'ITEMS' && (
                    <>
                      <div>
                        <p className="text-gray-600 text-sm">Item Type</p>
                        <p className="font-semibold">{(donation.itemType || '').toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Quantity</p>
                        <p className="font-semibold">{donation.quantity}</p>
                      </div>
                    </>
                  )}

                  {donation.disaster && (
                    <div>
                      <p className="text-gray-600 text-sm">Disaster</p>
                      <p className="font-semibold">{donation.disaster?.name}</p>
                    </div>
                  )}
                </div>

                {donation.description && (
                  <div className="mt-4">
                    <p className="text-gray-600 text-sm">Description</p>
                    <p className="text-gray-700">{donation.description}</p>
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

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

  const getDonationTypeIcon = (type) => {
    switch ((type || '').toUpperCase()) {
      case 'MONEY':
        return faDollarSign;
      case 'ITEMS':
        return faBox;
      case 'SHELTER':
        return faHome;
      default:
        return faHeart;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl">Loading donations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">View Donations</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {donations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No Donations</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {donations.map((donation) => (
              <div key={donation._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="text-4xl text-blue-600">
                    <FontAwesomeIcon icon={getDonationTypeIcon(donation.type)} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold">{donation.donor?.name || 'Donor'}</h3>
                      <span className={`${donation.status === 'VERIFIED' ? 'bg-green-100 text-green-800' : donation.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'} px-3 py-1 rounded-full text-sm font-semibold`}>
                        {donation.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-600">
                          <strong>Donor Email:</strong> {donation.donor?.email || '—'}
                        </p>
                        <p className="text-gray-600">
                          <strong>Date:</strong> {new Date(donation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        {donation.type === 'MONEY' && (
                          <p className="text-gray-600">
                            <strong>Amount:</strong> PKR {(donation.amount || 0).toLocaleString()}
                          </p>
                        )}
                        {donation.type === 'ITEMS' && (
                          <p className="text-gray-600">
                            <strong>Item Type:</strong> {(donation.itemType || '').toUpperCase()} | Qty: {donation.quantity}
                          </p>
                        )}
                        {donation.type === 'SHELTER' && (
                          <p className="text-gray-600">
                            <strong>Beds Available:</strong> {donation.bedsAvailable || 0}
                          </p>
                        )}
                      </div>
                    </div>
                    {donation.disaster && (
                      <p className="text-gray-600 mt-2">
                        <strong>Disaster:</strong> {donation.disaster?.name}
                      </p>
                    )}
                    {donation.donationType && (
                      <p className="text-gray-600 mt-2">
                        <strong>Donation Type:</strong> {donation.donationType}
                      </p>
                    )}
                    {donation.description && (
                      <p className="text-gray-700 mt-2">
                        <strong>Description:</strong> {donation.description}
                      </p>
                    )}
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

export default ViewDonations;

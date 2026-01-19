import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const DonateMoney = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [donationType, setDonationType] = useState('general');
  const [selectedDisaster, setSelectedDisaster] = useState('');
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donationType === 'specific') {
      fetchDisasters();
    }
  }, [donationType]);

  const fetchDisasters = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE');
      if (response.ok) {
        const result = await response.json();
        setDisasters(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (parseFloat(amount) <= 0) {
      setError('Invalid Amount: Please enter a positive amount.');
      return;
    }

    if (donationType === 'specific' && !selectedDisaster) {
      setError('No Disaster Chosen: Please select a disaster to donate to.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/donations/money', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          donationType: donationType === 'specific' ? 'SPECIFIC' : 'GENERAL',
          disaster: donationType === 'specific' ? selectedDisaster : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Thank you for your generous donation!');
        navigate('/donor/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to process donation');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header */}
      <div className="bg-[#4988C4] text-white py-12 px-4 mb-8 shadow-lg">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold mb-2 text-white">Donate Money</h1>
          <p className="text-[#BDE8F5]">Help us provide relief to disaster victims with your generous contribution</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Donation Amount (PKR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-2xl text-[#4988C4]">₨</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#4988C4] focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 text-lg"
                placeholder="Enter amount in PKR"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Donation Type *
            </label>
            <select
              value={donationType}
              onChange={(e) => {
                setDonationType(e.target.value);
                setSelectedDisaster('');
              }}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#4988C4] focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20"
            >
              <option value="general">General Relief Fund</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {donationType === 'specific' && (
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Select Disaster *
              </label>
              <select
                required
                value={selectedDisaster}
                onChange={(e) => setSelectedDisaster(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#4988C4] focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20"
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {disasters.length === 0 && (
                <p className="text-sm text-[#296374] mt-2">Loading disasters...</p>
              )}
            </div>
          )}

          <div className="bg-[#EDEDCE] border-2 border-[#4988C4] rounded-xl p-6">
            <h3 className="font-bold text-[#0F2854] mb-4 text-lg">Donation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#296374] font-semibold">Amount:</span>
                <span className="text-2xl font-bold text-[#4988C4]">₨{amount || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#296374] font-semibold">Type:</span>
                <span className="px-3 py-1 bg-[#4988C4] text-white rounded-full text-sm font-semibold">
                  {donationType === 'general' ? 'General Fund' : 'Specific Disaster'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 bg-[#296374] text-white py-3 rounded-lg hover:shadow-lg hover:bg-[#5A7863] transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-[#EBF4DD] rounded-xl p-6 border-l-4 border-[#4988C4]">
          <p className="text-[#3B4953] text-sm">
            <span className="font-bold">Tip:</span> Your donation is secure and will be used to provide immediate relief to disaster-affected communities.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonateMoney;

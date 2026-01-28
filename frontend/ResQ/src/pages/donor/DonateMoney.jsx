import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faDollarSign, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/disasters?status=ACTIVE`);
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/donations/money`, {
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
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4 max-w-8xl">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#4988C4]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {/* Back Button */}
              <button
                onClick={() => navigate('/donor/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Donate Money</h1>
              <p className="text-gray-300 text-lg">Help us provide relief to disaster victims</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#4988C4]/30">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
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
                className="w-full pl-12 pr-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white text-lg placeholder-gray-500"
                placeholder="Enter amount in PKR"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Donation Type *
            </label>
            <select
              value={donationType}
              onChange={(e) => {
                setDonationType(e.target.value);
                setSelectedDisaster('');
              }}
              className="w-full px-5 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white"
            >
              <option value="general">General Relief Fund</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {donationType === 'specific' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Select Disaster *
              </label>
              <select
                required
                value={selectedDisaster}
                onChange={(e) => setSelectedDisaster(e.target.value)}
                className="w-full px-4 py-3 pr-10 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white"
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {disasters.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">Loading disasters...</p>
              )}
            </div>
          )}

          {/* Donation Summary */}
          <div className="bg-[#0a1628] rounded-xl p-6 border border-[#5A7863]/30">
            <h3 className="font-bold text-white mb-4 text-lg">Donation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Amount:</span>
                <span className="text-2xl font-bold text-[#90AB8B]">₨{amount || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Type:</span>
                <span className="px-3 py-1 bg-[#4988C4]/30 text-[#4988C4] rounded-full text-sm font-semibold border border-[#4988C4]/30">
                  {donationType === 'general' ? 'General Fund' : 'Specific Disaster'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 border-2 border-[#4988C4]/50 text-[#4988C4] py-3 rounded-lg hover:bg-[#4988C4]/20 transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#3a6fa0] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-[#0F2854]/60 backdrop-blur-md rounded-xl p-6 border border-[#629FAD]/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-xl mr-3 text-[#629FAD]" />
            Important Information
          </h3>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>All donations are tax-deductible</li>
            <li>You will receive a confirmation email</li>
            <li>100% of your donation goes to relief efforts</li>
            <li>A donation receipt will be available in your dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonateMoney;

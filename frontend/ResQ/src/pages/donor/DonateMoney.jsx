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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Donate Money</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount (PKR) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount in PKR"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Type *
            </label>
            <select
              value={donationType}
              onChange={(e) => {
                setDonationType(e.target.value);
                setSelectedDisaster('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">General Fund</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {donationType === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Disaster *
              </label>
              <select
                required
                value={selectedDisaster}
                onChange={(e) => setSelectedDisaster(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {disasters.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">Loading disasters...</p>
              )}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Donation Summary</h3>
            <p className="text-blue-800">
              Amount: <strong>PKR {amount || '0'}</strong>
            </p>
            <p className="text-blue-800">
              Type: <strong>{donationType === 'general' ? 'General Fund' : 'Specific Disaster'}</strong>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateMoney;

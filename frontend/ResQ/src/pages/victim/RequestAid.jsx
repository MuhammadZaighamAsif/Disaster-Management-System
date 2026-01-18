import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const RequestAid = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    aidType: 'food',
    amount: '',
    familySize: '',
    childrenCount: '',
    eldersCount: '',
    specialNeeds: '',
    urgency: 'medium',
    address: '',
    contactPhone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [limitInfo, setLimitInfo] = useState(null);

  const aidTypes = [
    { value: 'food', label: 'Food', limit: 50 },
    { value: 'clothes', label: 'Clothes', limit: 30 },
    { value: 'shelter', label: 'Shelter', limit: 10 },
    { value: 'medical', label: 'Medical Help', limit: 20 }
  ];

  useEffect(() => {
    const selectedAid = aidTypes.find(a => a.value === formData.aidType);
    setLimitInfo(selectedAid);
  }, [formData.aidType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Invalid request. Please enter valid aid details.');
      return;
    }

    if (!formData.familySize || parseInt(formData.familySize) <= 0) {
      setError('Invalid request. Please enter valid family information.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/aid-requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          aidType: formData.aidType.toUpperCase(),
          amount: parseFloat(formData.amount),
          familySize: parseInt(formData.familySize),
          childrenCount: parseInt(formData.childrenCount) || 0,
          eldersCount: parseInt(formData.eldersCount) || 0,
          specialNeeds: formData.specialNeeds,
          urgency: (formData.urgency || 'medium').toUpperCase(),
          address: formData.address,
          contactPhone: formData.contactPhone
        })
      });

      if (response.ok) {
        alert('Your aid request has been submitted successfully!\n\nYour request will be reviewed and approved or rejected by the admin. You can check the status in your Aid Status page.');
        navigate('/victim/aid-status');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit aid request');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkLimitExceeded = () => {
    if (!formData.amount || !limitInfo) return false;
    return parseFloat(formData.amount) > limitInfo.limit;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Request Aid</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Aid Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type of Aid Needed *
              </label>
              <select
                value={formData.aidType}
                onChange={(e) => setFormData({ ...formData, aidType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {aidTypes.map((aid) => (
                  <option key={aid.value} value={aid.value}>
                    {aid.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount/Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
              {limitInfo && (
                <p className="text-xs text-gray-500 mt-1">
                  Reference limit: {limitInfo.limit} units (all requests require admin approval)
                </p>
              )}
            </div>
          </div>

          {/* Family Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Size *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.familySize}
                  onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Total members"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Children (under 18)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elders (60+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.eldersCount}
                  onChange={(e) => setFormData({ ...formData, eldersCount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+92-XXX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <textarea
                required
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Needs or Additional Information
            </label>
            <textarea
              rows="3"
              value={formData.specialNeeds}
              onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any medical conditions, disabilities, or special requirements..."
            />
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How Your Request Will Be Processed</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>✓ Your aid request will be reviewed by the admin</li>
              <li>✓ If approved, you will receive the aid</li>
              <li>✓ If rejected, you will be notified with a reason</li>
              <li>✓ Check your "Aid Status" page to track your request</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/victim/dashboard')}
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

export default RequestAid;

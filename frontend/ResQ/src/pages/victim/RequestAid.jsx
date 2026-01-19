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
    <div className="min-h-screen bg-linear-to-br from-[#EBF4DD] to-[#F5F7F3] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-5xl font-bold mb-2 text-[#0F2854]">Request Aid</h1>
        <p className="text-[#296374] mb-8">Fill out the form below to request assistance</p>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Aid Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Type of Aid Needed *
              </label>
              <select
                value={formData.aidType}
                onChange={(e) => setFormData({ ...formData, aidType: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
              >
                {aidTypes.map((aid) => (
                  <option key={aid.value} value={aid.value}>
                    {aid.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Amount/Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                placeholder="Enter amount"
              />
              {limitInfo && (
                <p className="text-xs text-[#296374] mt-2">
                  Reference limit: {limitInfo.limit} units (all requests require admin approval)
                </p>
              )}
            </div>
          </div>

          {/* Family Information */}
          <div className="border-t-2 border-[#EBF4DD] pt-6">
            <h3 className="text-lg font-bold text-[#0F2854] mb-4">👨‍👩‍👧‍👦 Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Family Size *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.familySize}
                  onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                  placeholder="Total members"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Children (under 18)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Elders (60+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.eldersCount}
                  onChange={(e) => setFormData({ ...formData, eldersCount: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t-2 border-[#EBF4DD] pt-6">
            <h3 className="text-lg font-bold text-[#0F2854] mb-4">📞 Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                  placeholder="+92-XXX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Address *
              </label>
              <textarea
                required
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Special Needs or Additional Information
            </label>
            <textarea
              rows="3"
              value={formData.specialNeeds}
              onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
              placeholder="Any medical conditions, disabilities, or special requirements..."
            />
          </div>

          {/* Info Message */}
          <div className="bg-[#EBF4DD] border-l-4 border-[#4988C4] rounded-lg p-5">
            <h3 className="font-bold text-[#0F2854] mb-3">ℹ️ How Your Request Will Be Processed</h3>
            <ul className="text-[#296374] text-sm space-y-2">
              <li>Your aid request will be reviewed by the admin</li>
              <li>If approved, you will receive the aid</li>
              <li>If rejected, you will be notified with a reason</li>
              <li>Check your "Aid Status" page to track your request</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/victim/dashboard')}
              className="flex-1 bg-[#EBF4DD] text-[#0F2854] py-3 rounded-lg hover:bg-[#EDEDCE] transition font-bold uppercase tracking-wide border-2 border-[#0F2854]"
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

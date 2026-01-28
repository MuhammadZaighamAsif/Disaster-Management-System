import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faArrowLeft, faHandHoldingHeart, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/aid-requests`, {
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
  
  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4 max-w-8xl">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#4988C4]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              {/* Back Button */}
              <button
                onClick={() => navigate('/victim/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Request Aid</h1>
              <p className="text-gray-300 text-lg">Fill out the form below to request assistance</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#4988C4]/30">
          {/* Aid Type and Amount */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Type of Aid Needed *
              </label>
              <select
                value={formData.aidType}
                onChange={(e) => setFormData({ ...formData, aidType: e.target.value })}
                className="w-full px-4 py-3 pr-10 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white transition"
              >
                {aidTypes.map((aid) => (
                  <option key={aid.value} value={aid.value}>
                    {aid.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Amount/Quantity *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                placeholder="Enter amount"
              />
              {limitInfo && (
                <p className="text-xs text-gray-400 mt-2">
                  Reference limit: {limitInfo.limit} units (all requests require admin approval)
                </p>
              )}
            </div>
          </div>

          {/* Family Information */}
          <div className="border-t border-[#4988C4]/30 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">👨‍👩‍👧‍👦 Family Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Family Size *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.familySize}
                  onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                  className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                  placeholder="Total members"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Children (under 18)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.childrenCount}
                  onChange={(e) => setFormData({ ...formData, childrenCount: e.target.value })}
                  className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Elders (60+)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.eldersCount}
                  onChange={(e) => setFormData({ ...formData, eldersCount: e.target.value })}
                  className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-[#4988C4]/30 pt-6">
            <h3 className="text-lg font-bold text-white mb-4">📞 Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                  placeholder="+92-XXX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-4 py-3 pr-10 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Address *
              </label>
              <textarea
                required
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
                placeholder="Enter your complete address"
              />
            </div>
          </div>

          {/* Special Needs */}
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Special Needs or Additional Information
            </label>
            <textarea
              rows="3"
              value={formData.specialNeeds}
              onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
              className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition"
              placeholder="Any medical conditions, disabilities, or special requirements..."
            />
          </div>

          {/* Info Message */}
          <div className="bg-[#0a1628] border border-[#629FAD]/30 rounded-xl p-5">
            <h3 className="font-bold text-white mb-3 flex items-center">
              <FontAwesomeIcon icon={faInfoCircle} className="text-[#629FAD] mr-2" />
              How Your Request Will Be Processed
            </h3>
            <ul className="text-gray-300 text-sm space-y-2 list-disc list-inside">
              <li>Your aid request will be reviewed by the admin</li>
              <li>If approved, you will receive the aid</li>
              <li>If rejected, you will be notified with a reason</li>
              <li>Check your "Aid Status" page to track your request</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/victim/dashboard')}
              className="flex-1 border-2 border-[#4988C4]/50 text-[#4988C4] py-3 rounded-lg hover:bg-[#4988C4]/20 transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#3a6fa0] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestAid;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuantityError, hasErrors } from '../../utils/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faBox, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const DonateItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    itemType: 'food',
    quantity: '',
    donationType: 'general',
    disasterId: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({
    quantity: '',
    disasterId: ''
  });
  
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddress, setShowAddress] = useState(false);

  const itemTypes = [
    { value: 'food', label: 'Food' },
    { value: 'clothes', label: 'Clothes' },
    { value: 'medical', label: 'Medical Supplies' },
    { value: 'shelter_materials', label: 'Shelter Materials' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (formData.donationType === 'specific') {
      fetchDisasters();
    }
  }, [formData.donationType]);

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'quantity') {
      setErrors(prev => ({ ...prev, quantity: getQuantityError(value, 'Quantity') }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    if (name === 'donationType') {
      setFormData(prev => ({ ...prev, [name]: value, disasterId: '' }));
      setErrors(prev => ({ ...prev, disasterId: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'disasterId') {
        setErrors(prev => ({ 
          ...prev, 
          disasterId: value ? '' : 'Please select a disaster'
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate fields
    const quantityError = getQuantityError(formData.quantity, 'Quantity');
    const disasterError = formData.donationType === 'specific' && !formData.disasterId 
      ? 'Please select a disaster to donate to' 
      : '';
    
    setErrors({
      quantity: quantityError,
      disasterId: disasterError
    });

    if (quantityError || disasterError) {
      setError('Please fix validation errors');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/donations/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          itemType: (formData.itemType || '').toUpperCase(),
          quantity: parseInt(formData.quantity),
          description: formData.description,
          disaster: formData.donationType === 'specific' ? formData.disasterId : undefined,
          donationType: formData.donationType === 'specific' ? 'SPECIFIC' : 'GENERAL'
        })
      });

      if (response.ok) {
        const result = await response.json();
        setShowAddress(true);
        // Show address information
        alert(`Thank you for your donation!\n\nPlease send the items to:\n${result.dropoffAddress || 'ResQ Collection Center\n123 Main Street\nIslamabad, 44000'}`);
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
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#5A7863]/30 shadow-lg">
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
              <h1 className="text-3xl font-bold mb-2 text-white">Donate Items</h1>
              <p className="text-gray-300 text-lg">Share essentials to help disaster-affected families</p>
            </div>
            <div className="text-7xl text-[#5A7863]/30">
              <FontAwesomeIcon icon={faBox} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#5A7863]/30">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Item Type *
            </label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 pr-10 border border-[#5A7863]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7863] bg-[#0a1628] text-white"
            >
              {itemTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.quantity ? 'border-red-500 focus:ring-red-400' : 'border-[#5A7863]/30 focus:ring-[#5A7863]'
              }`}
              placeholder="Enter quantity"
            />
            {errors.quantity && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#5A7863]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7863] bg-[#0a1628] text-white placeholder-gray-500"
              placeholder="Provide details about the items (condition, expiry date, etc.)..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Donation Type *
            </label>
            <select
              name="donationType"
              value={formData.donationType}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 pr-10 border border-[#5A7863]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A7863] bg-[#0a1628] text-white"
            >
              <option value="general">General Distribution</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {formData.donationType === 'specific' && (
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                Select Disaster *
              </label>
              <select
                name="disasterId"
                value={formData.disasterId}
                onChange={handleSelectChange}
                className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white ${
                  errors.disasterId ? 'border-red-500 focus:ring-red-400' : 'border-[#5A7863]/30 focus:ring-[#5A7863]'
                }`}
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {errors.disasterId && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.disasterId}</p>}
            </div>
          )}

          {/* Donation Summary */}
          <div className="bg-[#0a1628] rounded-xl p-6 border border-[#5A7863]/30">
            <h3 className="font-bold text-white mb-4 text-lg">📦 Donation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Item Type:</span>
                <span className="px-3 py-1 bg-[#5A7863]/30 text-[#90AB8B] rounded-full text-sm font-semibold border border-[#5A7863]/30">{itemTypes.find(i => i.value === formData.itemType)?.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Quantity:</span>
                <span className="text-xl font-bold text-[#90AB8B]">{formData.quantity || '0'} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-semibold">Distribution:</span>
                <span className="px-3 py-1 bg-[#4988C4]/30 text-[#4988C4] rounded-full text-sm font-semibold border border-[#4988C4]/30">{formData.donationType === 'general' ? 'General' : 'Specific'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 border-2 border-[#5A7863]/50 text-[#90AB8B] py-3 rounded-lg hover:bg-[#5A7863]/20 transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#5A7863] text-white py-3 rounded-lg hover:bg-[#4a6853] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
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
            <li>Our team will arrange pickup from your location</li>
            <li>Please ensure items are in good condition</li>
            <li>Food items should have valid expiry dates</li>
            <li>You will receive a confirmation once items are collected</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DonateItems;

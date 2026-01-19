import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getQuantityError, hasErrors } from '../../utils/validation';

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
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE');
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
      const response = await fetch('http://localhost:5000/api/donations/items', {
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
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header */}
      <div className="bg-[#5A7863] text-white py-12 px-4 mb-8 shadow-lg">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold mb-2 text-white">Donate Items</h1>
          <p className="text-[#EDEDCE]">Share essentials to help disaster-affected families get back on their feet</p>
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
              Item Type *
            </label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#5A7863] focus:ring-2 focus:ring-[#5A7863] focus:ring-opacity-20"
            >
              {itemTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.quantity ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#5A7863] focus:ring-[#5A7863] focus:ring-opacity-20'
              }`}
              placeholder="Enter quantity"
            />
            {errors.quantity && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#5A7863] focus:ring-2 focus:ring-[#5A7863] focus:ring-opacity-20"
              placeholder="Provide details about the items (condition, expiry date, etc.)..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Donation Type *
            </label>
            <select
              name="donationType"
              value={formData.donationType}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#5A7863] focus:ring-2 focus:ring-[#5A7863] focus:ring-opacity-20"
            >
              <option value="general">General Distribution</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {formData.donationType === 'specific' && (
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Select Disaster *
              </label>
              <select
                name="disasterId"
                value={formData.disasterId}
                onChange={handleSelectChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.disasterId ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#5A7863] focus:ring-[#5A7863] focus:ring-opacity-20'
                }`}
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {errors.disasterId && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.disasterId}</p>}
            </div>
          )}

          <div className="bg-[#EDEDCE] border-2 border-[#5A7863] rounded-xl p-6">
            <h3 className="font-bold text-[#0F2854] mb-4 text-lg">📦 Donation Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#296374] font-semibold">Item Type:</span>
                <span className="px-3 py-1 bg-[#5A7863] text-white rounded-full text-sm font-semibold">{itemTypes.find(i => i.value === formData.itemType)?.label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#296374] font-semibold">Quantity:</span>
                <span className="text-xl font-bold text-[#5A7863]">{formData.quantity || '0'} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#296374] font-semibold">Distribution:</span>
                <span className="px-3 py-1 bg-[#296374] text-white rounded-full text-sm font-semibold">{formData.donationType === 'general' ? 'General' : 'Specific'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#5A7863] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 bg-[#296374] text-white py-3 rounded-lg hover:shadow-lg hover:bg-[#3B4953] transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-[#EBF4DD] rounded-xl p-6 border-l-4 border-[#5A7863]">
          <p className="text-[#3B4953] text-sm">
            <span className="font-bold">Pickup:</span> Our team will arrange pickup from your location at your convenience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonateItems;

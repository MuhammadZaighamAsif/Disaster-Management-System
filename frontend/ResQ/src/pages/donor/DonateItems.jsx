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
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-forest">Donate Items</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Item Type *
            </label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            >
              {itemTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.quantity ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter quantity"
            />
            {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Provide details about the items..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Donation Type *
            </label>
            <select
              name="donationType"
              value={formData.donationType}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
            >
              <option value="general">General</option>
              <option value="specific">Specific Disaster</option>
            </select>
          </div>

          {formData.donationType === 'specific' && (
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Select Disaster *
              </label>
              <select
                name="disasterId"
                value={formData.disasterId}
                onChange={handleSelectChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.disasterId ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
              >
                <option value="">-- Choose a disaster --</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.city || disaster.location}
                  </option>
                ))}
              </select>
              {errors.disasterId && <p className="text-red-600 text-xs mt-1">{errors.disasterId}</p>}
            </div>
          )}

          <div className="bg-sage bg-opacity-20 border border-sage rounded-lg p-4">
            <h3 className="font-semibold text-forest mb-2">Donation Summary</h3>
            <p className="text-charcoal">
              Items: <strong>{itemTypes.find(i => i.value === formData.itemType)?.label}</strong>
            </p>
            <p className="text-charcoal">
              Quantity: <strong>{formData.quantity || '0'}</strong>
            </p>
            <p className="text-charcoal">
              Type: <strong>{formData.donationType === 'general' ? 'General' : 'Specific Disaster'}</strong>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-forest text-white py-3 rounded-lg hover:bg-charcoal transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Confirm Donation'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 bg-sage text-white py-3 rounded-lg hover:bg-forest transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DonateItems;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBedsError, getContactPhoneError, getCityError, getAddressError, hasErrors } from '../../utils/validation';

const OfferShelter = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    beds: '',
    name: '',
    address: '',
    city: '',
    disasterId: '',
    contactPhone: '',
    additionalInfo: ''
  });
  
  const [errors, setErrors] = useState({
    beds: '',
    name: '',
    address: '',
    city: '',
    disasterId: '',
    contactPhone: ''
  });
  
  const [disasters, setDisasters] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    fetchDisasters();
  }, []);

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
    if (name === 'beds') {
      setErrors(prev => ({ ...prev, beds: getBedsError(value) }));
    } else if (name === 'name') {
      if (!value) {
        setErrors(prev => ({ ...prev, name: 'Shelter/Your name is required' }));
      } else if (value.length < 2) {
        setErrors(prev => ({ ...prev, name: 'Name must be at least 2 characters' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    } else if (name === 'address') {
      setErrors(prev => ({ ...prev, address: getAddressError(value) }));
    } else if (name === 'city') {
      setErrors(prev => ({ ...prev, city: getCityError(value) }));
    } else if (name === 'contactPhone') {
      setErrors(prev => ({ ...prev, contactPhone: getContactPhoneError(value) }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'disasterId') {
      setErrors(prev => ({
        ...prev,
        disasterId: value ? '' : 'Please select a disaster'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const newErrors = {
      beds: getBedsError(formData.beds),
      name: !formData.name ? 'Name is required' : formData.name.length < 2 ? 'Name must be at least 2 characters' : '',
      address: getAddressError(formData.address),
      city: getCityError(formData.city),
      contactPhone: getContactPhoneError(formData.contactPhone),
      disasterId: !formData.disasterId ? 'Please select a disaster' : ''
    };
    
    setErrors(newErrors);
    
    if (hasErrors(newErrors)) {
      setError('Please fix all validation errors');
      return;
    }

    if (!agreedToTerms) {
      setShowAgreement(true);
      setError('Please confirm the shelter agreement');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/shelters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bedsAvailable: parseInt(formData.beds),
          shelterName: formData.name,
          address: formData.address,
          city: formData.city,
          disaster: formData.disasterId,
          contactPhone: formData.contactPhone,
          additionalInfo: formData.additionalInfo
        })
      });

      if (response.ok) {
        alert('Thank you for offering shelter to disaster victims!');
        navigate('/donor/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to register shelter');
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
        <h1 className="text-4xl font-bold mb-8 text-forest">Offer Shelter</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Number of Beds Available *
            </label>
            <input
              type="number"
              name="beds"
              min="1"
              value={formData.beds}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.beds ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter number of beds"
            />
            {errors.beds && <p className="text-red-600 text-xs mt-1">{errors.beds}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Shelter/Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter your name or shelter name"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Shelter Address *
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.address ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter complete address where victims can stay"
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.contactPhone ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="+92-XXX-XXXXXXX"
            />
            {errors.contactPhone && <p className="text-red-600 text-xs mt-1">{errors.contactPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.city ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter city name"
            />
            {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
          </div>

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

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              rows="3"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="Any special requirements or facilities available..."
            />
          </div>

          {/* Shelter Agreement */}
          <div className="bg-sage bg-opacity-20 border border-sage rounded-lg p-4">
            <h3 className="font-semibold text-forest mb-3">Shelter Agreement</h3>
            <div className="text-sm text-charcoal space-y-2 mb-4">
              <p>By offering shelter, you agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide safe and clean accommodation</li>
                <li>Respect the privacy and dignity of victims</li>
                <li>Allow ResQ to verify the shelter conditions</li>
                <li>Not discriminate based on any grounds</li>
                <li>Provide basic amenities (water, sanitation)</li>
              </ul>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setShowAgreement(false);
                  setError('');
                }}
                className="w-4 h-4 text-forest border-forest rounded focus:ring-sage"
              />
              <span className="text-sm text-charcoal">
                I agree to the shelter terms and conditions
              </span>
            </label>
          </div>

          <div className="bg-sage bg-opacity-20 border border-sage rounded-lg p-4">
            <h3 className="font-semibold text-forest mb-2">Shelter Summary</h3>
            <p className="text-charcoal">
              Beds: <strong>{formData.beds || '0'}</strong>
            </p>
            <p className="text-charcoal">
              Location: <strong>{formData.address || 'Not provided'}</strong>
            </p>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-forest text-white py-3 rounded-lg hover:bg-charcoal transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Confirm Shelter Offer'}
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

export default OfferShelter;

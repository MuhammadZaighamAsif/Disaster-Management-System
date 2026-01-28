import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getBedsError, getContactPhoneError, getCityError, getAddressError, hasErrors } from '../../utils/validation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faHome, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/shelters`, {
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
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4 max-w-8xl">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
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
              <h1 className="text-3xl font-bold mb-2 text-white">Offer Shelter</h1>
              <p className="text-gray-300 text-lg">Provide safe haven for families displaced by disaster</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHome} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#629FAD]/30">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Number of Beds Available *
            </label>
            <input
              type="number"
              name="beds"
              min="1"
              value={formData.beds}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.beds ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
              }`}
              placeholder="Enter number of beds"
            />
            {errors.beds && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.beds}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Shelter/Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.name ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
              }`}
              placeholder="Enter your name or shelter name"
            />
            {errors.name && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Shelter Address *
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.address ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
              }`}
              placeholder="Enter complete address where victims can stay"
            />
            {errors.address && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.contactPhone ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
              }`}
              placeholder="+92-XXX-XXXXXXX"
            />
            {errors.contactPhone && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.contactPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white placeholder-gray-500 ${
                errors.city ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
              }`}
              placeholder="Enter city name"
            />
            {errors.city && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Select Disaster *
            </label>
            <select
              name="disasterId"
              value={formData.disasterId}
              onChange={handleSelectChange}
              className={`w-full px-4 py-3 pr-10 border rounded-lg focus:outline-none focus:ring-2 transition bg-[#0a1628] text-white ${
                errors.disasterId ? 'border-red-500 focus:ring-red-400' : 'border-[#629FAD]/30 focus:ring-[#629FAD]'
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

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              rows="3"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#629FAD]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#629FAD] bg-[#0a1628] text-white placeholder-gray-500"
              placeholder="Any special requirements or facilities available (parking, kitchen access, etc.)..."
            />
          </div>

          {/* Shelter Agreement */}
          <div className="bg-[#0a1628] border border-[#629FAD]/30 rounded-xl p-6">
            <h3 className="font-bold text-white mb-3 text-lg">Shelter Agreement</h3>
            <div className="text-sm text-gray-300 space-y-2 mb-4">
              <p className="font-semibold text-white">By offering shelter, you agree to:</p>
              <ul className="list-none space-y-2 ml-0">
                <li className="flex items-start">
                  <span className="text-[#629FAD] mr-3 font-bold">•</span>
                  <span>Provide safe and clean accommodation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#629FAD] mr-3 font-bold">•</span>
                  <span>Respect the privacy and dignity of victims</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#629FAD] mr-3 font-bold">•</span>
                  <span>Allow ResQ to verify the shelter conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#629FAD] mr-3 font-bold">•</span>
                  <span>Not discriminate based on any grounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#629FAD] mr-3 font-bold">•</span>
                  <span>Provide basic amenities (water, sanitation)</span>
                </li>
              </ul>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer bg-[#0F2854]/60 rounded-lg p-4 border border-[#629FAD]/30 hover:border-[#629FAD] transition">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  setShowAgreement(false);
                  setError('');
                }}
                className="w-5 h-5 text-[#629FAD] border-[#629FAD] rounded focus:ring-[#629FAD] cursor-pointer"
              />
              <span className="text-sm text-gray-300 font-semibold">
                I agree to the shelter terms and conditions
              </span>
            </label>
          </div>

          {/* Shelter Summary */}
          <div className="bg-[#0a1628] rounded-xl p-6 border border-[#629FAD]/30">
            <h3 className="font-bold text-white mb-4 text-lg">🏡 Shelter Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#0F2854]/40 rounded-lg p-3">
                <span className="font-semibold text-gray-400">Number of Beds:</span>
                <span className="font-bold text-xl text-[#629FAD]">{formData.beds || '0'}</span>
              </div>
              <div className="flex justify-between items-center bg-[#0F2854]/40 rounded-lg p-3">
                <span className="font-semibold text-gray-400">Location:</span>
                <span className="font-bold text-white">{formData.city || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/donor/dashboard')}
              className="flex-1 border-2 border-[#629FAD]/50 text-[#629FAD] py-3 rounded-lg hover:bg-[#629FAD]/20 transition duration-300 font-bold uppercase tracking-wide"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#629FAD] text-white py-3 rounded-lg hover:bg-[#4a8a98] hover:shadow-lg transition duration-300 font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Confirm Shelter Offer'}
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-8 bg-[#0F2854]/60 backdrop-blur-md rounded-xl p-6 border border-[#629FAD]/30">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center">
            <FontAwesomeIcon icon={faInfoCircle} className="text-xl mr-3 text-[#629FAD]" />
            Thank You
          </h3>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>Your willingness to help shows great compassion</li>
            <li>We'll contact you shortly to verify the details</li>
            <li>Victims will be matched based on your location</li>
            <li>You can update availability anytime from dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OfferShelter;

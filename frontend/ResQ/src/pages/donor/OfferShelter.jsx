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
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header */}
      <div className="bg-[#629FAD] text-white py-12 px-4 mb-8 shadow-lg">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold mb-2 text-white">Offer Shelter</h1>
          <p className="text-[#EDEDCE]">Provide safe haven for families displaced by disaster</p>
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
              Number of Beds Available *
            </label>
            <input
              type="number"
              name="beds"
              min="1"
              value={formData.beds}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.beds ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
              }`}
              placeholder="Enter number of beds"
            />
            {errors.beds && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.beds}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Shelter/Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
              }`}
              placeholder="Enter your name or shelter name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Shelter Address *
            </label>
            <textarea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
              }`}
              placeholder="Enter complete address where victims can stay"
            />
            {errors.address && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.address}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Contact Phone *
            </label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.contactPhone ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
              }`}
              placeholder="+92-XXX-XXXXXXX"
            />
            {errors.contactPhone && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.contactPhone}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              City *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
              }`}
              placeholder="Enter city name"
            />
            {errors.city && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Select Disaster *
            </label>
            <select
              name="disasterId"
              value={formData.disasterId}
              onChange={handleSelectChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.disasterId ? 'border-red-500 focus:border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#629FAD] focus:ring-[#629FAD] focus:ring-opacity-20'
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

          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Additional Information
            </label>
            <textarea
              name="additionalInfo"
              rows="3"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:border-[#629FAD] focus:ring-2 focus:ring-[#629FAD] focus:ring-opacity-20"
              placeholder="Any special requirements or facilities available (parking, kitchen access, etc.)..."
            />
          </div>

          {/* Shelter Agreement */}
          <div className="bg-[#EDEDCE] border-2 border-[#629FAD] rounded-xl p-6">
            <h3 className="font-bold text-[#0F2854] mb-3 text-lg">Shelter Agreement</h3>
            <div className="text-sm text-[#3B4953] space-y-2 mb-4">
              <p className="font-semibold text-[#0F2854]">By offering shelter, you agree to:</p>
              <ul className="list-none space-y-2 ml-0">
                <li className="flex items-start">
                  <span className="text-[#4988C4] mr-3 font-bold">•</span>
                  <span>Provide safe and clean accommodation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4988C4] mr-3 font-bold">•</span>
                  <span>Respect the privacy and dignity of victims</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4988C4] mr-3 font-bold">•</span>
                  <span>Allow ResQ to verify the shelter conditions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4988C4] mr-3 font-bold">•</span>
                  <span>Not discriminate based on any grounds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#4988C4] mr-3 font-bold">•</span>
                  <span>Provide basic amenities (water, sanitation)</span>
                </li>
              </ul>
            </div>
            <label className="flex items-center space-x-3 cursor-pointer bg-white rounded-lg p-4 border-2 border-[#EBF4DD] hover:border-[#629FAD] transition">
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
              <span className="text-sm text-[#3B4953] font-semibold">
                I agree to the shelter terms and conditions
              </span>
            </label>
          </div>

          <div className="bg-[#629FAD] rounded-xl p-6 text-black">
            <h3 className="font-bold mb-4 text-lg">🏡 Shelter Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white bg-opacity-20 rounded-lg p-3">
                <span className="font-semibold">Number of Beds:</span>
                <span className="font-bold text-xl">{formData.beds || '0'}</span>
              </div>
              <div className="flex justify-between items-center bg-white bg-opacity-20 rounded-lg p-3">
                <span className="font-semibold">Location:</span>
                <span className="font-bold">{formData.city || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#629FAD] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Confirm Shelter Offer'}
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
        <div className="mt-8 bg-[#EBF4DD] rounded-xl p-6 border-l-4 border-[#629FAD]">
          <p className="text-[#3B4953] text-sm">
            <span className="font-bold">🙏 Thank You:</span> Your willingness to help during difficult times shows compassion and community spirit. We'll contact you shortly to verify and finalize the details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfferShelter;

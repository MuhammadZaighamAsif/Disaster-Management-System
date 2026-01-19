import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDisasterNameError,
  getLocationError,
  getCityError,
  getDescriptionError,
  validateAreaCode,
  validateReportDisasterForm,
  hasErrors
} from '../../utils/validation';

const ReportDisaster = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'FLOOD',
    location: '',
    city: '',
    areaCode: '',
    severity: 'MEDIUM',
    description: '',
    requiredResources: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    location: '',
    city: '',
    areaCode: '',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: getDisasterNameError(value) }));
    } else if (name === 'location') {
      setErrors(prev => ({ ...prev, location: getLocationError(value) }));
    } else if (name === 'city') {
      setErrors(prev => ({ ...prev, city: getCityError(value) }));
    } else if (name === 'description') {
      setErrors(prev => ({ ...prev, description: getDescriptionError(value) }));
    } else if (name === 'areaCode') {
      if (value && !validateAreaCode(value)) {
        setErrors(prev => ({ ...prev, areaCode: 'Area code must be 5 digits' }));
      } else {
        setErrors(prev => ({ ...prev, areaCode: '' }));
      }
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all required fields
    const validationErrors = validateReportDisasterForm(formData);
    
    if (formData.areaCode && !validateAreaCode(formData.areaCode)) {
      validationErrors.areaCode = 'Area code must be 5 digits';
    }
    
    setErrors(validationErrors);
    
    if (hasErrors(validationErrors)) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disasters/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Disaster reported successfully! It will be reviewed by an admin.');
        navigate(-1); // Go back to previous page
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to report disaster');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error reporting disaster:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-[#0F2854] text-white px-8 py-8 rounded-2xl shadow-xl mb-8">
          <h1 className="text-4xl font-bold">Report Disaster</h1>
          <p className="text-[#BDE8F5] mt-2">Help us respond faster by reporting emergencies</p>
        </div>

        <div className="bg-[#90AB8B] bg-opacity-20 border-2 border-[#90AB8B] text-[#3B4953] px-6 py-4 rounded-xl mb-6 shadow-md">
          <p className="font-semibold text-lg">Note:</p>
          <p className="mt-2">Your report will be reviewed by an admin before being added to the system.</p>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-4 font-semibold shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-[#EDEDCE]">
          <div>
            <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
              Disaster Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] ${
                errors.name ? 'border-red-500 focus:ring-red-400' : 'border-[#90AB8B] focus:ring-[#4988C4]'
              }`}
              placeholder="e.g., Flood in Islamabad"
            />
            {errors.name && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
              Disaster Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#EBF4DD] text-[#3B4953] font-medium transition duration-300"
            >
              <option value="EARTHQUAKE">Earthquake</option>
              <option value="FLOOD">Flood</option>
              <option value="FIRE">Fire</option>
              <option value="HURRICANE">Hurricane</option>
              <option value="TORNADO">Tornado</option>
              <option value="LANDSLIDE">Landslide</option>
              <option value="TSUNAMI">Tsunami</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                Location/Address *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] ${
                  errors.location ? 'border-red-500 focus:ring-red-400' : 'border-[#90AB8B] focus:ring-[#4988C4]'
                }`}
                placeholder="Specific location"
              />
              {errors.location && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] ${
                  errors.city ? 'border-red-500 focus:ring-red-400' : 'border-[#90AB8B] focus:ring-[#4988C4]'
                }`}
                placeholder="e.g., Islamabad"
              />
              {errors.city && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                Area Code *
              </label>
              <input
                type="text"
                name="areaCode"
                value={formData.areaCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] ${
                  errors.areaCode ? 'border-red-500 focus:ring-red-400' : 'border-[#90AB8B] focus:ring-[#4988C4]'
                }`}
                placeholder="e.g., 44000"
              />
              {errors.areaCode && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.areaCode}</p>}
            </div>

            <div>
              <label className="block text-sm 854] mb-2 font-semibold">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#EBF4DD] text-[#3B4953] font-medium transition duration-300"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] ${
                errors.description ? 'border-red-500 focus:ring-red-400' : 'border-[#90AB8B] focus:ring-[#4988C4]'
              }`}
              placeholder="Describe the disaster situation in detail..."
            />
            {errors.description && <p className="text-red-600 text-xs mt-2 font-semibold">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
              Required Resources
            </label>
            <textarea
              name="requiredResources"
              rows="3"
              value={formData.requiredResources}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#EBF4DD] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
              placeholder="What resources are needed? (food, shelter, medical supplies, etc.)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#1C4D8D] transition duration-300 hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 font-semibold shadow-md"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#90AB8B] text-white py-3 rounded-lg hover:bg-[#5A7863] transition duration-300 hover:scale-105 font-semibold shadow-md"
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDisaster;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faInfoCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/disasters/report`, {
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
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4 max-w-8xl">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-red-500/30 shadow-lg">
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
              <h1 className="text-3xl font-bold mb-2 text-white">Report Disaster</h1>
              <p className="text-gray-300 text-lg">Help us respond faster by reporting emergencies</p>
            </div>
            <div className="text-7xl text-red-500/30">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md border border-[#629FAD]/30 text-gray-300 px-6 py-4 rounded-xl mb-6 shadow-lg">
          <div className="flex items-start gap-3">
            <FontAwesomeIcon icon={faInfoCircle} className="text-[#629FAD] text-xl mt-0.5" />
            <div>
              <p className="font-semibold text-white">Note:</p>
              <p className="mt-1 text-gray-400">Your report will be reviewed by an admin before being added to the system.</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-6 backdrop-blur-md font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl shadow-lg p-8 space-y-6 border border-[#4988C4]/30">
          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Disaster Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#0a1628] text-white placeholder-gray-500 ${errors.name ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4]'
                }`}
              placeholder="e.g., Flood in Islamabad"
            />
            {errors.name && <p className="text-red-400 text-xs mt-2 font-semibold">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Disaster Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white font-medium transition duration-300"
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
              <label className="block text-sm text-gray-300 mb-2 font-semibold">
                Location/Address *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#0a1628] text-white placeholder-gray-500 ${errors.location ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4]'
                  }`}
                placeholder="Specific location"
              />
              {errors.location && <p className="text-red-400 text-xs mt-2 font-semibold">{errors.location}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-semibold">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#0a1628] text-white placeholder-gray-500 ${errors.city ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4]'
                  }`}
                placeholder="e.g., Islamabad"
              />
              {errors.city && <p className="text-red-400 text-xs mt-2 font-semibold">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2 font-semibold">
                Area Code *
              </label>
              <input
                type="text"
                name="areaCode"
                value={formData.areaCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#0a1628] text-white placeholder-gray-500 ${errors.areaCode ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4]'
                  }`}
                placeholder="e.g., 44000"
              />
              {errors.areaCode && <p className="text-red-400 text-xs mt-2 font-semibold">{errors.areaCode}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2 font-semibold">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white font-medium transition duration-300"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-300 bg-[#0a1628] text-white placeholder-gray-500 ${errors.description ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4]'
                }`}
              placeholder="Describe the disaster situation in detail..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-2 font-semibold">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2 font-semibold">
              Required Resources
            </label>
            <textarea
              name="requiredResources"
              rows="3"
              value={formData.requiredResources}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[#4988C4]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#0a1628] text-white placeholder-gray-500 transition duration-300"
              placeholder="What resources are needed? (food, shelter, medical supplies, etc.)"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#296374] transition duration-300 transform hover:scale-[1.02] disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100 font-semibold shadow-lg"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-[#0F2854]/60 border border-[#629FAD]/30 text-white py-3 rounded-lg hover:bg-[#629FAD]/20 transition duration-300 transform hover:scale-[1.02] font-semibold shadow-lg"
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

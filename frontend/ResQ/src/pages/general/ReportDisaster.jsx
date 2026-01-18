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
    <div className="min-h-screen bg-cream py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-forest">Report Disaster</h1>

        <div className="bg-sage bg-opacity-20 border border-sage text-forest px-4 py-3 rounded mb-6">
          <p className="font-semibold">Note:</p>
          <p>Your report will be reviewed by an admin before being added to the system.</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Disaster Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.name ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="e.g., Flood in Islamabad"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Disaster Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
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
              <label className="block text-sm font-medium text-forest mb-2">
                Location/Address *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.location ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
                placeholder="Specific location"
              />
              {errors.location && <p className="text-red-600 text-xs mt-1">{errors.location}</p>}
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
                placeholder="e.g., Islamabad"
              />
              {errors.city && <p className="text-red-600 text-xs mt-1">{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Area Code *
              </label>
              <input
                type="text"
                name="areaCode"
                value={formData.areaCode}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.areaCode ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
                placeholder="e.g., 44000"
              />
              {errors.areaCode && <p className="text-red-600 text-xs mt-1">{errors.areaCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-forest mb-2">
                Severity *
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Description *
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.description ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Describe the disaster situation in detail..."
            />
            {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-forest mb-2">
              Required Resources
            </label>
            <textarea
              name="requiredResources"
              rows="3"
              value={formData.requiredResources}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              placeholder="What resources are needed? (food, shelter, medical supplies, etc.)"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || hasErrors(errors)}
              className="flex-1 bg-forest text-white py-3 rounded-lg hover:bg-charcoal transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
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

export default ReportDisaster;

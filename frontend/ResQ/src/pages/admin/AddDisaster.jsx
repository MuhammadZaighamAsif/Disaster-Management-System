import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {
  getDisasterNameError,
  getLocationError,
  getCityError,
  getDescriptionError,
  validateDisasterForm,
  hasErrors
} from '../../utils/validation';

const AddDisaster = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'FLOOD',
    location: '',
    city: '',
    description: '',
    severity: 'MEDIUM',
    status: 'ACTIVE',
    occurredAt: new Date().toISOString().slice(0, 16),
    affectedAreas: '',
    estimatedVictims: '',
    requiredResources: ''
  });
  
  const [errors, setErrors] = useState({
    name: '',
    location: '',
    city: '',
    description: '',
    estimatedVictims: ''
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
    } else if (name === 'estimatedVictims') {
      if (value) {
        if (isNaN(value) || Number(value) < 0) {
          setErrors(prev => ({ ...prev, estimatedVictims: 'Estimated victims must be a positive number' }));
        } else {
          setErrors(prev => ({ ...prev, estimatedVictims: '' }));
        }
      } else {
        setErrors(prev => ({ ...prev, estimatedVictims: '' }));
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
    const validationErrors = validateDisasterForm(formData);
    setErrors(validationErrors);
    
    if (hasErrors(validationErrors)) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        estimatedVictims: formData.estimatedVictims ? parseInt(formData.estimatedVictims) : null
      };

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/disasters`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Disaster added successfully!');
        navigate('/admin/disasters/manage');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to add disaster');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error adding disaster:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#5A7863]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Add New Disaster</h1>
              <p className="text-gray-300 text-lg">Create a new disaster entry in the system</p>
            </div>
            <div className="text-7xl text-[#5A7863]/30">
              <FontAwesomeIcon icon={faPlus} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md">
            {error}
          </div>
        )}

        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 shadow-lg p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Disaster Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#0a1628]/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4] focus:border-[#4988C4]'
                }`}
                placeholder="e.g., Flood in Islamabad"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Disaster Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
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

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Severity *
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Location/Address *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#0a1628]/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${
                    errors.location ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4] focus:border-[#4988C4]'
                  }`}
                  placeholder="Specific location"
                />
                {errors.location && <p className="text-red-400 text-xs mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#0a1628]/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${
                    errors.city ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4] focus:border-[#4988C4]'
                  }`}
                  placeholder="e.g., Islamabad"
                />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Occurred At *
                </label>
                <input
                  type="datetime-local"
                  name="occurredAt"
                  value={formData.occurredAt}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Estimated Victims
                </label>
                <input
                  type="number"
                  name="estimatedVictims"
                  min="0"
                  value={formData.estimatedVictims}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#0a1628]/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${
                    errors.estimatedVictims ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4] focus:border-[#4988C4]'
                  }`}
                  placeholder="Approximate number"
                />
                {errors.estimatedVictims && <p className="text-red-400 text-xs mt-1">{errors.estimatedVictims}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Description *
              </label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-[#0a1628]/50 border rounded-xl focus:outline-none focus:ring-2 text-white placeholder-gray-500 ${
                  errors.description ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:ring-[#4988C4] focus:border-[#4988C4]'
                }`}
                placeholder="Describe the disaster situation..."
              />
              {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Affected Areas
              </label>
              <input
                type="text"
                name="affectedAreas"
                value={formData.affectedAreas}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                placeholder="e.g., Sector F-10, G-11"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Required Resources
              </label>
              <textarea
                name="requiredResources"
                rows="3"
                value={formData.requiredResources}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                placeholder="Food, shelter, medical supplies, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
              >
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Active</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading || hasErrors(errors)}
                className="flex-1 bg-[#5A7863] cursor-pointer text-white py-3 rounded-xl hover:bg-[#5A7863]/80 transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-[#5A7863]/20 border border-[#5A7863]/50"
              >
                {loading ? 'Adding...' : 'Add Disaster'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 bg-[#629FAD]/20 text-[#629FAD] py-3 cursor-pointer rounded-xl hover:bg-[#629FAD]/30 transition-all duration-300 font-semibold border border-[#629FAD]/50 flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDisaster;

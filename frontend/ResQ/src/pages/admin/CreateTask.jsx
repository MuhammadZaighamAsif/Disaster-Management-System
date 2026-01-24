import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faArrowLeft, faExclamationTriangle, faCircleCheck, faLightbulb, faClock } from '@fortawesome/free-solid-svg-icons';

const CreateTask = () => {
  const navigate = useNavigate();
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    taskType: 'FOOD_DISTRIBUTION',
    fieldType: 'ON_FIELD',
    priority: 'MEDIUM',
    volunteersRequired: 1,
    location: '',
    disaster: '',
    estimatedDuration: '',
  });

  useEffect(() => {
    fetchDisasters();
  }, []);

  const fetchDisasters = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/disasters?status=ACTIVE', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setDisasters(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching disasters:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        title: formData.title,
        description: formData.description,
        taskType: formData.taskType,
        fieldType: formData.fieldType,
        priority: formData.priority,
        volunteersRequired: parseInt(formData.volunteersRequired),
        location: formData.location,
        estimatedDuration: formData.estimatedDuration ? parseFloat(formData.estimatedDuration) : undefined,
      };

      if (formData.disaster) {
        payload.disaster = formData.disaster;
      }

      const response = await fetch('http://localhost:5000/api/volunteers/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Task created successfully!');
        // Reset form
        setFormData({
          title: '',
          description: '',
          taskType: 'FOOD_DISTRIBUTION',
          fieldType: 'ON_FIELD',
          priority: 'MEDIUM',
          volunteersRequired: 1,
          location: '',
          disaster: '',
          estimatedDuration: '',
        });
        
        setTimeout(() => {
          navigate('/admin/dashboard');
        }, 2000);
      } else {
        setError(result.message || 'Failed to create task');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Admin Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Create Volunteer Task</h1>
              <p className="text-gray-300 text-lg">Create tasks for volunteers to coordinate relief efforts</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faListCheck} />
            </div>
          </div>
        </div>

        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 shadow-lg p-8 mb-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
              <FontAwesomeIcon icon={faCircleCheck} />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Task Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                placeholder="e.g., Distribute food packages to families"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={5}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                placeholder="Detailed description of the task..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Task Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Task Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
                >
                  <option value="RESCUE">Rescue</option>
                  <option value="MEDICAL">Medical</option>
                  <option value="FOOD_DISTRIBUTION">Food Distribution</option>
                  <option value="SHELTER_SETUP">Shelter Setup</option>
                  <option value="COORDINATION">Coordination</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Field Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Field Type <span className="text-red-400">*</span>
                </label>
                <select
                  name="fieldType"
                  value={formData.fieldType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
                >
                  <option value="ON_FIELD">On-Field (Physical presence required)</option>
                  <option value="OFF_FIELD">Off-Field (Remote/Coordination)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Priority <span className="text-red-400">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Volunteers Required */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Volunteers Required <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="volunteersRequired"
                  value={formData.volunteersRequired}
                  onChange={handleChange}
                  required
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                  placeholder="e.g., Relief Camp A, Sector 5"
                />
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <FontAwesomeIcon icon={faClock} className="text-[#629FAD]" />
                  Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min={0}
                  step={0.5}
                  className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white placeholder-gray-500"
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            {/* Disaster */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                Related Disaster (Optional)
              </label>
              <select
                name="disaster"
                value={formData.disaster}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-[#4988C4] text-white"
              >
                <option value="">No specific disaster</option>
                {disasters.map((disaster) => (
                  <option key={disaster._id} value={disaster._id}>
                    {disaster.name} - {disaster.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Info Box */}
            <div className="bg-[#0a1628]/50 border border-[#5A7863]/30 rounded-xl p-6">
              <div className="flex gap-4">
                <div className="text-3xl text-[#5A7863]">
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div>
                  <p className="font-bold text-white mb-3 text-lg">Task Creation Tips:</p>
                  <ul className="space-y-2 text-gray-400 font-medium">
                    <li>• On-field tasks require physical presence at the disaster site</li>
                    <li>• Off-field tasks can be done remotely (e.g., coordination, data entry)</li>
                    <li>• Set appropriate volunteer limits based on task complexity</li>
                    <li>• Use URGENT priority for time-critical tasks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-[#4988C4]/20">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#4988C4] hover:bg-[#4988C4]/80 text-white py-4 rounded-xl transition-all duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed font-bold text-lg shadow-lg hover:shadow-[#4988C4]/20 border border-[#4988C4]/50"
              >
                {loading ? 'Creating Task...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 bg-[#629FAD]/20 text-[#629FAD] py-4 rounded-xl hover:bg-[#629FAD]/30 transition-all duration-300 font-bold text-lg border border-[#629FAD]/50 flex items-center justify-center gap-2"
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

export default CreateTask;

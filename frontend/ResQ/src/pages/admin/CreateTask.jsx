import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="text-[#BDE8F5] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Create Volunteer Task</h1>
          <p className="text-[#BDE8F5]">Create tasks for volunteers to coordinate relief efforts</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mb-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-l-4 border-[#4988C4]">
          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-4 rounded-xl mb-6 font-semibold">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border-2 border-green-500 text-green-700 px-6 py-4 rounded-xl mb-6 font-semibold">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                Task Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength={200}
                className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent"
                placeholder="e.g., Distribute food packages to families"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                Description <span className="text-red-600">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                maxLength={1000}
                rows={5}
                className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent"
                placeholder="Detailed description of the task..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Task Type */}
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  Task Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="taskType"
                  value={formData.taskType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent bg-white"
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
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  Field Type <span className="text-red-600">*</span>
                </label>
                <select
                  name="fieldType"
                  value={formData.fieldType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent bg-white"
                >
                  <option value="ON_FIELD">On-Field (Physical presence required)</option>
                  <option value="OFF_FIELD">💻 Off-Field (Remote/Coordination)</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  Priority <span className="text-red-600">*</span>
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent bg-white"
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Volunteers Required */}
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  Volunteers Required <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  name="volunteersRequired"
                  value={formData.volunteersRequired}
                  onChange={handleChange}
                  required
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent"
                  placeholder="e.g., Relief Camp A, Sector 5"
                />
              </div>

              {/* Estimated Duration */}
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                  ⏱️ Estimated Duration (hours)
                </label>
                <input
                  type="number"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min={0}
                  step={0.5}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent"
                  placeholder="e.g., 4"
                />
              </div>
            </div>

            {/* Disaster */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase">
                Related Disaster (Optional)
              </label>
              <select
                name="disaster"
                value={formData.disaster}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent bg-white"
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
            <div className="bg-[#EBF4DD] border-2 border-[#90AB8B] rounded-lg p-6">
              <div className="flex gap-4">
                <div className="text-3xl"></div>
                <div>
                  <p className="font-bold text-[#0F2854] mb-3 text-lg">Task Creation Tips:</p>
                  <ul className="space-y-2 text-[#296374] font-semibold">
                    <li>On-field tasks require physical presence at the disaster site</li>
                    <li>Off-field tasks can be done remotely (e.g., coordination, data entry)</li>
                    <li>Set appropriate volunteer limits based on task complexity</li>
                    <li>Use URGENT priority for time-critical tasks</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-[#EDEDCE]">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#4988C4] hover:bg-[#1C4D8D] text-white py-4 rounded-lg transition disabled:bg-gray-400 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? 'Creating Task...' : 'Create Task'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="flex-1 bg-[#90AB8B] hover:bg-[#5A7863] text-white py-4 rounded-lg transition font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
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

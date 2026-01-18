import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState({
    skills: '',
    workingHours: '',
    experience: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState(null);
  const [hasActiveTasks, setHasActiveTasks] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    fetchProfileAndTasks();
  }, []);

  const fetchProfileAndTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch profile
      const profileResponse = await fetch('http://localhost:5000/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const profileResult = await profileResponse.json();
      
      if (profileResponse.ok) {
        setProfile(profileResult.data);
        if (profileResult.data.volunteerRole) {
          setSelectedRole(profileResult.data.volunteerRole.toLowerCase());
        }
        if (profileResult.data.skills) {
          setAdditionalDetails(prev => ({ ...prev, skills: profileResult.data.skills }));
        }
        if (profileResult.data.workingHours) {
          setAdditionalDetails(prev => ({ ...prev, workingHours: profileResult.data.workingHours }));
        }
        if (profileResult.data.experience) {
          setAdditionalDetails(prev => ({ ...prev, experience: profileResult.data.experience }));
        }
      }

      // Check for active tasks
      const tasksResponse = await fetch('http://localhost:5000/api/volunteers/my-tasks?status=ASSIGNED', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const tasksResult = await tasksResponse.json();
      
      if (tasksResponse.ok) {
        const activeTasks = (tasksResult.data || []).filter(
          task => task.status === 'ASSIGNED' || task.status === 'IN_PROGRESS'
        );
        setHasActiveTasks(activeTasks.length > 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/volunteers/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          volunteerRole: selectedRole,
          skills: additionalDetails.skills,
          workingHours: additionalDetails.workingHours,
          experience: additionalDetails.experience
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Role selection saved successfully!');
        navigate('/volunteer/dashboard');
      } else {
        setError(result.message || 'Failed to save role selection');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8">Choose Your Volunteer Role</h1>

        {profile?.volunteerRole && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">Current Role: {profile.volunteerRole === 'ON-FIELD' ? 'On-Field Volunteer' : 'Off-Field Volunteer'}</p>
          </div>
        )}

        {hasActiveTasks && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="font-semibold">⚠️ You have active tasks</p>
            <p className="text-sm">You cannot change your role while you have active tasks. Please complete or cancel them first.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Your Role *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition" 
                     style={{ borderColor: selectedRole === 'on-field' ? '#2563eb' : '#d1d5db' }}>
                <input
                  type="radio"
                  name="role"
                  value="on-field"
                  checked={selectedRole === 'on-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-900">On-Field Volunteer</p>
                  <p className="text-sm text-gray-600">Work directly with affected people and provide assistance</p>
                </div>
              </label>

              <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
                     style={{ borderColor: selectedRole === 'off-field' ? '#2563eb' : '#d1d5db' }}>
                <input
                  type="radio"
                  name="role"
                  value="off-field"
                  checked={selectedRole === 'off-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="mr-3"
                />
                <div>
                  <p className="font-semibold text-gray-900">Off-Field Volunteer</p>
                  <p className="text-sm text-gray-600">Support from administrative and coordination tasks</p>
                </div>
              </label>
            </div>
          </div>

          {selectedRole && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <input
                  type="text"
                  value={additionalDetails.skills}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, skills: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., First Aid, Medical, Logistics"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Available Working Hours
                </label>
                <input
                  type="text"
                  value={additionalDetails.workingHours}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, workingHours: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Full-time, Part-time, Weekends only"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relevant Experience
                </label>
                <textarea
                  rows="3"
                  value={additionalDetails.experience}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, experience: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your relevant experience..."
                />
              </div>
            </>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading || !selectedRole || hasActiveTasks}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Confirm Role Selection'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/volunteer/dashboard')}
              className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChooseRole;

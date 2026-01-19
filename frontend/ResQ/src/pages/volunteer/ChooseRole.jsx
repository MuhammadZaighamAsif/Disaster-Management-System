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
      <div className="min-h-screen bg-[#EBF4DD] py-8 flex items-center justify-center">
        <div className="text-xl text-[#296374]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Choose Your Volunteer Role</h1>
          <p className="text-[#BDE8F5]">Select whether you'll work on-field or off-field</p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl mb-12">
        {profile?.volunteerRole && (
          <div className="bg-[#4988C4] border-l-4 border-[#1C4D8D] text-white px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold text-lg">Current Role: {profile.volunteerRole === 'ON-FIELD' ? 'On-Field Volunteer' : 'Off-Field Volunteer'}</p>
          </div>
        )}

        {hasActiveTasks && (
          <div className="bg-orange-100 border-l-4 border-orange-600 text-orange-800 px-6 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold text-lg">⚠️ You have active tasks</p>
            <p className="text-sm mt-1">You cannot change your role while you have active tasks. Please complete or cancel them first.</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-600 text-red-800 px-6 py-4 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-10 space-y-6">
          <div>
            <label className="block text-sm  text-[#0F2854] mb-4 font-semibold">
              Select Your Role 👷 *
            </label>
            <div className="space-y-3">
              <label className="flex items-center p-5 border-2 rounded-xl cursor-pointer transition transform hover:scale-102" 
                     style={{ borderColor: selectedRole === 'on-field' ? '#4988C4' : '#D1D5DB', backgroundColor: selectedRole === 'on-field' ? '#EBF9FF' : 'white' }}>
                <input
                  type="radio"
                  name="role"
                  value="on-field"
                  checked={selectedRole === 'on-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="mr-4 w-5 h-5"
                />
                <div>
                  <p className="font-bold text-[#0F2854] text-lg">On-Field Volunteer</p>
                  <p className="text-sm text-[#296374]">Work directly with affected people and provide assistance on-site</p>
                </div>
              </label>

              <label className="flex items-center p-5 border-2 rounded-xl cursor-pointer transition transform hover:scale-102"
                     style={{ borderColor: selectedRole === 'off-field' ? '#4988C4' : '#D1D5DB', backgroundColor: selectedRole === 'off-field' ? '#EBF9FF' : 'white' }}>
                <input
                  type="radio"
                  name="role"
                  value="off-field"
                  checked={selectedRole === 'off-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="mr-4 w-5 h-5"
                />
                <div>
                  <p className="font-bold text-[#0F2854] text-lg">💻 Off-Field Volunteer</p>
                  <p className="text-sm text-[#296374]">Support from administrative centers, coordination, and remote tasks</p>
                </div>
              </label>
            </div>
          </div>

          {selectedRole && (
            <>
              <div>
                <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                  Skills
                </label>
                <input
                  type="text"
                  value={additionalDetails.skills}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, skills: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#F9FDFB] text-[#0F2854]"
                  placeholder="e.g., First Aid, Medical, Logistics"
                />
              </div>

              <div>
                <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                  Available Working Hours
                </label>
                <input
                  type="text"
                  value={additionalDetails.workingHours}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, workingHours: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#F9FDFB] text-[#0F2854]"
                  placeholder="e.g., Full-time, Part-time, Weekends only"
                />
              </div>

              <div>
                <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                  📚 Relevant Experience
                </label>
                <textarea
                  rows="3"
                  value={additionalDetails.experience}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, experience: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] bg-[#F9FDFB] text-[#0F2854]"
                  placeholder="Describe your relevant experience..."
                />
              </div>
            </>
          )}

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || !selectedRole || hasActiveTasks}
              className="flex-1 bg-[#4988C4] text-white py-3 rounded-xl hover:bg-[#296374] transition disabled:bg-gray-400 font-bold shadow-md"
            >
              {loading ? 'Saving...' : 'Confirm Role Selection'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/volunteer/dashboard')}
              className="flex-1 bg-[#EDEDCE] text-[#0F2854] py-3 rounded-xl hover:bg-[#E0E1C7] transition font-bold shadow-md"
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

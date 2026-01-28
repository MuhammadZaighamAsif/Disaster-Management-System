import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullseye, 
  faArrowLeft, 
  faUserNurse, 
  faUserShield, 
  faExclamationTriangle, 
  faCheckCircle, 
  faSpinner,
  faClock,
  faTools,
  faBriefcase,
  faLaptop,
  faHandsHelping
} from '@fortawesome/free-solid-svg-icons';

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
  const [success, setSuccess] = useState('');
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
      const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/me`, {
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
      const tasksResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/volunteers/my-tasks?status=ASSIGNED`, {
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
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/volunteers/profile`, {
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
        setSuccess('Role selection saved successfully!');
        setTimeout(() => {
          navigate('/volunteer/dashboard');
        }, 1500);
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
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} className="text-4xl text-[#4988C4] animate-spin mb-4" />
          <p className="text-gray-400 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={() => navigate('/volunteer/dashboard')}
                className="text-gray-400 hover:text-white mb-4 flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                <span>Back to Dashboard</span>
              </button>
              <h1 className="text-3xl font-bold mb-2 text-white">Choose Your Role</h1>
              <p className="text-gray-300 text-lg">Select whether you'll work on-field or off-field</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30 hidden md:block">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
          </div>
        </div>

        {/* Current Role Display */}
        {profile?.volunteerRole && (
          <div className="bg-[#4988C4]/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-[#4988C4]/40 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#4988C4]/30 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon 
                  icon={profile.volunteerRole === 'ON-FIELD' ? faUserNurse : faUserShield} 
                  className="text-2xl text-[#4988C4]" 
                />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Current Role</p>
                <p className="text-xl font-bold text-white">
                  {profile.volunteerRole === 'ON-FIELD' ? 'On-Field Volunteer' : 'Off-Field Volunteer'}
                </p>
              </div>
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-400 text-xl ml-auto" />
            </div>
          </div>
        )}

        {/* Active Tasks Warning */}
        {hasActiveTasks && (
          <div className="bg-orange-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-orange-500/40 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-500/30 rounded-xl flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-orange-400" />
              </div>
              <div>
                <p className="text-orange-300 font-bold text-lg">You have active tasks</p>
                <p className="text-orange-200/80 text-sm mt-1">
                  You cannot change your role while you have active tasks. Please complete or cancel them first.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-red-500/40 shadow-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-400" />
              <p className="text-red-300 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 backdrop-blur-md rounded-2xl p-6 mb-6 border border-green-500/40 shadow-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-400" />
              <p className="text-green-300 font-medium">{success}</p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-6 border border-[#629FAD]/30 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <FontAwesomeIcon icon={faHandsHelping} className="text-[#4988C4]" />
              Select Your Role
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* On-Field Option */}
              <label 
                className={`relative cursor-pointer group ${hasActiveTasks ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="on-field"
                  checked={selectedRole === 'on-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="sr-only"
                />
                <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  selectedRole === 'on-field' 
                    ? 'bg-[#4988C4]/20 border-[#4988C4] shadow-lg shadow-[#4988C4]/20' 
                    : 'bg-[#0a1628]/50 border-[#629FAD]/30 hover:border-[#4988C4]/50 hover:bg-[#0a1628]/70'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'on-field' ? 'bg-[#4988C4]' : 'bg-[#4988C4]/20'
                    }`}>
                      <FontAwesomeIcon 
                        icon={faUserNurse} 
                        className={`text-2xl ${selectedRole === 'on-field' ? 'text-white' : 'text-[#4988C4]'}`} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">On-Field Volunteer</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Work directly with affected people and provide assistance on-site during disaster relief operations
                      </p>
                    </div>
                    {selectedRole === 'on-field' && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-[#4988C4] text-xl" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#4988C4]/20 text-[#4988C4] text-xs rounded-full">Field Work</span>
                    <span className="px-3 py-1 bg-[#4988C4]/20 text-[#4988C4] text-xs rounded-full">Direct Aid</span>
                    <span className="px-3 py-1 bg-[#4988C4]/20 text-[#4988C4] text-xs rounded-full">Rescue</span>
                  </div>
                </div>
              </label>

              {/* Off-Field Option */}
              <label 
                className={`relative cursor-pointer group ${hasActiveTasks ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="off-field"
                  checked={selectedRole === 'off-field'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  disabled={hasActiveTasks}
                  className="sr-only"
                />
                <div className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
                  selectedRole === 'off-field' 
                    ? 'bg-[#629FAD]/20 border-[#629FAD] shadow-lg shadow-[#629FAD]/20' 
                    : 'bg-[#0a1628]/50 border-[#629FAD]/30 hover:border-[#629FAD]/50 hover:bg-[#0a1628]/70'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${
                      selectedRole === 'off-field' ? 'bg-[#629FAD]' : 'bg-[#629FAD]/20'
                    }`}>
                      <FontAwesomeIcon 
                        icon={faLaptop} 
                        className={`text-2xl ${selectedRole === 'off-field' ? 'text-white' : 'text-[#629FAD]'}`} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-1">Off-Field Volunteer</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        Support from administrative centers, coordination, logistics, and remote assistance tasks
                      </p>
                    </div>
                    {selectedRole === 'off-field' && (
                      <FontAwesomeIcon icon={faCheckCircle} className="text-[#629FAD] text-xl" />
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-[#629FAD]/20 text-[#629FAD] text-xs rounded-full">Coordination</span>
                    <span className="px-3 py-1 bg-[#629FAD]/20 text-[#629FAD] text-xs rounded-full">Remote</span>
                    <span className="px-3 py-1 bg-[#629FAD]/20 text-[#629FAD] text-xs rounded-full">Admin</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Additional Details - Only show when role is selected */}
          {selectedRole && (
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-6 border border-[#629FAD]/30 shadow-lg animate-fadeIn">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <FontAwesomeIcon icon={faBriefcase} className="text-[#4988C4]" />
                Additional Details
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Skills */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                    <FontAwesomeIcon icon={faTools} className="text-[#4988C4]" />
                    Skills
                  </label>
                  <input
                    type="text"
                    value={additionalDetails.skills}
                    onChange={(e) => setAdditionalDetails({ ...additionalDetails, skills: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1628]/70 border border-[#629FAD]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-colors"
                    placeholder="e.g., First Aid, Medical, Logistics"
                  />
                </div>

                {/* Working Hours */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                    <FontAwesomeIcon icon={faClock} className="text-[#4988C4]" />
                    Available Working Hours
                  </label>
                  <input
                    type="text"
                    value={additionalDetails.workingHours}
                    onChange={(e) => setAdditionalDetails({ ...additionalDetails, workingHours: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0a1628]/70 border border-[#629FAD]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-colors"
                    placeholder="e.g., Full-time, Part-time, Weekends only"
                  />
                </div>
              </div>

              {/* Experience */}
              <div className="mt-6">
                <label className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[#4988C4]" />
                  Relevant Experience
                </label>
                <textarea
                  rows="4"
                  value={additionalDetails.experience}
                  onChange={(e) => setAdditionalDetails({ ...additionalDetails, experience: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a1628]/70 border border-[#629FAD]/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#4988C4] focus:ring-1 focus:ring-[#4988C4] transition-colors resize-none"
                  placeholder="Describe your relevant experience in disaster relief, volunteering, or related fields..."
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={loading || !selectedRole || hasActiveTasks}
              className="flex-1 bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-[#3a7ab5] hover:to-[#5490a0] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/20 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  Confirm Role Selection
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/volunteer/dashboard')}
              className="flex-1 sm:flex-none sm:px-8 bg-[#0F2854]/60 text-gray-300 py-4 px-6 rounded-xl font-bold text-lg border border-[#629FAD]/30 hover:bg-[#0F2854] hover:text-white transition-all duration-300"
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

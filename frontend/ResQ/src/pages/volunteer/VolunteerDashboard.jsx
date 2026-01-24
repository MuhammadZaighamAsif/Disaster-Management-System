import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faClipboardList, faMap, faPencil, faTriangleExclamation, faUserShield, faUserNurse, faHandsHelping, faUser } from '@fortawesome/free-solid-svg-icons';

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (response.ok) {
        setProfile(result.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = () => {
    if (!profile?.volunteerRole) return 'Not Set';
    return profile.volunteerRole === 'ON-FIELD' ? 'On-Field Volunteer' : 'Off-Field Volunteer';
  };

  const getRoleIcon = () => {
    if (!profile?.volunteerRole) return faBullseye;
    return profile.volunteerRole === 'ON-FIELD' ? faUserNurse : faUserShield;
  };

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Volunteer Dashboard</h1>
              <p className="text-gray-300 text-lg">Choose tasks, support victims, and make a real impact</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHandsHelping} />
            </div>
          </div>
        </div>

     

        {/* Role Display Card */}
        {!loading && (
          <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-6 mb-8 border border-[#4988C4]/30 shadow-lg">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-[#4988C4]/20 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={getRoleIcon()} className="text-3xl text-[#4988C4]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Your Volunteer Role</p>
                <p className="text-2xl font-bold text-white">{getRoleDisplay()}</p>
                {profile?.skills && (
                  <p className="text-gray-400 text-sm mt-1">Skills: {profile.skills}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Actions */}
        <h3 className="text-2xl font-bold text-white mb-6">How can you help?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* UC-14: Choose Volunteer Role */}
          <Link to="/volunteer/role" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10">
              <div className="bg-[#4988C4]/20 h-28 flex items-center justify-center text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">Choose Role</h3>
                <p className="text-gray-400 mb-4 text-sm">Set your volunteer role (on-field/off-field)</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition text-sm">
                  Select Role <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-15: Choose a Task */}
          <Link to="/volunteer/tasks" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/30 hover:border-[#5A7863] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#5A7863]/10">
              <div className="bg-[#5A7863]/20 h-28 flex items-center justify-center text-5xl text-[#5A7863]">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#90AB8B] transition">Choose Task</h3>
                <p className="text-gray-400 mb-4 text-sm">Select from available volunteer tasks</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition text-sm">
                  Browse Tasks <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-16: View Google Map */}
          <Link to="/volunteer/map" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#1C4D8D]/30 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10">
              <div className="bg-[#1C4D8D]/20 h-28 flex items-center justify-center text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={faMap} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">View Map</h3>
                <p className="text-gray-400 mb-4 text-sm">See victims within 5km radius</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition text-sm">
                  Open Map <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-17: Update Tasks */}
          <Link to="/volunteer/tasks/update" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 hover:border-[#629FAD] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#629FAD]/10">
              <div className="bg-[#629FAD]/20 h-28 flex items-center justify-center text-5xl text-[#629FAD]">
                <FontAwesomeIcon icon={faPencil} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Update Tasks</h3>
                <p className="text-gray-400 mb-4 text-sm">Update progress on assigned tasks</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition text-sm">
                  Update Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/volunteer/report-disaster" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-red-500/30 hover:border-red-500 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-red-500/10">
              <div className="bg-red-500/20 h-28 flex items-center justify-center text-5xl text-red-400">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition">Report Disaster</h3>
                <p className="text-gray-400 mb-4 text-sm">Report a new disaster/incident</p>
                <div className="flex items-center text-red-400 font-semibold group-hover:translate-x-2 transition text-sm">
                  Report Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#90AB8B]/30 hover:border-[#90AB8B] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#90AB8B]/10">
              <div className="bg-[#90AB8B]/20 h-28 flex items-center justify-center text-5xl text-[#90AB8B]">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#90AB8B] transition">My Profile</h3>
                <p className="text-gray-400 mb-4 text-sm">View and update your profile</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition text-sm">
                  View Profile <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 text-center border border-[#5A7863]/30 shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-white">Thank You for Your Service</h3>
          <p className="text-gray-300">Your dedication and hard work make a real difference in disaster relief efforts.</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

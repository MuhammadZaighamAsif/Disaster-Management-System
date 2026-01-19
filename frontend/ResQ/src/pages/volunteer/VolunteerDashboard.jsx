import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullseye, faClipboardList, faMap, faPencil, faTriangleExclamation, faUserShield, faUserNurse } from '@fortawesome/free-solid-svg-icons';

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
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-16 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 text-white">Volunteer Dashboard</h1>
          <p className="text-[#BDE8F5] text-lg">Choose tasks, support victims, and make a real impact</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Welcome Card */}
        <div className="bg-[#296374] rounded-2xl shadow-xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {user?.name}!</h2>
              <p className="text-[#EDEDCE] text-lg">Choose tasks, view victims on map, and update your progress.</p>
            </div>
            <div className="text-6xl opacity-20"></div>
          </div>
        </div>

        {/* Role Display Card */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-12 border-l-4 border-[#4988C4]">
            <div className="flex items-center gap-4">
              <div className="text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={getRoleIcon()} />
              </div>
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Your Volunteer Role</p>
                <p className="text-2xl font-bold text-[#0F2854]">{getRoleDisplay()}</p>
                {profile?.skills && (
                  <p className="text-[#296374] text-sm mt-2">Skills: {profile.skills}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#4988C4]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Available Tasks</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Choose One</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#629FAD]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Track Victims</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">View Map</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#5A7863]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Update Progress</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Keep Updated</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <h3 className="text-2xl font-bold text-[#0F2854] mb-8">How can you help?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* UC-14: Choose Volunteer Role */}
          <Link to="/volunteer/role" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#4988C4] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#4988C4] transition">Choose Role</h3>
                <p className="text-[#296374] mb-4">Set your volunteer role (on-field/off-field)</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition">
                  Select Role <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-15: Choose a Task */}
          <Link to="/volunteer/tasks" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#5A7863] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faClipboardList} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#5A7863] transition">Choose Task</h3>
                <p className="text-[#296374] mb-4">Select from available volunteer tasks</p>
                <div className="flex items-center text-[#5A7863] font-semibold group-hover:translate-x-2 transition">
                  Browse Tasks <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-16: View Google Map */}
          <Link to="/volunteer/map" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#1C4D8D] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faMap} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#1C4D8D] transition">View Map</h3>
                <p className="text-[#296374] mb-4">See victims within 5km radius</p>
                <div className="flex items-center text-[#1C4D8D] font-semibold group-hover:translate-x-2 transition">
                  Open Map <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-17: Update Tasks */}
          <Link to="/volunteer/tasks/update" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#629FAD] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faPencil} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#629FAD] transition">Update Tasks</h3>
                <p className="text-[#296374] mb-4">Update progress on assigned tasks</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition">
                  Update Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/volunteer/report-disaster" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-red-600 h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-red-600 transition">Report Disaster</h3>
                <p className="text-[#296374] mb-4">Report a new disaster/incident</p>
                <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition">
                  Report Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#EDEDCE] h-32 flex items-center justify-center text-6xl shadow-md">
                
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#296374] transition">My Profile</h3>
                <p className="text-[#296374] mb-4">View and update your profile</p>
                <div className="flex items-center text-[#296374] font-semibold group-hover:translate-x-2 transition">
                  View Profile <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854] rounded-xl p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-white">Thank You for Your Service</h3>
          <p className="text-[#BDE8F5]">Your dedication and hard work make a real difference in disaster relief efforts.</p>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

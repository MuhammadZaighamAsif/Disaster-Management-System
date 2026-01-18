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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Volunteer Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600 mb-4">Choose tasks, view victims on map, and update your progress.</p>
          
          {!loading && (
            <div className="flex items-center gap-3 mt-4 p-4 bg-blue-50 rounded-lg">
              <FontAwesomeIcon icon={getRoleIcon()} className="text-2xl text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Current Role</p>
                <p className="text-lg font-semibold text-gray-800">{getRoleDisplay()}</p>
                {profile?.skills && (
                  <p className="text-sm text-gray-600 mt-1">Skills: {profile.skills}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UC-14: Choose Volunteer Role */}
          <Link to="/volunteer/role" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-purple-600">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
            <h3 className="text-xl font-bold mb-2">Choose Role</h3>
            <p className="text-gray-600">Set your volunteer role (on-field/off-field)</p>
          </Link>

          {/* UC-15: Choose a Task */}
          <Link to="/volunteer/tasks" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-green-600">
              <FontAwesomeIcon icon={faClipboardList} />
            </div>
            <h3 className="text-xl font-bold mb-2">Choose Task</h3>
            <p className="text-gray-600">Select from available volunteer tasks</p>
          </Link>

          {/* UC-16: View Google Map */}
          <Link to="/volunteer/map" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-blue-600">
              <FontAwesomeIcon icon={faMap} />
            </div>
            <h3 className="text-xl font-bold mb-2">View Map</h3>
            <p className="text-gray-600">See victims within 5km radius</p>
          </Link>

          {/* UC-17: Update Tasks */}
          <Link to="/volunteer/tasks/update" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-orange-600">
              <FontAwesomeIcon icon={faPencil} />
            </div>
            <h3 className="text-xl font-bold mb-2">Update Tasks</h3>
            <p className="text-gray-600">Update progress on assigned tasks</p>
          </Link>

          {/* Report Disaster */}
          <Link to="/volunteer/report-disaster" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-red-600">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <h3 className="text-xl font-bold mb-2">Report Disaster</h3>
            <p className="text-gray-600">Report a new disaster/incident</p>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">👤</div>
            <h3 className="text-xl font-bold mb-2">My Profile</h3>
            <p className="text-gray-600">View and update your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;

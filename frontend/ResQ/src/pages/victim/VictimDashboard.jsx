import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faClipboardCheck, faTriangleExclamation, faHome } from '@fortawesome/free-solid-svg-icons';

const VictimDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Victim Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Request aid and track the status of your requests.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UC-22: Request Aid */}
          <Link to="/victim/request-aid" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-red-600">
              <FontAwesomeIcon icon={faHandHoldingHeart} />
            </div>
            <h3 className="text-xl font-bold mb-2">Request Aid</h3>
            <p className="text-gray-600">Request food, clothes, shelter, or medical help</p>
          </Link>

          {/* UC-23: Receive Aid */}
          <Link to="/victim/aid-status" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-blue-600">
              <FontAwesomeIcon icon={faClipboardCheck} />
            </div>
            <h3 className="text-xl font-bold mb-2">Aid Status</h3>
            <p className="text-gray-600">View and confirm received aid</p>
          </Link>

          {/* Report Disaster */}
          <Link to="/victim/report-disaster" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-orange-600">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <h3 className="text-xl font-bold mb-2">Report Disaster</h3>
            <p className="text-gray-600">Report a new disaster/incident</p>
          </Link>

          {/* View Available Shelter */}
          <Link to="/victim/shelters" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-green-600">
              <FontAwesomeIcon icon={faHome} />
            </div>
            <h3 className="text-xl font-bold mb-2">Available Shelters</h3>
            <p className="text-gray-600">Find available shelter locations</p>
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

export default VictimDashboard;

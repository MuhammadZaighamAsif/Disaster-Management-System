import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBox, faBullseye, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';

const DonorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Donor Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Make a difference by donating money, items, or shelter.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UC-18: Donate Currency */}
          <Link to="/donor/donate-money" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-green-600">
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <h3 className="text-xl font-bold mb-2">Donate Money</h3>
            <p className="text-gray-600">Make a monetary donation</p>
          </Link>

          {/* UC-19: Donate Items */}
          <Link to="/donor/donate-items" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-orange-600">
              <FontAwesomeIcon icon={faBox} />
            </div>
            <h3 className="text-xl font-bold mb-2">Donate Items</h3>
            <p className="text-gray-600">Donate food, clothes, or supplies</p>
          </Link>

          {/* UC-20: Donate to Specific Disaster */}
          <Link to="/donor/donate-money" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-purple-600">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
            <h3 className="text-xl font-bold mb-2">Specific Disaster</h3>
            <p className="text-gray-600">Donate to a particular disaster (integrated in donate pages)</p>
          </Link>

          {/* UC-21: Offer Shelter */}
          <Link to="/donor/offer-shelter" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-blue-600">
              <FontAwesomeIcon icon={faHome} />
            </div>
            <h3 className="text-xl font-bold mb-2">Offer Shelter</h3>
            <p className="text-gray-600">Provide shelter to victims</p>
          </Link>

          {/* View Donation History */}
          <Link to="/donor/history" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4 text-indigo-600">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <h3 className="text-xl font-bold mb-2">Donation History</h3>
            <p className="text-gray-600">View your past donations</p>
          </Link>

          {/* Report Disaster */}
          <Link to="/donor/report-disaster" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">🚨</div>
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

export default DonorDashboard;

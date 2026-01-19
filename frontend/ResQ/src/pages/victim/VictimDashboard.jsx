import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faClipboardCheck, faTriangleExclamation, faHome, faUser} from '@fortawesome/free-solid-svg-icons';

const VictimDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-16 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 text-white">Victim Dashboard</h1>
          <p className="text-[#BDE8F5] text-lg">Access aid, track your status, and find shelters quickly</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Welcome Card */}
        <div className="bg-[#4988C4] rounded-2xl shadow-xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {user?.name}!</h2>
              <p className="text-[#EDEDCE] text-lg">Request aid, track your requests, and find safe shelters nearby.</p>
            </div>
            {/* <div className="text-6xl opacity-20">🛟</div> */}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#4988C4]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Aid Options</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Request Support</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#629FAD]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Track Progress</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Aid Status</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#5A7863]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Find Shelter</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Safe Places</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <h3 className="text-2xl font-bold text-[#0F2854] mb-8">What do you need today?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Request Aid */}
          <Link to="/victim/request-aid" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#4988C4] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#4988C4] transition">Request Aid</h3>
                <p className="text-[#296374] mb-4">Request food, clothes, shelter, or medical help</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition">
                  Start Request <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Aid Status */}
          <Link to="/victim/aid-status" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#629FAD] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#629FAD] transition">Aid Status</h3>
                <p className="text-[#296374] mb-4">View and confirm received aid</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition">
                  View Status <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/victim/report-disaster" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#5A7863] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#5A7863] transition">Report Disaster</h3>
                <p className="text-[#296374] mb-4">Report a new disaster/incident</p>
                <div className="flex items-center text-[#5A7863] font-semibold group-hover:translate-x-2 transition">
                  Report Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Available Shelters */}
          <Link to="/victim/shelters" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#1C4D8D] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#1C4D8D] transition">Available Shelters</h3>
                <p className="text-[#296374] mb-4">Find available shelter locations</p>
                <div className="flex items-center text-[#1C4D8D] font-semibold group-hover:translate-x-2 transition">
                  Find Shelter <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#EDEDCE] h-32 flex items-center justify-center text-6xl shadow-md">
                <FontAwesomeIcon icon={faUser} />
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
      </div>
    </div>
  );
};

export default VictimDashboard;

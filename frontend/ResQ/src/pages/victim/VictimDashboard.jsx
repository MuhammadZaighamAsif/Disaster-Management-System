import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandHoldingHeart, faClipboardCheck, faTriangleExclamation, faHome, faUser, faLifeRing } from '@fortawesome/free-solid-svg-icons';

const VictimDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#4988C4]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Victim Dashboard</h1>
              <p className="text-gray-300 text-lg">Welcome, {user?.name}! Access aid, track status, and find shelters</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faLifeRing} />
            </div>
          </div>
        </div>

       
        {/* Main Actions */}
        <h3 className="text-2xl font-bold text-white mb-6">What do you need today?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Request Aid */}
          <Link to="/victim/request-aid" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10">
              <div className="bg-[#4988C4]/20 h-28 flex items-center justify-center text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">Request Aid</h3>
                <p className="text-gray-400 mb-4 text-sm">Request food, clothes, shelter, or medical help</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition text-sm">
                  Start Request <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Aid Status */}
          <Link to="/victim/aid-status" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 hover:border-[#629FAD] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#629FAD]/10">
              <div className="bg-[#629FAD]/20 h-28 flex items-center justify-center text-5xl text-[#629FAD]">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Aid Status</h3>
                <p className="text-gray-400 mb-4 text-sm">View and confirm received aid</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition text-sm">
                  View Status <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/victim/report-disaster" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/30 hover:border-[#5A7863] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#5A7863]/10">
              <div className="bg-[#5A7863]/20 h-28 flex items-center justify-center text-5xl text-[#5A7863]">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#90AB8B] transition">Report Disaster</h3>
                <p className="text-gray-400 mb-4 text-sm">Report a new disaster/incident</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition text-sm">
                  Report Now <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Available Shelters */}
          <Link to="/victim/shelters" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#296374]/30 hover:border-[#296374] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#296374]/10">
              <div className="bg-[#296374]/20 h-28 flex items-center justify-center text-5xl text-[#629FAD]">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Available Shelters</h3>
                <p className="text-gray-400 mb-4 text-sm">Find available shelter locations</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition text-sm">
                  Find Shelter <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10">
              <div className="bg-[#4988C4]/20 h-28 flex items-center justify-center text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">My Profile</h3>
                <p className="text-gray-400 mb-4 text-sm">View and update your profile</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition text-sm">
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

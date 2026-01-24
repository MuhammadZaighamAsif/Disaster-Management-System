import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBox, faBullseye, faHome, faChartBar, faTriangleExclamation, faUser, faHeart } from '@fortawesome/free-solid-svg-icons';

const DonorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#629FAD]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">Donor Dashboard</h1>
              <p className="text-gray-300 text-lg">Welcome back, {user?.name}! Making a real difference in people's lives</p>
            </div>
            <div className="text-7xl text-[#629FAD]/30">
              <FontAwesomeIcon icon={faHeart} />
            </div>
          </div>
        </div>

        {/* Main Actions */}
        <h3 className="text-2xl font-bold text-white mb-6">How Would You Like to Help?</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* UC-18: Donate Currency */}
          <Link to="/donor/donate-money" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#4988C4]/10">
              <div className="bg-[#4988C4]/20 h-28 flex items-center justify-center text-5xl text-[#4988C4]">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">Donate Money</h3>
                <p className="text-gray-400 mb-4 text-sm">Contribute to our general relief fund or specific disaster efforts</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition text-sm">
                  Start Donating <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-19: Donate Items */}
          <Link to="/donor/donate-items" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/30 hover:border-[#5A7863] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#5A7863]/10">
              <div className="bg-[#5A7863]/20 h-28 flex items-center justify-center text-5xl text-[#5A7863]">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#90AB8B] transition">Donate Items</h3>
                <p className="text-gray-400 mb-4 text-sm">Send food, clothes, medical supplies, or other essentials</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition text-sm">
                  Get Started <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
          {/* UC-21: Offer Shelter */}
          <Link to="/donor/offer-shelter" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/30 hover:border-[#629FAD] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#629FAD]/10">
              <div className="bg-[#629FAD]/20 h-28 flex items-center justify-center text-5xl text-[#629FAD]">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Offer Shelter</h3>
                <p className="text-gray-400 mb-4 text-sm">Open your home to provide safe accommodation for displaced victims</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition text-sm">
                  Register Shelter <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* View Donation History */}
          <Link to="/donor/history" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#296374]/30 hover:border-[#296374] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-[#296374]/10">
              <div className="bg-[#296374]/20 h-28 flex items-center justify-center text-5xl text-[#629FAD]">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Donation History</h3>
                <p className="text-gray-400 mb-4 text-sm">Track your contributions and see the impact you've made</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition text-sm">
                  View History <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/donor/report-disaster" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-red-500/30 hover:border-red-500 overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full shadow-lg hover:shadow-xl hover:shadow-red-500/10">
              <div className="bg-red-500/20 h-28 flex items-center justify-center text-5xl text-red-400">
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition">Report Disaster</h3>
                <p className="text-gray-400 mb-4 text-sm">Alert the community about a new disaster or emergency</p>
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
                <p className="text-gray-400 mb-4 text-sm">Manage your account information and donation preferences</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition text-sm">
                  View Profile <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 text-center border border-[#5A7863]/30 shadow-lg">
          <h3 className="text-2xl font-bold mb-3 text-white">Your Support Saves Lives</h3>
          <p className="text-gray-300">Every contribution, no matter the size, makes a real difference in disaster relief efforts.</p>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;

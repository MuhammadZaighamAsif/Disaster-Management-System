import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faBox, faBullseye, faHome, faChartBar } from '@fortawesome/free-solid-svg-icons';

const DonorDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-12">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-16 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-3 text-white">Donor Dashboard</h1>
          <p className="text-[#BDE8F5] text-lg">Welcome back, making a real difference in people's lives</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Welcome Card */}
        <div className="bg-[#5A7863] rounded-2xl shadow-xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {user?.name}!</h2>
              <p className="text-[#EDEDCE] text-lg">Together we can make a difference in disaster relief efforts</p>
            </div>
            <div className="text-6xl opacity-20"></div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#4988C4]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Your Impact</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Helping Others</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#629FAD]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Active Disasters</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Support Now</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>

            {/* Verify Donations Card */}
            <div className="bg-gradient-to-br from-[#0F2854] to-[#296374] rounded-2xl p-8 text-center text-white h-40 hover:scale-105 transition duration-300 shadow-lg">
              <h3 className="text-2xl font-bold mb-2">Verify Donations</h3>
              <p className="text-[#BDE8F5] text-lg">Review pending donations</p>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#5A7863]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Community</p>
                <p className="text-3xl font-bold text-[#0F2854] mt-2">Join Us</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Main Grid - Donation Options */}
        <h3 className="text-2xl font-bold text-[#0F2854] mb-8">How Would You Like to Help?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* UC-18: Donate Currency */}
          <Link to="/donor/donate-money" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#4988C4] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#4988C4] transition">Donate Money</h3>
                <p className="text-[#296374] mb-4">Contribute to our general relief fund or specific disaster efforts</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition">
                  Start Donating <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-19: Donate Items */}
          <Link to="/donor/donate-items" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#5A7863] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faBox} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#5A7863] transition">Donate Items</h3>
                <p className="text-[#296374] mb-4">Send food, clothes, medical supplies, or other essentials to those in need</p>
                <div className="flex items-center text-[#5A7863] font-semibold group-hover:translate-x-2 transition">
                  Get Started <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-20: Donate to Specific Disaster */}
          <Link to="/donor/donate-money" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#0C2C55] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faBullseye} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#0C2C55] transition">Targeted Aid</h3>
                <p className="text-[#296374] mb-4">Direct your donation to a specific ongoing disaster relief effort</p>
                <div className="flex items-center text-[#0C2C55] font-semibold group-hover:translate-x-2 transition">
                  Choose Disaster <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-21: Offer Shelter */}
          <Link to="/donor/offer-shelter" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#629FAD] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faHome} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#629FAD] transition">Offer Shelter</h3>
                <p className="text-[#296374] mb-4">Open your home to provide safe accommodation for displaced victims</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition">
                  Register Shelter <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* View Donation History */}
          <Link to="/donor/history" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#296374] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                <FontAwesomeIcon icon={faChartBar} />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#296374] transition">Donation History</h3>
                <p className="text-[#296374] mb-4">Track your contributions and see the impact you've made</p>
                <div className="flex items-center text-[#296374] font-semibold group-hover:translate-x-2 transition">
                  View History <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Disaster */}
          <Link to="/donor/report-disaster" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-red-500 h-32 flex items-center justify-center text-6xl text-white shadow-md">
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-red-600 transition">Report Disaster</h3>
                <p className="text-[#296374] mb-4">Alert the community about a new disaster or emergency situation</p>
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
                <p className="text-[#296374] mb-4">Manage your account information and donation preferences</p>
                <div className="flex items-center text-[#296374] font-semibold group-hover:translate-x-2 transition">
                  View Profile <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854] rounded-xl p-8 text-white text-center mb-8">
          <h3 className="text-2xl font-bold mb-2 text-white">Your Support Saves Lives</h3>
          <p className="text-[#BDE8F5]">Every contribution, no matter the size, makes a real difference in disaster relief efforts.</p>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;

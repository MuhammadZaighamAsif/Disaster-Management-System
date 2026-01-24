import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faTrashCan, 
  faClipboardCheck, 
  faUsers, 
  faGift, 
  faUserCheck, 
  faHandHoldingHeart, 
  faListCheck, 
  faUser,
  faBolt,
  faCog,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a1628] py-10">
      <div className="container mx-auto px-4">
        {/* Welcome Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-10 text-white border border-[#4988C4]/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {user?.name}!</h2>
              <p className="text-gray-300 text-lg">Manage disasters, verify donors, view volunteers and donations.</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-6">Management Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UC-1: Add Disaster */}
          <Link to="/admin/disasters/add" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/40 hover:border-[#5A7863] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#5A7863]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#5A7863] bg-[#5A7863]/10">
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#5A7863] transition">Add Disaster</h3>
                <p className="text-gray-400 text-sm mb-3">Create a new disaster entry</p>
                <div className="flex items-center text-[#5A7863] font-semibold text-sm group-hover:translate-x-2 transition">
                  Get Started <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-2: Manage Disasters */}
          <Link to="/admin/disasters/manage" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#90AB8B]/40 hover:border-[#90AB8B] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#90AB8B]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#90AB8B] bg-[#90AB8B]/10">
                <FontAwesomeIcon icon={faTrashCan} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#90AB8B] transition">Manage Disasters</h3>
                <p className="text-gray-400 text-sm mb-3">View and remove disasters</p>
                <div className="flex items-center text-[#90AB8B] font-semibold text-sm group-hover:translate-x-2 transition">
                  Manage <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-3: Verify Disasters */}
          <Link to="/admin/disasters/verify" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/40 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#4988C4]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#4988C4] bg-[#4988C4]/10">
                <FontAwesomeIcon icon={faClipboardCheck} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">Verify Disasters</h3>
                <p className="text-gray-400 text-sm mb-3">Review and approve incidents</p>
                <div className="flex items-center text-[#4988C4] font-semibold text-sm group-hover:translate-x-2 transition">
                  Review <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-4: View Volunteers */}
          <Link to="/admin/volunteers" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/40 hover:border-[#629FAD] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#629FAD]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#629FAD] bg-[#629FAD]/10">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">View Volunteers</h3>
                <p className="text-gray-400 text-sm mb-3">See all registered volunteers</p>
                <div className="flex items-center text-[#629FAD] font-semibold text-sm group-hover:translate-x-2 transition">
                  View <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-5: View Donations */}
          <Link to="/admin/donations" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/40 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#4988C4]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#4988C4] bg-[#4988C4]/10">
                <FontAwesomeIcon icon={faGift} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">View Donations</h3>
                <p className="text-gray-400 text-sm mb-3">Track incoming donations</p>
                <div className="flex items-center text-[#4988C4] font-semibold text-sm group-hover:translate-x-2 transition">
                  Track <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-6: Verify Donors */}
          <Link to="/admin/donors/verify" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#5A7863]/40 hover:border-[#5A7863] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#5A7863]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#5A7863] bg-[#5A7863]/10">
                <FontAwesomeIcon icon={faUserCheck} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#5A7863] transition">Verify Donors</h3>
                <p className="text-gray-400 text-sm mb-3">Approve donor registrations</p>
                <div className="flex items-center text-[#5A7863] font-semibold text-sm group-hover:translate-x-2 transition">
                  Verify <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-7: Verify Aid Requests */}
          <Link to="/admin/aid-requests" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#629FAD]/40 hover:border-[#629FAD] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#629FAD]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#629FAD] bg-[#629FAD]/10">
                <FontAwesomeIcon icon={faHandHoldingHeart} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#629FAD] transition">Aid Requests</h3>
                <p className="text-gray-400 text-sm mb-3">Review pending requests</p>
                <div className="flex items-center text-[#629FAD] font-semibold text-sm group-hover:translate-x-2 transition">
                  Review <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Create Volunteer Task */}
          <Link to="/admin/tasks/create" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/40 hover:border-[#4988C4] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#4988C4]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#4988C4] bg-[#4988C4]/10">
                <FontAwesomeIcon icon={faListCheck} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#4988C4] transition">Create Task</h3>
                <p className="text-gray-400 text-sm mb-3">Create volunteer tasks</p>
                <div className="flex items-center text-[#4988C4] font-semibold text-sm group-hover:translate-x-2 transition">
                  Create <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="group">
            <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#BDE8F5]/30 hover:border-[#BDE8F5] overflow-hidden transform hover:scale-[1.02] transition-all duration-300 h-full hover:shadow-xl hover:shadow-[#BDE8F5]/20 shadow-lg">
              <div className="h-28 flex items-center justify-center text-4xl text-[#BDE8F5] bg-[#BDE8F5]/10">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#BDE8F5] transition">My Profile</h3>
                <p className="text-gray-400 text-sm mb-3">View your profile</p>
                <div className="flex items-center text-[#BDE8F5] font-semibold text-sm group-hover:translate-x-2 transition">
                  View <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

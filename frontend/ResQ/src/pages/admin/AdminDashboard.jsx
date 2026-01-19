import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#EBF4DD]">
      {/* Header Section */}
      <div className="bg-[#0F2854] text-white py-12 px-4 mb-12 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-[#BDE8F5]">Manage disasters, verify data, and coordinate relief efforts</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Welcome Card */}
        <div className="bg-[#296374] rounded-2xl shadow-xl p-8 mb-12 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {user?.name}!</h2>
              <p className="text-[#EDEDCE] text-lg">Manage disasters, verify donors, view volunteers and donations.</p>
            </div>
            <div className="text-6xl opacity-20"></div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#4988C4]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Quick Access</p>
                <p className="text-2xl font-bold text-[#0F2854] mt-2">9 Actions</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#629FAD]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Manage System</p>
                <p className="text-2xl font-bold text-[#0F2854] mt-2">Full Control</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-[#5A7863]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#296374] text-sm font-semibold uppercase">Verify & Approve</p>
                <p className="text-2xl font-bold text-[#0F2854] mt-2">Review Tasks</p>
              </div>
              <div className="text-5xl opacity-20"></div>
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#0F2854] mb-8">Management Actions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* UC-1: Add Disaster */}
          <Link to="/admin/disasters/add" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#5A7863] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                ➕
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#5A7863] transition">Add Disaster</h3>
                <p className="text-[#296374] mb-4">Create a new disaster entry</p>
                <div className="flex items-center text-[#5A7863] font-semibold group-hover:translate-x-2 transition">
                  Get Started <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-2: Manage Disasters */}
          <Link to="/admin/disasters/manage" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#90AB8B] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                🗑️
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#90AB8B] transition">Manage Disasters</h3>
                <p className="text-[#296374] mb-4">View and remove disasters</p>
                <div className="flex items-center text-[#90AB8B] font-semibold group-hover:translate-x-2 transition">
                  Manage <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-3: Verify Disasters */}
          <Link to="/admin/disasters/verify" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#4988C4] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                ✅
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#4988C4] transition">Verify Disasters</h3>
                <p className="text-[#296374] mb-4">Review and approve incidents</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition">
                  Review <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-4: View Volunteers */}
          <Link to="/admin/volunteers" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#629FAD] h-32 flex items-center justify-center text-6xl text-white shadow-md">
                👥
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#629FAD] transition">View Volunteers</h3>
                <p className="text-[#296374] mb-4">See all registered volunteers</p>
                <div className="flex items-center text-[#629FAD] font-semibold group-hover:translate-x-2 transition">
                  View <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-5: View Donations */}
          <Link to="/admin/donations" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#1C4D8D] h-32 flex items-center justify-center text-6xl text-white shadow-md">
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#1C4D8D] transition">View Donations</h3>
                <p className="text-[#296374] mb-4">Track incoming donations</p>
                <div className="flex items-center text-[#1C4D8D] font-semibold group-hover:translate-x-2 transition">
                  Track <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-6: Verify Donors */}
          <Link to="/admin/donors/verify" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#5A7863] h-32 flex items-center justify-center text-6xl text-white shadow-md">

              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#5A7863] transition">Verify Donors</h3>
                <p className="text-[#296374] mb-4">Approve donor registrations</p>
                <div className="flex items-center text-[#5A7863] font-semibold group-hover:translate-x-2 transition">
                  Verify <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* UC-7: Verify Aid Requests */}
          <Link to="/admin/aid-requests" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#296374] h-32 flex items-center justify-center text-6xl text-white shadow-md">
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#296374] transition">Aid Requests</h3>
                <p className="text-[#296374] mb-4">Review pending requests</p>
                <div className="flex items-center text-[#296374] font-semibold group-hover:translate-x-2 transition">
                  Review <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>

          {/* Create Volunteer Task */}
          <Link to="/admin/tasks/create" className="group">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300 h-full">
              <div className="bg-[#4988C4] h-32 flex items-center justify-center text-6xl text-white shadow-md">
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-[#0F2854] mb-3 group-hover:text-[#4988C4] transition">Create Task</h3>
                <p className="text-[#296374] mb-4">Create volunteer tasks</p>
                <div className="flex items-center text-[#4988C4] font-semibold group-hover:translate-x-2 transition">
                  Create <span className="ml-2">→</span>
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
                <p className="text-[#296374] mb-4">View your profile</p>
                <div className="flex items-center text-[#296374] font-semibold group-hover:translate-x-2 transition">
                  View <span className="ml-2">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="bg-[#0F2854] rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-2 text-white">System Administration</h3>
          <p className="text-[#BDE8F5]">Manage all aspects of the disaster relief platform</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

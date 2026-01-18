import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-[#3B4953]">Admin Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-[#90AB8B]">
          <h2 className="text-2xl font-semibold mb-2 text-[#3B4953]">Welcome, {user?.name}!</h2>
          <p className="text-[#5A7863]">Manage disasters, verify donors, view volunteers and donations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* UC-1: Add Disaster */}
          <Link to="/admin/disasters/add" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#5A7863]">
            <div className="text-4xl mb-4 text-[#5A7863]">➕</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">Add Disaster</h3>
            <p className="text-[#5A7863]">Create a new disaster entry in the system</p>
          </Link>

          {/* UC-2: Remove Disaster */}
          <Link to="/admin/disasters/manage" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#90AB8B]">
            <div className="text-4xl mb-4 text-[#90AB8B]">🗑️</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">Manage Disasters</h3>
            <p className="text-[#5A7863]">View and remove disaster entries</p>
          </Link>

          {/* UC-3: Verify Disaster */}
          <Link to="/admin/disasters/verify" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#3B4953]">
            <div className="text-4xl mb-4 text-[#3B4953]">✅</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">Verify Disasters</h3>
            <p className="text-[#5A7863]">Review and approve reported incidents</p>
          </Link>

          {/* UC-4: View Volunteers */}
          <Link to="/admin/volunteers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#5A7863]">
            <div className="text-4xl mb-4 text-[#5A7863]">👥</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">View Volunteers</h3>
            <p className="text-[#5A7863]">See all registered volunteers</p>
          </Link>

          {/* UC-5: View Donations */}
          <Link to="/admin/donations" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#90AB8B]">
            <div className="text-4xl mb-4 text-[#90AB8B]">💰</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">View Donations</h3>
            <p className="text-[#5A7863]">Track incoming donations</p>
          </Link>

          {/* UC-7: Verify Aid Request */}
          <Link to="/admin/aid-requests" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#3B4953]">
            <div className="text-4xl mb-4 text-[#3B4953]">📋</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">Aid Requests</h3>
            <p className="text-[#5A7863]">Review pending aid requests</p>
          </Link>

          {/* Create Volunteer Task */}
          <Link to="/admin/tasks/create" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#5A7863]">
            <div className="text-4xl mb-4 text-[#5A7863]">📝</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">Create Task</h3>
            <p className="text-[#5A7863]">Create tasks for volunteers</p>
          </Link>

          {/* My Profile */}
          <Link to="/profile" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition border-l-4 border-[#90AB8B]">
            <div className="text-4xl mb-4 text-[#90AB8B]">👤</div>
            <h3 className="text-xl font-bold mb-2 text-[#3B4953]">My Profile</h3>
            <p className="text-[#5A7863]">View and update your profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

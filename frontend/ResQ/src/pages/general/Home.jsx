import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faHeart, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmationModal from '../../components/common/LogoutConfirmationModal';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    victimsHelped: 0,
    activeVolunteers: 0,
    donors: 0,
    disastersManaged: 0
  });
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', victims: 40, volunteers: 24, donors: 24 },
    { month: 'Feb', victims: 30, volunteers: 13, donors: 22 },
    { month: 'Mar', victims: 20, volunteers: 98, donors: 29 },
    { month: 'Apr', victims: 27, volunteers: 39, donors: 20 },
    { month: 'May', victims: 18, volunteers: 48, donors: 21 },
    { month: 'Jun', victims: 23, volunteers: 38, donors: 25 },
  ];

  const disasterTypeData = [
    { name: 'Earthquake', value: 35 },
    { name: 'Flood', value: 25 },
    { name: 'Fire', value: 20 },
    { name: 'Storm', value: 20 },
  ];

  const volunteerRoleData = [
    { role: 'On-Field', count: 120 },
    { role: 'Off-Field', count: 80 },
  ];

  const COLORS = ['#5A7863', '#90AB8B', '#EBF4DD', '#3B4953'];
  const COLORS_VOLUNTEER = ['#5A7863', '#90AB8B'];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/stats');
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = (e, role = null) => {
    e.preventDefault();
    if (user) {
      setPendingRole(role);
      setShowLogoutConfirmation(true);
    } else {
      if (role) {
        navigate(`/signup?role=${role}`);
      } else {
        navigate('/signup');
      }
    }
  };

  const handleLogoutAndSignup = () => {
    logout();
    setShowLogoutConfirmation(false);
    if (pendingRole) {
      navigate(`/signup?role=${pendingRole}`);
    } else {
      navigate('/signup');
    }
  };

  const handleStayOnPage = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <div className="min-h-screen">
      <LogoutConfirmationModal
        isOpen={showLogoutConfirmation}
        onLogoutAndSignup={handleLogoutAndSignup}
        onStayOnPage={handleStayOnPage}
      />
      {/* Hero Section */}
      <section className="bg-linear-to-r from-forest to-charcoal text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 text-black">
            Welcome to ResQ
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-black">
            A comprehensive Disaster Relief Management System connecting victims,
            volunteers, donors, and NGOs for effective disaster response.
          </p>
          <div className="flex gap-4 justify-center text-black">
            {/* <Link
              to="/signup"
              className="bg-cream text-forest px-8 py-3 rounded-lg font-semibold hover:bg-sage transition"
            >
              Get Started
            </Link>
            <Link
              to="/search"
              className="bg-transparent border-2 border-cream px-8 py-3 rounded-lg font-semibold hover:bg-cream hover:text-forest transition"
            >
              Search Disasters
            </Link> */}
            <button
              onClick={(e) => handleSignupClick(e)}
              className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-charcoal transition cursor-pointer border-none"
            >
              Join ResQ Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Victim Services */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-forest">
              <div className="text-4xl mb-4 text-forest">
                <FontAwesomeIcon icon={faPersonCirclePlus} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-forest">For Victims</h3>
              <p className="text-gray-600 mb-4">
                Request aid, report your situation, and receive help from volunteers and donors.
              </p>
              <button 
                onClick={(e) => handleSignupClick(e, 'VICTIM')}
                className="text-forest hover:text-sage font-semibold cursor-pointer bg-none border-none p-0"
              >
                Register as Victim →
              </button>
            </div>

            {/* Volunteer Services */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-sage">
              <div className="text-4xl mb-4 text-sage">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-sage">For Volunteers</h3>
              <p className="text-gray-600 mb-4">
                Choose tasks, help victims on-field or off-field, and make a difference.
              </p>
              <button 
                onClick={(e) => handleSignupClick(e, 'VOLUNTEER')}
                className="text-sage hover:text-forest font-semibold cursor-pointer bg-none border-none p-0"
              >
                Volunteer Now →
              </button>
            </div>

            {/* Donor Services */}
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-charcoal">
              <div className="text-4xl mb-4 text-charcoal">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-charcoal">For Donors</h3>
              <p className="text-gray-600 mb-4">
                Donate money, items, or shelter to specific disasters or general relief.
              </p>
              <button 
                onClick={(e) => handleSignupClick(e, 'DONOR')}
                className="text-charcoal hover:text-forest font-semibold cursor-pointer bg-none border-none p-0"
              >
                Start Donating →
              </button>
            </div>
          </div>
        </div>
      </section>


      {/* Stats Section */}
      <section className="py-16 bg-cream text-black">
        <div className="container mx-auto px-4 bg-blue-500 p-8 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.victimsHelped}+`}
              </div>
              <div className="text-xl">Victims Helped</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.activeVolunteers}+`}
              </div>
              <div className="text-xl">Active Volunteers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.donors}+`}
              </div>
              <div className="text-xl">Generous Donors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">
                {loading ? '...' : `${stats.disastersManaged}+`}
              </div>
              <div className="text-xl">Disasters Managed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Analytics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Line Chart - Monthly Trends */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="victims" stroke="#5A7863" strokeWidth={2} />
                  <Line type="monotone" dataKey="volunteers" stroke="#90AB8B" strokeWidth={2} />
                  <Line type="monotone" dataKey="donors" stroke="#3B4953" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Disaster Types */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Disaster Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={disasterTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {disasterTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Volunteer Roles */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">Volunteer Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volunteerRoleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#5A7863" name="Volunteers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join ResQ today and be part of a community dedicated to helping
            disaster victims and coordinating relief efforts.
          </p>
          {/* <Link
            to="/signup"
            className="inline-block bg-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-charcoal transition"
          >
            Join ResQ Now
          </Link> */}
        </div>
      </section>
    </div>
  );
};

export default Home;

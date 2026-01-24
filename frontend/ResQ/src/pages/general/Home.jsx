import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHandshake, faHeart, faPersonCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmationModal from '../../components/common/LogoutConfirmationModal';
import disasterBg from '../../assets/disaster-bg.jpg';

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

  const COLORS = ['#5A7863', '#4988C4', '#629FAD', '#296374'];
  const COLORS_VOLUNTEER = ['#5A7863', '#4988C4'];

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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[90vh] text-white overflow-hidden">
        {/* Background Image with Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${disasterBg})`,
          }}
        >
          {/* Dark Overlay with blur effect */}
          <div className="absolute inset-0 bg-[#0a1628]/85 backdrop-blur-[2px]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 pt-18 pb-16">
          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Connecting <span className="text-[#4988C4]">Communities</span> in Crisis -
              <br />
              Building Resilience Together
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-300">
              A comprehensive Disaster Relief Management System connecting victims,
              volunteers, donors, and NGOs for effective disaster response.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mb-25">
            <button
              onClick={(e) => handleSignupClick(e)}
              className="inline-block bg-[#4988C4] text-white px-10 py-4 rounded-lg font-semibold text-lg hover:bg-[#629FAD] transition-all duration-300 cursor-pointer border-2 border-[#4988C4] hover:border-[#629FAD] shadow-lg hover:shadow-xl hover:scale-105"
            >
              Join ResQ Now
            </button>
          </div>

          {/* Stats Marquee Section */}
          <div className="mt-16 bg-[#0F2854]/60 backdrop-blur-md p-6 rounded-3xl border border-[#4988C4]/30 shadow-2xl overflow-hidden">
            <div className="stats-marquee-wrapper">
              <div className="stats-marquee-content">
                {/* First set of 4 stats */}
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#4988C4]">
                    {loading ? '...' : `${stats.disastersManaged}+`}
                  </div>
                  <div className="text-xl text-gray-300">Disasters Managed</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#5A7863]">
                    {loading ? '...' : `${stats.victimsHelped}+`}
                  </div>
                  <div className="text-xl text-gray-300">Victims Helped</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#629FAD]">
                    {loading ? '...' : `${stats.activeVolunteers}+`}
                  </div>
                  <div className="text-xl text-gray-300">Active Volunteers</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#BDE8F5]">
                    {loading ? '...' : `${stats.donors}+`}
                  </div>
                  <div className="text-xl text-gray-300">Generous Donors</div>
                </div>
                {/* Duplicate set for seamless loop */}
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#4988C4]">
                    {loading ? '...' : `${stats.disastersManaged}+`}
                  </div>
                  <div className="text-xl text-gray-300">Disasters Managed</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#5A7863]">
                    {loading ? '...' : `${stats.victimsHelped}+`}
                  </div>
                  <div className="text-xl text-gray-300">Victims Helped</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#629FAD]">
                    {loading ? '...' : `${stats.activeVolunteers}+`}
                  </div>
                  <div className="text-xl text-gray-300">Active Volunteers</div>
                </div>
                <div className="stat-item">
                  <div className="text-5xl font-bold mb-2 text-[#BDE8F5]">
                    {loading ? '...' : `${stats.donors}+`}
                  </div>
                  <div className="text-xl text-gray-300">Generous Donors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${disasterBg})` }}
        >
          <div className="absolute inset-0 bg-[#0a1628]/90 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Victim Services */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#5A7863]/50 hover:border-[#5A7863] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#5A7863]/20 hover:bg-[#0F2854]/80 cursor-pointer group">
              <div className="text-4xl mb-4 text-[#5A7863] transition-transform duration-300 group-hover:scale-100">
                <FontAwesomeIcon icon={faPersonCirclePlus} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">For Victims</h3>
              <p className="text-gray-300 mb-4">
                Request aid, report your situation, and receive help from volunteers and donors.
              </p>
              <button
                onClick={(e) => handleSignupClick(e, 'VICTIM')}
                className="text-[#5A7863] hover:text-[#BDE8F5] font-semibold cursor-pointer bg-none border-none p-0"
              >
                Register as Victim →
              </button>
            </div>

            {/* Volunteer Services */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#629FAD]/50 hover:border-[#629FAD] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#629FAD]/20 hover:bg-[#0F2854]/80 cursor-pointer group">
              <div className="text-4xl mb-4 text-[#629FAD] transition-transform duration-300 group-hover:scale-100">
                <FontAwesomeIcon icon={faHandshake} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">For Volunteers</h3>
              <p className="text-gray-300 mb-4">
                Choose tasks, help victims on-field or off-field, and make a difference.
              </p>
              <button
                onClick={(e) => handleSignupClick(e, 'VOLUNTEER')}
                className="text-[#629FAD] hover:text-[#BDE8F5] font-semibold cursor-pointer bg-none border-none p-0"
              >
                Volunteer Now →
              </button>
            </div>

            {/* Donor Services */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#4988C4]/50 hover:border-[#4988C4] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#4988C4]/20 hover:bg-[#0F2854]/80 cursor-pointer group">
              <div className="text-4xl mb-4 text-[#4988C4] transition-transform duration-300 group-hover:scale-100">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">For Donors</h3>
              <p className="text-gray-300 mb-4">
                Donate money, items, or shelter to specific disasters or general relief.
              </p>
              <button
                onClick={(e) => handleSignupClick(e, 'DONOR')}
                className="text-[#4988C4] hover:text-[#BDE8F5] font-semibold cursor-pointer bg-none border-none p-0"
              >
                Start Donating →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${disasterBg})` }}
        >
          <div className="absolute inset-0 bg-[#0a1628]/90 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Platform Analytics</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Line Chart - Monthly Trends */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#5A7863]/50 hover:border-[#5A7863] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#5A7863]/20 hover:bg-[#0F2854]/80 group">
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#5A7863] transition-colors duration-300">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4988C4/30" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F2854', border: '1px solid #4988C4', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="victims" stroke="#5A7863" strokeWidth={2} />
                  <Line type="monotone" dataKey="volunteers" stroke="#4988C4" strokeWidth={2} />
                  <Line type="monotone" dataKey="donors" stroke="#296374" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Disaster Types */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#629FAD]/50 hover:border-[#629FAD] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#629FAD]/20 hover:bg-[#0F2854]/80 group">
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#629FAD] transition-colors duration-300">Disaster Types</h3>
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
                  <Tooltip contentStyle={{ backgroundColor: '#0F2854', border: '1px solid #4988C4', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Volunteer Roles */}
            <div className="bg-[#0F2854]/60 p-6 rounded-2xl border border-[#4988C4]/50 hover:border-[#4988C4] transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#4988C4]/20 hover:bg-[#0F2854]/80 group">
              <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#4988C4] transition-colors duration-300">Volunteer Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volunteerRoleData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4988C4/30" />
                  <XAxis dataKey="role" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#0F2854', border: '1px solid #4988C4', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="count" fill="#4988C4" name="Volunteers" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${disasterBg})` }}
        >
          <div className="absolute inset-0 bg-[#0a1628]/90 backdrop-blur-[2px]"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Join ResQ today and be part of a community dedicated to helping
            disaster victims and coordinating relief efforts.
          </p>

          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-[#1e3a5f] border border-[#4988C4]/50 text-[#BDE8F5] px-4 py-2 rounded-md text-sm font-medium">
              Disaster Management System
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
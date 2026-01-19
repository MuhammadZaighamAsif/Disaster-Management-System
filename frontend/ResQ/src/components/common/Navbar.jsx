import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmationModal from './LogoutConfirmationModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSignupClick = (e) => {
    e.preventDefault();
    if (user) {
      setShowLogoutConfirmation(true);
    } else {
      navigate('/signup');
    }
  };

  const handleLogoutAndSignup = () => {
    logout();
    setShowLogoutConfirmation(false);
    navigate('/signup');
  };

  const handleStayOnPage = () => {
    setShowLogoutConfirmation(false);
  };

  return (
    <nav className="bg-[#0F2854] text-white shadow-lg">
      <LogoutConfirmationModal
        isOpen={showLogoutConfirmation}
        onLogoutAndSignup={handleLogoutAndSignup}
        onStayOnPage={handleStayOnPage}
      />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
            ResQ
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/search" className="text-[#BDE8F5] hover:text-white transition">
              Search Disasters
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="text-[#BDE8F5] hover:text-white transition">
                  Login
                </Link>
                <button 
                  onClick={handleSignupClick}
                  className="bg-[#4988C4] text-white px-4 py-2 rounded-lg hover:bg-[#629FAD] transition cursor-pointer border-none"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={`/${user.role}/dashboard`} 
                  className="text-[#BDE8F5] hover:text-white transition"
                >
                  Dashboard
                </Link>
                <span className="text-sm text-[#BDE8F5]">
                  {user.name} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-[#296374] px-4 py-2 rounded-lg hover:bg-[#5A7863] transition text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

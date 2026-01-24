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
    <nav className="bg-[#0F2854] text-white shadow-xl border-b border-black ">
      <LogoutConfirmationModal
        isOpen={showLogoutConfirmation}
        onLogoutAndSignup={handleLogoutAndSignup}
        onStayOnPage={handleStayOnPage}
      />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-4xl font-bold text-white">
            ResQ
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/search" className="relative text-[#BDE8F5] hover:text-white transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#4988C4] after:transition-all after:duration-300 hover:after:w-full">
              Search Disasters
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="relative text-[#BDE8F5] hover:text-white transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#4988C4] after:transition-all after:duration-300 hover:after:w-full">
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
                  className="relative text-[#BDE8F5] hover:text-white transition after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-[#4988C4] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Dashboard
                </Link>
                <span className="text-sm ">
                  {user.name} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-[#296374] px-4 py-2 rounded-lg hover:bg-red-600 transition text-white "
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

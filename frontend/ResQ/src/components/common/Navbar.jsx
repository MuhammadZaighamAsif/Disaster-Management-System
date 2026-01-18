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
    <nav className="bg-linear-to-br bg-[#90AB8B] from-forest to-charcoal text-black shadow-lg">
      <LogoutConfirmationModal
        isOpen={showLogoutConfirmation}
        onLogoutAndSignup={handleLogoutAndSignup}
        onStayOnPage={handleStayOnPage}
      />
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            ResQ
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/search" className="hover:text-cream transition">
              Search Disasters
            </Link>
            
            {!user ? (
              <>
                <Link to="/login" className="hover:text-cream transition">
                  Login
                </Link>
                <button 
                  onClick={handleSignupClick}
                  className="bg-cream text-forest px-4 py-2 rounded-lg hover:bg-sage transition cursor-pointer border-none"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                <Link 
                  to={`/${user.role}/dashboard`} 
                  className="hover:text-cream transition"
                >
                  Dashboard
                </Link>
                <span className="text-sm">
                  {user.name} ({user.role})
                </span>
                <button 
                  onClick={handleLogout}
                  className="bg-charcoal px-4 py-2 rounded-lg hover:bg-sage transition"
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

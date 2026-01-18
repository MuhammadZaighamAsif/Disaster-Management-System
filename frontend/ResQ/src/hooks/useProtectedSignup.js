import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to handle protected navigation to signup page
 * Shows confirmation dialog if user is already logged in
 */
export const useProtectedSignup = () => {
  const { user, logout } = useAuth();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);

  const handleSignupClick = (e, role = null) => {
    // If user is logged in, show confirmation dialog
    if (user) {
      e.preventDefault();
      setPendingRole(role);
      setShowConfirmation(true);
    }
    // If not logged in, allow navigation to proceed naturally
  };

  const handleLogoutAndSignup = () => {
    logout();
    setShowConfirmation(false);
    
    // Navigate to signup with role if provided
    const url = pendingRole ? `/signup?role=${pendingRole}` : '/signup';
    window.location.href = url;
  };

  const handleStayOnPage = () => {
    setShowConfirmation(false);
    setPendingRole(null);
  };

  return {
    user,
    showConfirmation,
    handleSignupClick,
    handleLogoutAndSignup,
    handleStayOnPage
  };
};

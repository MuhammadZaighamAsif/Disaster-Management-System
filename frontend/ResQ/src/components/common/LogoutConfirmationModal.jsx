import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const LogoutConfirmationModal = ({ 
  isOpen, 
  onLogoutAndSignup, 
  onStayOnPage 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="text-charcoal text-2xl"
          />
          <h2 className="text-2xl font-bold text-forest">
            Already Logged In
          </h2>
        </div>

        {/* Close button */}
        <button
          onClick={onStayOnPage}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>

        {/* Message */}
        <p className="text-charcoal mb-6">
          You are currently logged in. Would you like to logout and create a new account, or stay on the current page?
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onLogoutAndSignup}
            className="flex-1 bg-forest text-white py-2 rounded-lg hover:bg-charcoal transition font-semibold"
          >
            Logout & Sign Up
          </button>
          <button
            onClick={onStayOnPage}
            className="flex-1 bg-sage text-white py-2 rounded-lg hover:bg-forest transition font-semibold"
          >
            Stay Here
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;

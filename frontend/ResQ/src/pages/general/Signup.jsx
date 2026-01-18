import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LogoutConfirmationModal from '../../components/common/LogoutConfirmationModal';
import {
  getNameError,
  getEmailError,
  getPhoneError,
  getCNICError,
  getAddressError,
  getPasswordError,
  getConfirmPasswordError,
  getDonorTypeError,
  getVolunteerRoleError,
  getSkillsError,
  validateSignupForm,
  hasErrors
} from '../../utils/validation';

const Signup = () => {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'VICTIM';
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

  // Check if user is already logged in and show confirmation
  useEffect(() => {
    if (user) {
      setShowLogoutConfirmation(true);
    }
  }, [user]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    password: '',
    confirmPassword: '',
    role: roleFromUrl, // Set role from URL param
    donorType: '', // for donors
    volunteerRole: '', // for volunteers
    volunteerSkills: '' // for volunteers
  });
  
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    cnic: '',
    address: '',
    password: '',
    confirmPassword: '',
    donorType: '',
    volunteerRole: '',
    volunteerSkills: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Real-time validation on field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate the specific field
    if (name === 'name') {
      setErrors(prev => ({ ...prev, name: getNameError(value) }));
    } else if (name === 'email') {
      setErrors(prev => ({ ...prev, email: getEmailError(value) }));
    } else if (name === 'phone') {
      setErrors(prev => ({ ...prev, phone: getPhoneError(value) }));
    } else if (name === 'cnic') {
      setErrors(prev => ({ ...prev, cnic: getCNICError(value) }));
    } else if (name === 'address') {
      setErrors(prev => ({ ...prev, address: getAddressError(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({
        ...prev,
        password: getPasswordError(value),
        confirmPassword: formData.confirmPassword ? getConfirmPasswordError(value, formData.confirmPassword) : ''
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, confirmPassword: getConfirmPasswordError(formData.password, value) }));
    } else if (name === 'volunteerSkills') {
      setErrors(prev => ({ ...prev, volunteerSkills: getSkillsError(value) }));
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'donorType') {
      setErrors(prev => ({ ...prev, donorType: getDonorTypeError(value, formData.role) }));
    } else if (name === 'volunteerRole') {
      setErrors(prev => ({ ...prev, volunteerRole: getVolunteerRoleError(value, formData.role) }));
    }
  };

  const handleLogoutAndSignup = () => {
    logout();
    setShowLogoutConfirmation(false);
    // Reset form data after logout
    setFormData({
      name: '',
      email: '',
      phone: '',
      cnic: '',
      address: '',
      password: '',
      confirmPassword: '',
      role: roleFromUrl,
      donorType: '',
      volunteerRole: '',
      volunteerSkills: ''
    });
  };

  const handleStayOnPage = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all fields
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
    
    if (hasErrors(validationErrors)) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);

    const result = await signup(formData);
    
    if (result.success) {
      const userRole = result.user?.role?.toLowerCase();
      navigate(`/${userRole}/dashboard`);
    } else {
      setError(result.error || 'Signup failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <>
      <LogoutConfirmationModal 
        isOpen={showLogoutConfirmation}
        onLogoutAndSignup={handleLogoutAndSignup}
        onStayOnPage={handleStayOnPage}
      />

      <div className="min-h-screen bg-linear-to-br from-sage to-forest flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-forest">
          Sign Up for ResQ
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
              />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.phone ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
                placeholder="+92-XXX-XXXXXXX"
              />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* CNIC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.cnic ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
                placeholder="XXXXX-XXXXXXX-X"
              />
              {errors.cnic && <p className="text-red-600 text-xs mt-1">{errors.cnic}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.address ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
              }`}
              placeholder="Enter your full address"
            />
            {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                className="w-full px-4 py-2 border border-forest rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
              >
                <option value="VICTIM">Victim</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="DONOR">Donor</option>
              </select>
            </div>

            {/* Donor Type */}
            {formData.role === 'DONOR' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donor Type *
                </label>
                <select
                  name="donorType"
                  value={formData.donorType}
                  onChange={handleSelectChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.donorType ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>
                {errors.donorType && <p className="text-red-600 text-xs mt-1">{errors.donorType}</p>}
              </div>
            )}

            {/* Volunteer Role */}
            {formData.role === 'VOLUNTEER' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volunteer Role *
                </label>
                <select
                  name="volunteerRole"
                  value={formData.volunteerRole}
                  onChange={handleSelectChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.volunteerRole ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="on-field">On-Field</option>
                  <option value="off-field">Off-Field</option>
                </select>
                {errors.volunteerRole && <p className="text-red-600 text-xs mt-1">{errors.volunteerRole}</p>}
              </div>
            )}
          </div>

          {/* Volunteer Skills */}
          {formData.role === 'VOLUNTEER' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (Optional)
              </label>
              <input
                type="text"
                name="volunteerSkills"
                value={formData.volunteerSkills}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.volunteerSkills ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
                placeholder="e.g., Medical, Transportation, Communication"
              />
              {errors.volunteerSkills && <p className="text-red-600 text-xs mt-1">{errors.volunteerSkills}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
              />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-forest focus:ring-sage'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-600 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || hasErrors(errors)}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-charcoal transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-forest hover:text-sage font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;

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

      <div className="min-h-screen bg-linear-to-br from-[#0F2854] via-[#1C4D8D] to-[#4988C4] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-2xl transform hover:scale-105 transition duration-300">
        {/* Header Gradient */}
        <div className="bg-linear-to-r from-[#0F2854] to-[#4988C4] px-8 py-10 text-center text-white">
          {/* <div className="text-5xl mb-3"></div> */}
          <h2 className="text-3xl font-bold">Join ResQ</h2>
          <p className="text-[#BDE8F5] mt-2">Create your account and make a difference</p>
        </div>

        <div className="px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6 shadow-md">
            <p className="font-semibold">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.email ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.email}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.phone ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
                placeholder="+92-XXX-XXXXXXX"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.phone}</p>}
            </div>

            {/* CNIC */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                CNIC
              </label>
              <input
                type="text"
                name="cnic"
                value={formData.cnic}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.cnic ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
                placeholder="XXXXX-XXXXXXX-X"
              />
              {errors.cnic && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.cnic}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                errors.address ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
              }`}
              placeholder="Enter your full address"
            />
            {errors.address && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Role */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                className="w-full px-4 py-3 border-2 border-[#EBF4DD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:ring-opacity-20 transition"
              >
                <option value="VICTIM">Victim</option>
                <option value="VOLUNTEER">Volunteer</option>
                <option value="DONOR">Donor</option>
              </select>
            </div>

            {/* Donor Type */}
            {formData.role === 'DONOR' && (
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Donor Type *
                </label>
                <select
                  name="donorType"
                  value={formData.donorType}
                  onChange={handleSelectChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.donorType ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                  }`}
                >
                  <option value="">Select Type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>
                {errors.donorType && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.donorType}</p>}
              </div>
            )}

            {/* Volunteer Role */}
            {formData.role === 'VOLUNTEER' && (
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Volunteer Role *
                </label>
                <select
                  name="volunteerRole"
                  value={formData.volunteerRole}
                  onChange={handleSelectChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.volunteerRole ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                  }`}
                >
                  <option value="">Select Role</option>
                  <option value="on-field">On-Field</option>
                  <option value="off-field">Off-Field</option>
                </select>
                {errors.volunteerRole && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.volunteerRole}</p>}
              </div>
            )}
          </div>

          {/* Volunteer Skills */}
          {formData.role === 'VOLUNTEER' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Skills (Optional)
              </label>
              <input
                type="text"
                name="volunteerSkills"
                value={formData.volunteerSkills}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.volunteerSkills ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
                placeholder="e.g., Medical, Transportation, Communication"
              />
              {errors.volunteerSkills && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.volunteerSkills}</p>}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.password ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
              />
              {errors.password && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                }`}
              />
              {errors.confirmPassword && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.confirmPassword}</p>}
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
    </div>
    </>
  );
};

export default Signup;

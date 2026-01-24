import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPasswordError, hasErrors } from '../../utils/validation';
import disasterBg from '../../assets/disaster-bg.jpg';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, setUser } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    
    // Real-time validation
    if (name === 'email') {
      setErrors(prev => ({ ...prev, email: getEmailError(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ ...prev, password: getPasswordError(value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate fields
    const emailError = getEmailError(credentials.email);
    const passwordError = getPasswordError(credentials.password);
    
    setErrors({
      email: emailError,
      password: passwordError
    });

    if (emailError || passwordError) {
      setError('Please fix validation errors');
      return;
    }

    setLoading(true);

    // Hardcoded admin credentials for quick testing
    if (credentials.email === 'admin@resq.com' && credentials.password === 'Admin@123') {
      const adminUser = {
        id: 1,
        email: 'admin@resq.com',
        name: 'Admin User',
        role: 'ADMIN',
        isVerified: true,
        token: 'dummy-admin-token'
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('token', adminUser.token);
      setLoading(false);
      navigate('/admin/dashboard');
      return;
    }

    const result = await login(credentials);
    
    if (result.success) {
      // Redirect based on user role (convert to lowercase for URL)
      const role = result.user?.role?.toLowerCase() || 'victim';
      navigate(`/${role}/dashboard`);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 py-12">
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

      <div className="relative z-10 w-full max-w-md ">
        {/* Card Container */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-8 py-10 text-center border-b border-[#4988C4]/30">
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-300 mt-2">Login to your ResQ account</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-500/20 border-l-4 border-red-500 text-red-200 px-4 py-4 rounded-lg mb-6">
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-[#0a1628]/60 border-2 rounded-lg focus:outline-none focus:ring-2 transition text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 bg-[#0a1628]/60 border-2 rounded-lg focus:outline-none focus:ring-2 transition text-white placeholder-gray-400 ${
                      errors.password ? 'border-red-500 focus:ring-red-400' : 'border-[#4988C4]/30 focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#4988C4] transition"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-sm mt-2 font-semibold">⚠️ {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || hasErrors(errors)}
                className="w-full bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#629FAD] hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-bold uppercase tracking-wide disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none border-2 border-[#4988C4] hover:border-[#629FAD]"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t-2 border-[#4988C4]/30"></div>
              <span className="px-3 text-gray-400 text-sm font-semibold">OR</span>
              <div className="flex-1 border-t-2 border-[#4988C4]/30"></div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-300 text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#4988C4] hover:text-[#BDE8F5] font-bold transition underline">
                  Sign Up Here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info Box */}
        <div className="mt-6 bg-[#0F2854]/60 backdrop-blur-md rounded-lg p-4 text-gray-300 text-center border border-[#4988C4]/30">
          <p className="text-sm">
            Having trouble logging in? Contact us at <span className="font-semibold text-[#4988C4]">support@resq.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

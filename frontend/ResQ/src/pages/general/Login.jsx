import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getEmailError, getPasswordError, hasErrors } from '../../utils/validation';

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
    <div className="min-h-screen bg-linear-to-br from-[#0F2854] via-[#1C4D8D] to-[#4988C4] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition duration-300">
          {/* Header Gradient */}
          <div className="bg-linear-to-r from-[#0F2854] to-[#4988C4] px-8 py-12 text-center text-white">
            {/* <div className="text-5xl mb-4"></div> */}
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="text-[#BDE8F5] mt-2">Login to your ResQ account</p>
          </div>

          <div className="px-8 py-8">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-lg mb-6 shadow-md">
                <p className="font-semibold">Error</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                  }`}
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-[#0F2854] mb-3 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.password ? 'border-red-500 focus:ring-red-400' : 'border-[#EBF4DD] focus:border-[#4988C4] focus:ring-[#4988C4] focus:ring-opacity-20'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#296374] hover:text-[#0F2854] transition"
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
                {errors.password && <p className="text-red-600 text-sm mt-2 font-semibold">⚠️ {errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || hasErrors(errors)}
                className="w-full bg-linear-to-r from-[#4988C4] to-[#629FAD] text-white py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 font-bold uppercase tracking-wide disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t-2 border-[#a7d55d]"></div>
              <span className="px-3 text-[#296374] text-sm font-semibold">OR</span>
              <div className="flex-1 border-t-2 border-[#a7d55d]"></div>
            </div>

            {/* Demo Credentials Info */}
            {/* <div className="bg-[#EBF4DD] rounded-lg p-4 mb-6 border-l-4 border-[#4988C4]">
              <p className="text-[#0F2854] text-xs font-semibold mb-2">Demo Credentials:</p>
              <p className="text-[#296374] text-xs">Email: <span className="font-mono font-semibold">admin@resq.com</span></p>
              <p className="text-[#296374] text-xs">Password: <span className="font-mono font-semibold">Admin@123</span></p>
            </div> */}

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-[#3B4953] text-sm">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#4988C4] hover:text-[#0F2854] font-bold transition">
                  Sign Up Here
                </Link>
              </p>
            </div>

            {/* Footer Info */}
            <div className="mt-6 pt-6 border-t border-[#EBF4DD] text-center">
              <p className="text-[#296374] text-xs">
                Secure login powered by ResQ • Your data is encrypted
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Info Box */}
        <div className="mt-6 bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-4 text-black text-center">
          <p className="text-sm">
            Having trouble logging in? Contact us at <span className="font-semibold">support@resq.com</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

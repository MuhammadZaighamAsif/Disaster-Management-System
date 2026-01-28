import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faArrowLeft, faEnvelope, faIdCard, faCalendar, faShieldHalved, faPen, faSave, faTimes, faCheckCircle, faClock, faBriefcase } from '@fortawesome/free-solid-svg-icons';

const Profile = () => {
  useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cnic: '',
    role: '',
    donorType: '',
    volunteerRole: '',
    skills: '',
    workingHours: '',
    experience: '',
    isVerified: false,
    createdAt: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        setProfileData({
          name: result.data.name || '',
          email: result.data.email || '',
          phone: result.data.phone || '',
          address: result.data.address || '',
          cnic: result.data.cnic || '',
          role: result.data.role || '',
          donorType: result.data.donorType || '',
          volunteerRole: result.data.volunteerRole || '',
          skills: result.data.skills || result.data.volunteerSkills || '',
          workingHours: result.data.workingHours || '',
          experience: result.data.experience || '',
          isVerified: result.data.isVerified || false,
          createdAt: result.data.createdAt || ''
        });
      } else {
        setError('Failed to load profile');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          address: profileData.address,
          cnic: profileData.cnic,
          donorType: profileData.donorType,
          volunteerRole: profileData.volunteerRole,
          skills: profileData.skills,
          workingHours: profileData.workingHours,
          experience: profileData.experience
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.message || 'Failed to update profile');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-[#4988C4]/20 text-[#BDE8F5] border border-[#4988C4]/50',
      VOLUNTEER: 'bg-[#629FAD]/20 text-[#BDE8F5] border border-[#629FAD]/50',
      DONOR: 'bg-[#5A7863]/20 text-[#90AB8B] border border-[#5A7863]/50',
      VICTIM: 'bg-[#296374]/20 text-[#BDE8F5] border border-[#296374]/50'
    };
    return colors[role] || 'bg-[#3B4953]/20 text-gray-300 border border-[#3B4953]/50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] py-8">
        <div className="container mx-auto px-4 text-center py-20">
          <div className="text-xl text-[#4988C4] font-semibold">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] py-8">
      <div className="container mx-auto px-4 max-w-8xl">
        {/* Header Card */}
        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl p-8 mb-8 text-white border border-[#4988C4]/30 shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="text-[#4988C4] hover:text-white flex items-center gap-2 mb-6 font-semibold transition"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-white">My Profile</h1>
              <p className="text-gray-300 text-lg">Manage your account information</p>
            </div>
            <div className="text-7xl text-[#4988C4]/30">
              <FontAwesomeIcon icon={faUser} />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faTimes} />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-6 py-4 rounded-xl mb-6 backdrop-blur-md flex items-center gap-3">
            <FontAwesomeIcon icon={faCheckCircle} />
            {success}
          </div>
        )}

        <div className="bg-[#0F2854]/60 backdrop-blur-md rounded-2xl border border-[#4988C4]/30 shadow-lg p-8">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b border-[#4988C4]/30">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 bg-linear-to-br from-[#4988C4] to-[#629FAD] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg shadow-[#4988C4]/20">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                <p className="text-gray-400 flex items-center gap-2 mt-1">
                  <FontAwesomeIcon icon={faEnvelope} className="text-[#4988C4]" />
                  {profileData.email}
                </p>
                <div className="flex gap-3 mt-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getRoleColor(profileData.role)}`}>
                    {profileData.role}
                  </span>
                  {profileData.isVerified && (
                    <span className="bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#4988C4] text-white px-6 py-3 rounded-xl hover:bg-[#4988C4]/80 transition duration-300 font-semibold shadow-lg shadow-[#4988C4]/20 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPen} />
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-5 text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faIdCard} className="text-[#4988C4]" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 bg-[#0a1628]/30 border border-[#3B4953]/30 rounded-xl text-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    CNIC
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={profileData.cnic}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="xxxxx-xxxxxxx-x"
                    className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Information */}
            {(profileData.role === 'DONOR' || profileData.role === 'VOLUNTEER') && (
              <div className="mb-8 pt-8 border-t border-[#4988C4]/30">
                <h3 className="text-xl font-bold mb-5 text-white flex items-center gap-3">
                  <FontAwesomeIcon icon={faBriefcase} className="text-[#629FAD]" />
                  {profileData.role === 'DONOR' ? 'Donor' : 'Volunteer'} Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {profileData.role === 'DONOR' && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                        Donor Type
                      </label>
                      <select
                        name="donorType"
                        value={profileData.donorType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white transition duration-300"
                      >
                        <option value="">Select Type</option>
                        <option value="INDIVIDUAL">Individual</option>
                        <option value="NGO">NGO</option>
                        <option value="ORGANIZATION">Organization</option>
                      </select>
                    </div>
                  )}

                  {profileData.role === 'VOLUNTEER' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                          Volunteer Role
                        </label>
                        <select
                          name="volunteerRole"
                          value={profileData.volunteerRole}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white transition duration-300"
                        >
                          <option value="">Select Role</option>
                          <option value="ON-FIELD">On-Field</option>
                          <option value="OFF-FIELD">Off-Field</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          name="workingHours"
                          value={profileData.workingHours}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="e.g., 9 AM - 5 PM"
                          className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                          Skills
                        </label>
                        <textarea
                          name="skills"
                          value={profileData.skills}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={2}
                          placeholder="e.g., First Aid, Communication, Leadership"
                          className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300 resize-none"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                          Experience
                        </label>
                        <textarea
                          name="experience"
                          value={profileData.experience}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={2}
                          placeholder="Describe your relevant experience"
                          className="w-full px-4 py-3 bg-[#0a1628]/50 border border-[#4988C4]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4988C4] focus:border-transparent disabled:bg-[#0a1628]/30 disabled:border-[#3B4953]/30 text-white placeholder-gray-500 transition duration-300 resize-none"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="pt-8 border-t border-[#4988C4]/30">
              <h3 className="text-xl font-bold mb-5 text-white flex items-center gap-3">
                <FontAwesomeIcon icon={faShieldHalved} className="text-[#5A7863]" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Member Since
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#0a1628]/30 border border-[#3B4953]/30 rounded-xl text-gray-400">
                    <FontAwesomeIcon icon={faCalendar} className="text-[#4988C4]" />
                    {new Date(profileData.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">
                    Account Status
                  </label>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${profileData.isVerified ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'}`}>
                    <FontAwesomeIcon icon={profileData.isVerified ? faCheckCircle : faClock} />
                    {profileData.isVerified ? 'Verified' : 'Pending Verification'}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-8 pt-8 border-t border-[#4988C4]/30">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#5A7863] text-white py-3 rounded-xl hover:bg-[#5A7863]/80 transition duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold shadow-lg shadow-[#5A7863]/20 flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="flex-1 bg-[#3B4953] text-white py-3 rounded-xl hover:bg-[#3B4953]/80 transition duration-300 font-semibold flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;

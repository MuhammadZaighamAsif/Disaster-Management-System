import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
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
      const response = await fetch('http://localhost:5000/api/auth/me', {
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
      ADMIN: 'bg-[#1C4D8D] text-[#BDE8F5]',
      VOLUNTEER: 'bg-[#4988C4] text-white',
      DONOR: 'bg-[#90AB8B] text-white',
      VICTIM: 'bg-[#296374] text-white'
    };
    return colors[role] || 'bg-[#EDEDCE] text-[#3B4953]';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF4DD] py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-xl text-[#3B4953] font-semibold">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF4DD] py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-[#0F2854] text-white px-8 py-8 rounded-2xl shadow-xl mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">My Profile</h1>
            <p className="text-[#BDE8F5] mt-2">Manage your account information</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-[#BDE8F5] hover:text-white bg-[#296374] hover:bg-[#1C4D8D] px-6 py-3 rounded-lg flex items-center gap-2 transition duration-300 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg mb-6 font-semibold shadow-md">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg mb-6 font-semibold shadow-md">
            {success}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#EDEDCE]">
          {/* Profile Header */}
          <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-[#EDEDCE]">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-[#4988C4] text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[#0F2854]">{profileData.name}</h2>
                <p className="text-[#5A7863]">{profileData.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleColor(profileData.role)}`}>
                    {profileData.role}
                  </span>
                  {profileData.isVerified && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-[#4988C4] text-white px-6 py-3 rounded-lg hover:bg-[#1C4D8D] transition duration-300 hover:scale-105 font-semibold shadow-md"
              >
                Edit Profile
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 text-[#0F2854]">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-[#EDEDCE] rounded-lg bg-[#EDEDCE] text-[#3B4953]"
                  />
                  <p className="text-xs text-[#5A7863] mt-1 font-semibold">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                  />
                </div>

                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    CNIC
                  </label>
                  <input
                    type="text"
                    name="cnic"
                    value={profileData.cnic}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="xxxxx-xxxxxxx-x"
                    className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={2}
                    className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                  />
                </div>
              </div>
            </div>

            {/* Role-Specific Information */}
            {(profileData.role === 'DONOR' || profileData.role === 'VOLUNTEER') && (
              <div className="mb-6 pt-6 border-t-2 border-[#EDEDCE]">
                <h3 className="text-xl font-bold mb-4 text-[#0F2854]">
                  {profileData.role === 'DONOR' ? 'Donor' : 'Volunteer'} Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.role === 'DONOR' && (
                    <div>
                      <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                        Donor Type
                      </label>
                      <select
                        name="donorType"
                        value={profileData.donorType}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] transition duration-300 bg-white"
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
                        <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                          Volunteer Role
                        </label>
                        <select
                          name="volunteerRole"
                          value={profileData.volunteerRole}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] transition duration-300 bg-white"
                        >
                          <option value="">Select Role</option>
                          <option value="ON-FIELD">On-Field</option>
                          <option value="OFF-FIELD">Off-Field</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          name="workingHours"
                          value={profileData.workingHours}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="e.g., 9 AM - 5 PM"
                          className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                          Skills
                        </label>
                        <textarea
                          name="skills"
                          value={profileData.skills}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={2}
                          placeholder="e.g., First Aid, Communication, Leadership"
                          className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                          Experience
                        </label>
                        <textarea
                          name="experience"
                          value={profileData.experience}
                          onChange={handleChange}
                          disabled={!isEditing}
                          rows={2}
                          placeholder="Describe your relevant experience"
                          className="w-full px-4 py-3 border-2 border-[#90AB8B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4988C4] disabled:bg-[#EDEDCE] disabled:border-[#EDEDCE] text-[#3B4953] placeholder-[#5A7863] transition duration-300"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Account Information */}
            <div className="pt-6 border-t-2 border-[#EDEDCE]">
              <h3 className="text-xl font-bold mb-4 text-[#0F2854]">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Member Since
                  </label>
                  <input
                    type="text"
                    value={new Date(profileData.createdAt).toLocaleDateString()}
                    disabled
                    className="w-full px-4 py-3 border-2 border-[#EDEDCE] rounded-lg bg-[#EDEDCE] text-[#3B4953]"
                  />
                </div>
                <div>
                  <label className="block text-sm  text-[#0F2854] mb-2 font-semibold">
                    Account Status
                  </label>
                  <input
                    type="text"
                    value={profileData.isVerified ? 'Verified' : 'Pending Verification'}
                    disabled
                    className="w-full px-4 py-3 border-2 border-[#EDEDCE] rounded-lg bg-[#EDEDCE] text-[#3B4953] font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-4 mt-6 pt-6 border-t-2 border-[#EDEDCE]">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#4988C4] text-white py-3 rounded-lg hover:bg-[#1C4D8D] transition duration-300 hover:scale-105 disabled:bg-gray-400 disabled:scale-100 font-semibold shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    fetchProfile();
                  }}
                  className="flex-1 bg-[#90AB8B] text-white py-3 rounded-lg hover:bg-[#5A7863] transition duration-300 hover:scale-105 font-semibold shadow-md"
                >
                  ✕ Cancel
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

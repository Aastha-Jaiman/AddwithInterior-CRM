"use client"
import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  HomeIcon,
  XIcon
} from 'lucide-react';

// Import your API services
import { getClientProfile, resetClientPassword } from '../../services/client.services'; // Adjust path as needed

const ClientProfile = () => {
  const [profileLoading, setProfileLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Initialize empty client data
  const [clientData, setClientData] = useState({
    _id: '',
    name: '',
    email: '',
    phone: '',
    profile: { url: '', public_id: '' },
    address: [],
    isActive: false,
    createdAt: '',
    updatedAt: ''
  });
  
  // Fetch client profile on component mount
  useEffect(() => {
    fetchClientProfile();
  }, []);

  const fetchClientProfile = async () => {
    setProfileLoading(true);
    try {
      const response = await getClientProfile();
      
      if (response.success && response.client) {
        const clientProfileData = {
          _id: response.client._id || '',
          name: response.client.name || '',
          email: response.client.email || '',
          phone: response.client.phone || '',
          profile: response.client.profile || { url: '', public_id: '' },
          address: response.client.address || [],
          isActive: response.client.isActive || false,
          createdAt: response.client.createdAt || '',
          updatedAt: response.client.updatedAt || ''
        };
        
        setClientData(clientProfileData);
      } else {
        throw new Error(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching client profile:', error);
      alert(error.message || 'Failed to load profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validatePasswordForm = () => {
    const { oldPassword, newPassword, confirmPassword } = passwordData;
    
    if (!oldPassword.trim()) {
      alert('Please enter your current password');
      return false;
    }
    
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return false;
    }
    
    if (newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return false;
    }
    
    if (oldPassword === newPassword) {
      alert('New password must be different from current password');
      return false;
    }
    
    return true;
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) {
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await resetClientPassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      if (response.success) {
        alert('Password reset successfully!');
        // Reset form
        setPasswordData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setShowPasswordForm(false);
      } else {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert(error.response?.data?.message || error.message || 'Failed to reset password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const cancelPasswordReset = () => {
    setPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordForm(false);
    setShowPasswords({
      oldPassword: false,
      newPassword: false,
      confirmPassword: false
    });
  };

  const getStatusColor = (status) => {
    return status 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state while fetching profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-6">
                {/* Avatar Section */}
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                    <img
                      src={clientData.profile?.url || '/default-avatar.png'}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Client Info */}
                <div className="text-white">
                  <h1 className="text-3xl font-bold">{clientData.name || 'No Name'}</h1>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(clientData.isActive)}`}>
                      {clientData.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {clientData._id && (
                      <span className="text-white/80">ID: {clientData._id}</span>
                    )}
                  </div>

                  {clientData.createdAt && (
                    <div className="flex items-center gap-2 mt-3 text-white/80 text-sm">
                      <CalendarIcon className="w-4 h-4" />
                      <span>Joined {formatDate(clientData.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Reset Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur transition-colors"
                >
                  <KeyIcon className="w-4 h-4" />
                  {showPasswordForm ? 'Cancel' : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Contact Information - Read Only */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MailIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{clientData.email || 'No email'}</span>
              </div>

              <div className="flex items-center gap-3">
                <PhoneIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{clientData.phone || 'No phone'}</span>
              </div>

              {clientData.updatedAt && (
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">
                    Last Updated: {formatDate(clientData.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Address Information - Read Only */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                Addresses
              </h3>
            </div>

            <div className="space-y-4">
              {clientData.address.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPinIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No addresses added yet</p>
                </div>
              ) : (
                clientData.address.map((addr) => (
                  <div key={addr._id} className="border rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <HomeIcon className="w-4 h-4 text-blue-600" />
                          <span className="font-semibold text-gray-900 capitalize">
                            {addr.addresstype}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {addr.addressinfo.street}<br />
                          {addr.addressinfo.city}, {addr.addressinfo.state}<br />
                          {addr.addressinfo.country} - {addr.addressinfo.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Password Reset Form - Shows at bottom when button is clicked */}
        {showPasswordForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-blue-600" />
                Reset Password
              </h3>
              <button
                onClick={cancelPasswordReset}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password * 
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.oldPassword ? 'text' : 'password'}
                    value={passwordData.oldPassword}
                    onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('oldPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.oldPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.newPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.newPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswords.confirmPassword ? (
                      <EyeOffIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircleIcon className="w-3 h-3" />
                    Passwords do not match
                  </p>
                )}
                {passwordData.newPassword && passwordData.confirmPassword && 
                 passwordData.newPassword === passwordData.confirmPassword && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    Passwords match
                  </p>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  {passwordLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <KeyIcon className="w-4 h-4" />
                      Update Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelPasswordReset}
                  className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;

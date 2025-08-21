"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Camera, Lock, Save, X, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { getClientProfile, resetClientPassword } from '../../services/client.services';

const ClientProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getClientProfile();
      console.log("response", response);
      if (response.success && response.client) {
        setProfileData(response.client);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to load profile' });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Error loading profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long' });
      return;
    }

    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setMessage({ type: 'error', text: 'New password must be different from current password' });
      return;
    }

    setPasswordLoading(true);
    try {
      const response = await resetClientPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Password updated successfully!' });
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswords({ oldPassword: false, newPassword: false, confirmPassword: false });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Error updating password. Please try again.' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const scrollToPasswordForm = () => {
    setIsChangingPassword(true);
    setTimeout(() => {
      const element = document.getElementById('password-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const getStatusColor = (status) => {
    return status ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-medium">Error loading profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm flex items-center justify-between transition-all duration-200 ${
            message.type === 'success' ? 'bg-red-50 text-red-800 border border-red-200' :'bg-green-50 text-green-800 border border-green-200'
          }`}>
            <div className="flex items-center">
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span className="text-sm font-medium">{message.text}</span>
            </div>
            <button onClick={() => setMessage({ type: '', text: '' })} className="hover:opacity-75">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex flex-col md:flex-row items-center md:items-start justify-between">
            {/* Profile Image, Name, and Status */}
            <div className="flex items-center md:items-start gap-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  {profileData.profile?.url ? (
                    <img 
                      src={profileData.profile.url} 
                      alt="Profile" 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-12 w-12 text-gray-500" />
                  )}
                </div>
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                  profileData.isActive ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(profileData.isActive)} mt-2`}>
                  {profileData.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
            {/* Action Button */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={scrollToPasswordForm}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <User className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Full Name</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{profileData.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Mail className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{profileData.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{profileData.phone}</p>
                  </div>
                </div>
                {/* <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Shield className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{profileData.isActive ? 'Active' : 'Inactive'}</p>
                  </div>
                </div> */}
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Member Since</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{formatDate(profileData.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Last Updated</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{formatDate(profileData.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Addresses */}
            {profileData.address && profileData.address.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Addresses</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profileData.address.map((addr, index) => (
                    <div key={index} className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                        <div>
                          <p className="text-gray-800 text-sm font-medium">{addr.addressinfo?.street}</p>
                          <p className="text-gray-600 text-sm">
                            {addr.addressinfo?.city}, {addr.addressinfo?.state}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {addr.addressinfo?.country} - {addr.addressinfo?.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Form */}
        {isChangingPassword && (
          <div id="password-form" className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                    setShowPasswords({ oldPassword: false, newPassword: false, confirmPassword: false });
                    setMessage({ type: '', text: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('oldPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.oldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.newPassword ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('newPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.newPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirmPassword ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                      setShowPasswords({ oldPassword: false, newPassword: false, confirmPassword: false });
                      setMessage({ type: '', text: '' });
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                  >
                    {passwordLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
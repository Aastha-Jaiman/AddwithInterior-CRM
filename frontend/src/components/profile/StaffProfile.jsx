"use client"
import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, Camera, Lock, Save, X, Eye, EyeOff, Edit } from 'lucide-react';
import { getProfile, resetPassword, updateMyProfileService } from '@/services/admin.services';

const ProfileComponent = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    secondaryPhone: '',
    profile: null
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [updateLoading, setUpdateLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      console.log("response", response)
      if (response.success) {
        setProfileData(response.user);
        setEditForm({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || '',
          address: response.user.address || '',
          secondaryPhone: response.user.secondaryPhone || '',
          profile: null
        });
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('address', editForm.address);

      if (profileData?.role === 'admin') {
        formData.append('email', editForm.email);
        formData.append('phone', editForm.phone);
        if (editForm.secondaryPhone) {
          formData.append('secondaryPhone', editForm.secondaryPhone);
        }
      }

      if (editForm.profile instanceof File) {
        formData.append('profile', editForm.profile);
      }

      const response = await updateMyProfileService(formData);

      if (response.status === 401) {
        setMessage({ type: 'error', text: response.message || 'Unauthorized update attempt.' });
        return;
      }

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Profile updated successfully!' });
        setIsEditing(false);
        await fetchProfile();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 401) {
        setMessage({ type: 'error', text: error.response.data?.message || 'Unauthorized update attempt.' });
      } else {
        setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
      }
    } finally {
      setUpdateLoading(false);
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

    setPasswordLoading(true);

    try {
      const response = await resetPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      });

      if (response.success) {
        setMessage({ type: 'success', text: response.message || 'Password updated successfully!' });
        setIsChangingPassword(false);
        setPasswordForm({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage({ type: 'error', text: 'Error updating password. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatDate = (dateString) => {
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

  const scrollToForm = (formType) => {
    if (formType === 'edit') {
      setIsEditing(true);
      setIsChangingPassword(false);
    } else if (formType === 'password') {
      setIsChangingPassword(true);
      setIsEditing(false);
    }

    setTimeout(() => {
      const element = document.getElementById(formType === 'edit' ? 'edit-form' : 'password-form');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg">
          <p className="text-lg font-medium text-red-600">Error loading profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-5xl mx-auto p-6">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl shadow-sm flex items-center justify-between transition-all duration-200 ${message.type === 'success' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
            <span className="text-sm font-medium">{message.text}</span>
            <button onClick={() => setMessage({ type: '', text: '' })} className="hover:opacity-75">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50 flex flex-col md:flex-row items-center md:items-start justify-between">
            {/* Profile Image, Name, and Role */}
            <div className="flex items-center md:items-start gap-4">
              <div className="relative">
                <img
                  src={profileData.profile?.url || '/api/placeholder/150/150'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                />
                <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${profileData.isactive ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-semibold text-gray-900">{profileData.name}</h2>
                <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600 capitalize text-sm font-medium">{profileData.role}</span>
                </div>
                {profileData.isVerified && (
                  <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    <User className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() => scrollToForm('password')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
              >
                <Lock className="w-4 h-4" />
                Change Password
              </button>
              <button
                onClick={() => scrollToForm('edit')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              {profileData.secondaryPhone && (
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                  <Phone className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Secondary Phone</label>
                    <p className="text-gray-800 text-sm font-medium mt-1">{profileData.secondaryPhone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                <MapPin className="w-5 h-5 text-indigo-600 mt-1" />
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Address</label>
                  <p className="text-gray-800 text-sm font-medium mt-1">{profileData.address}</p>
                </div>
              </div>

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
        </div>

        {/* Update Profile Form */}
        {isEditing && (
          <div id="edit-form" className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center gap-4">
                    <img
                      src={profileData.profile?.url || '/api/placeholder/60/60'}
                      alt="Current"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditForm({ ...editForm, profile: e.target.files[0] })}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-600 file:font-medium hover:file:bg-indigo-100 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>

                {profileData?.role === 'admin' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                      <input
                        type="tel"
                        value={editForm.secondaryPhone}
                        onChange={(e) => setEditForm({ ...editForm, secondaryPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      />
                    </div>
                  </>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleEditSubmit}
                  disabled={updateLoading}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                >
                  {updateLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Update Profile
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        {isChangingPassword && (
          <div id="password-form" className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPasswords.oldPassword ? "text" : "password"}
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
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
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      required
                      minLength="6"
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
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors duration-200"
                      required
                      minLength="6"
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
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={handlePasswordSubmit}
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
                      <Lock className="w-4 h-4" />
                      Change Password
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangingPassword(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors duration-200 text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileComponent;
"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Lock,
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { 
  getClientProfile, 
  resetClientPassword,
  updateClientByAdmin 
} from "@/services/client.services";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    profileImage: null,
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getClientProfile();
        console.log("Fetched profile data:", data);

        setUser(data);
        const userData = data.user;

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          profileImage: null,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateClick = () => {
    setShowUpdateForm(true);
    setShowPasswordForm(false);
  };

  const handleResetPasswordClick = () => {
    setShowPasswordForm(true);
    setShowUpdateForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage") {
      setFormData({ ...formData, profileImage: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    if (!user?.user?.id) {
      alert("User ID not found. Please refresh and try again.");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("phone", formData.phone);
    submissionData.append("address", formData.address);
    
    if (formData.profileImage) {
      submissionData.append("profileImage", formData.profileImage);
    }

    try {
      setLoading(true);
      // Using updateClientByAdmin service - you might need a self-update service
      const updated = await updateClientByAdmin(user.user.id, submissionData);
      
      // Refresh profile data after update
      const refreshedData = await getClientProfile();
      setUser(refreshedData);
      
      // Reset form data with updated values
      const userData = refreshedData.user;
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        profileImage: null,
      });
      
      setShowUpdateForm(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }

    if (oldPassword === newPassword) {
      alert("New password cannot be same as old password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters long.");
      return;
    }

    try {
      setLoading(true);
      await resetClientPassword({ 
        oldPassword, 
        newPassword, 
        confirmPassword 
      });
      
      alert("Password changed successfully!");
      setShowPasswordForm(false);
      setPasswordData({ 
        oldPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      });
    } catch (error) {
      console.error("Password reset failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your dgrtgrg</h1>
          <p className="text-gray-600">Manage your personal information and account settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  <img
                    src={
                      formData.profileImage
                        ? URL.createObjectURL(formData.profileImage)
                        : user?.user?.profile?.url || "https://via.placeholder.com/150?text=Profile"
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                {showUpdateForm && (
                  <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="text-center md:text-left text-white">
                <h2 className="text-2xl font-bold mb-2">{user?.user?.name || "User Name"}</h2>
                <p className="text-blue-100 mb-4">{user?.user?.email || "user@example.com"}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1">
                    <span className="text-sm">Client ID: {user?.user?.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Full Name</h3>
                    <p className="text-gray-600">{user?.user?.name || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Email</h3>
                    <p className="text-gray-600">{user?.user?.email || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Phone</h3>
                    <p className="text-gray-600">{user?.user?.phone || "Not provided"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Address</h3>
                    <p className="text-gray-600">{user?.user?.address || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleUpdateClick}
                disabled={loading}
              >
                <Edit3 className="w-5 h-5" />
                {loading ? "Loading..." : "Update Profile"}
              </button>
              <button
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleResetPasswordClick}
                disabled={loading}
              >
                <Lock className="w-5 h-5" />
                Reset Password
              </button>
            </div>
          </div>
        </div>

        {/* Update Profile Form */}
        {showUpdateForm && (
          <form
            onSubmit={handleUpdateSubmit}
            className="bg-white rounded-xl shadow-xl p-8 mt-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Profile Image Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-300">
                  <img
                    src={
                      formData.profileImage
                        ? URL.createObjectURL(formData.profileImage)
                        : user?.user?.profile?.url || "https://via.placeholder.com/150?text=Profile"
                    }
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleInputChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Click on image to change profile picture</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your address"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-6">
              <button
                type="button"
                onClick={() => setShowUpdateForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}

        {/* Reset Password Form */}
        {showPasswordForm && (
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-white rounded-xl shadow-xl p-8 mt-6 space-y-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Old Password</label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Enter old password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Enter new password"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                    placeholder="Confirm new password"
                    required
                    minLength={6}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-end pt-6">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <Lock className="w-5 h-5" />
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

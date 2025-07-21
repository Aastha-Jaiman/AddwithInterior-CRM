'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStaffByIdService, updateStaffByAdmin } from "@/services/admin.services";
import {
  User, Mail, Phone, MapPin, Shield, Camera, Edit3, Save, X, Check, UserCheck, UserX, Calendar, Award, Settings, ArrowLeft, Upload, Eye, EyeOff
} from 'lucide-react';

const permissionsList = [
  "upload_quotation",
  "view_quotations",
  "upload_design",
  "view_design_feedback",
  "upload_morning_update",
  "upload_evening_update",
  "view_daily_updates",
  "create_project",
  "assign_team",
  "manage_users",
  "manage_brochures",
  "see_all_projects",
  "view_client_info",
  "view_payment",
  "generate_invoice",
  "assign_service",
  "track_service",
];

const StaffDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [staff, setStaff] = useState(null);
  const [editData, setEditData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const data = await getStaffByIdService(id, token);
      setStaff(data.staff);
      console.log("hg", data)
    } catch (err) {
      setError("Failed to load staff details");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchStaff();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      name: staff.name,
      email: staff.email,
      permission: staff.permission || []
    });
    setImagePreview(staff.profile?.url || null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permission) => {
    setEditData(prev => ({
      ...prev,
      permission: prev.permission.includes(permission)
        ? prev.permission.filter(p => p !== permission)
        : [...prev.permission, permission]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(staff.profile?.url || null);
    if (document.getElementById('profile-image')) {
      document.getElementById('profile-image').value = '';
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", editData.name.trim());
      formData.append("email", editData.email.trim());
      formData.append("phone", staff.phone || "");
      formData.append("address", staff.address || "");
      formData.append("role", staff.role || "");
      formData.append("isactive", staff.isactive);

      // Append permissions
      if (editData.permission && editData.permission.length > 0) {
        editData.permission.forEach(permission => {
          formData.append('permission', permission);
        });
      }

      // Append profile image if changed
      if (profileImage) {
        formData.append('profile', profileImage);
      }

      const res = await updateStaffByAdmin(id, formData);

      if (res && res.success) {
        setIsEditing(false);
        setEditData(null);
        setProfileImage(null);
        setError(null);
        await fetchStaff();
      } else {
        throw new Error("Update failed");
      }

    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Update failed";
      setError(`Failed to update staff: ${msg}`);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData(null);
    setProfileImage(null);
    setImagePreview(null);
    setError(null);
  };

  const handleToggleActive = async (user) => {
    try {
      const formData = new FormData();
      formData.append("isactive", (!user.isactive).toString());

      const updatedUser = await updateStaffByAdmin(user._id, formData); // Fix: use _id

      if (!updatedUser || !updatedUser.success) {
        throw new Error("Update failed");
      }

      // Option 1: Fetch fresh data
      await fetchStaff();

      // Option 2 (if API returns updated user directly):
      // setStaff(prev => ({ ...prev, isactive: updatedUser.isactive }));

    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation");
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg font-semibold text-gray-700">Loading staff details...</span>
        </div>
      </div>
    );
  }

  if (error && !isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="bg-gray-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <User className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Staff Found</h3>
          <p className="text-gray-600 mb-4">The requested staff member could not be found.</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const displayData = isEditing ? editData : staff;

  // Edit Form
  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Edit3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">Edit Staff</h1>
                    <p className="text-blue-100 mt-1">Update staff information and permissions</p>
                  </div>
                </div>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center space-x-3">
                <X className="h-5 w-5 text-red-600" />
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            )}

            <div className="p-8 space-y-8">
              {/* Profile Image Upload */}
              <div className="text-center">
                <label className="block text-lg font-semibold text-gray-800 mb-4">Profile Image</label>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <img
                      src={imagePreview || '/api/placeholder/150/150'}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-100"
                    />
                    {profileImage && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105">
                    <Upload size={20} />
                    <span className="font-medium">Change Photo</span>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter full name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Permissions Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Permissions (Optional)
                </label>
                <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {permissionsList.map(permission => (
                      <label key={permission} className="flex items-center space-x-3 cursor-pointer bg-white hover:bg-blue-50 p-3 rounded-lg border border-gray-200 transition-all duration-300 hover:border-blue-300">
                        <input
                          type="checkbox"
                          checked={editData.permission.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700 font-medium">{permission.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {editData.permission.length} permission(s) selected
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving Changes...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Save className="mr-2 h-5 w-5" />
                      Save Changes
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-lg transition-all duration-300 font-semibold border-2 border-gray-200 hover:border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Detail View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.back()}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-3xl font-bold text-white">Staff Profile</h1>
                  <p className="text-blue-100 mt-1">Detailed information and permissions</p>
                </div>
              </div>
              <button
                onClick={handleEdit}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg transform hover:scale-105"
              >
                <Edit3 className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Profile Section */}
          <div className="p-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-40 h-40 rounded-2xl overflow-hidden shadow-xl ring-4 ring-blue-100">
                  <img
                    src={staff.profile?.url || '/api/placeholder/160/160'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className={`absolute -bottom-2 -right-2 p-3 rounded-full shadow-lg ${staff.isactive ? 'bg-green-500' : 'bg-gray-400'}`}>
                  {staff.isactive ? (
                    <UserCheck className="h-6 w-6 text-white" />
                  ) : (
                    <UserX className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-4xl font-bold text-gray-800 mb-2">{staff.name}</h2>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Shield className="h-4 w-4 mr-2" />
                    {staff.role?.charAt(0).toUpperCase() + staff.role?.slice(1) || 'No Role'}
                  </span>
                  <span
                    onClick={() => handleToggleActive(staff)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${staff.isactive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {staff.isactive ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Active
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Inactive
                      </>
                    )}
                  </span>
                </div>

                {/* Contact Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p className="text-gray-800 font-semibold">{staff.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-800 font-semibold">{staff.phone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact & Location */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <MapPin className="h-6 w-6 mr-2" />
                Contact & Location
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg mt-1">
                    <MapPin className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">Address</p>
                    <p className="text-gray-800 leading-relaxed">{staff.address || 'No address provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className=" bg-blue-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Shield className="h-6 w-6 mr-2" />
                Permissions
                <span className="ml-auto bg-white/20 px-3 py-1 rounded-full text-sm">
                  {Array.isArray(staff.permission) ? staff.permission.length : 0}
                </span>
              </h3>
            </div>
            <div className="p-6">
              {Array.isArray(staff.permission) && staff.permission.length > 0 ? (
                <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto">
                  {staff.permission.map((permission, index) => (
                    <div key={index} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="bg-purple-100 p-1.5 rounded">
                        <Award className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="text-gray-800 font-medium">
                        {typeof permission === "string" ? permission.replace(/_/g, " ") : permission}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No permissions assigned</p>
                  <p className="text-sm text-gray-400 mt-1">This staff member has no specific permissions</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
              <p className="text-gray-600">Manage this staff member's profile and settings</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg transform hover:scale-105"
              >
                <Edit3 className="h-5 w-5" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;
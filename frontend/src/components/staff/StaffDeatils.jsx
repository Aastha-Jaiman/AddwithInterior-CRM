'use client';
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStaffByIdService, updateStaffByAdmin } from "@/services/admin.services";
import {
  User, Mail, Phone, MapPin, Shield, Camera, Edit3, Save, X, Check,
  UserCheck, UserX, Calendar, Award, Settings, ArrowLeft, Upload,
  Eye, EyeOff, CreditCard, FileText, Briefcase
} from 'lucide-react';

const permissionsList = [
  "upload_quotation", "view_quotations", "upload_design", "view_design_feedback",
  "upload_morning_update", "upload_evening_update", "view_daily_updates",
  "create_project", "assign_team", "manage_users", "manage_brochures",
  "see_all_projects", "view_client_info", "view_payment", "generate_invoice",
  "assign_service", "track_service"
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
      console.log("staff data", data);
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
      phone: staff.phone || '',
      secondaryPhone: staff.secondaryPhone || '',
      address: staff.address || '',
      role: staff.role || '',
      aadhaarNumber: staff.aadhaarNumber || '',
      permission: staff.permission || []
    });
    setImagePreview(staff.profile?.url || null);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
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
      formData.append("phone", editData.phone.trim());
      formData.append("secondaryPhone", editData.secondaryPhone.trim());
      formData.append("address", editData.address.trim());
      formData.append("role", editData.role.trim());
      formData.append("aadhaarNumber", editData.aadhaarNumber.trim());
      formData.append("isactive", staff.isactive);

      if (editData.permission && editData.permission.length > 0) {
        editData.permission.forEach(permission => {
          formData.append('permission', permission);
        });
      }

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
      const updatedUser = await updateStaffByAdmin(user._id, formData);

      if (!updatedUser || !updatedUser.success) {
        throw new Error("Update failed");
      }
      await fetchStaff();
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (error && !staff) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserX className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Staff Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 flex items-center justify-center w-full"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!staff) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Staff List
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Staff Details</h1>
              <p className="text-gray-600">Manage staff information and permissions</p>
            </div>

            {!isEditing && (
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <button
                  onClick={() => handleToggleActive(staff)}
                  className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${staff.isactive
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                >
                  {staff.isactive ? (
                    <>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Active
                    </>
                  ) : (
                    <>
                      <UserX className="h-4 w-4 mr-2" />
                      Inactive
                    </>
                  )}
                </button>

                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium transition-colors duration-200 flex items-center"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Staff
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
            <X className="h-5 w-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Profile Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm  p-6">
              <div className="flex items-start gap-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24">
                    {imagePreview || staff.profile?.url ? (
                      <img
                        src={imagePreview || staff.profile?.url}
                        alt={staff.name}
                        className="w-full h-full rounded-lg object-cover border-2 border-gray-200"
                      />
                    ) : (
                      <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                        <User className="h-12 w-12 text-gray-400" />
                      </div>
                    )}

                    {isEditing && (
                      <div className="absolute -bottom-2 -right-2">
                        <label htmlFor="profile-image" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full cursor-pointer">
                          <Camera className="h-3 w-3" />
                        </label>
                        <input
                          id="profile-image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </div>
                    )}

                    {isEditing && profileImage && (
                      <button
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Staff Information */}
                <div className="flex-1">
                  {/* Name */}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl font-semibold w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none mb-3"
                      placeholder="Staff Name"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{staff.name}</h2>
                  )}

                  {/* Role and Status Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="border border-gray-300 rounded-md px-3 py-1 focus:border-blue-500 focus:outline-none"
                        placeholder="Role"
                      />
                    ) : (
                      <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {staff.role || 'No Role'}
                      </span>
                    )}

                    {/* Status Badge */}
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-sm ${staff.isactive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {staff.isactive ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <X className="h-3 w-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </span>

                    {/* Verification Badge */}
                    {staff.isVerified && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <div className="flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined
                      </div>
                      <div className="font-medium">{formatDate(staff.createdAt)}</div>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Settings className="h-3 w-3 mr-1" />
                        Updated
                      </div>
                      <div className="font-medium">{formatDate(staff.updatedAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* Details Section */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <User className="h-6 w-6 mr-3 text-blue-600" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{staff.email}</p>
                  )}
                </div>

                {/* Primary Phone */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Primary Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{staff.phone || 'N/A'}</p>
                  )}
                </div>

                {/* Secondary Phone */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Secondary Phone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.secondaryPhone}
                      onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{staff.secondaryPhone || 'N/A'}</p>
                  )}
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                    Aadhaar Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                      maxLength="12"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl font-mono">
                      {staff.aadhaarNumber ? `****-****-${staff.aadhaarNumber.slice(-4)}` : 'N/A'}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2 space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:outline-none"
                      rows="3"
                    />
                  ) : (
                    <p className="text-gray-800 bg-gray-50 p-3 rounded-xl">{staff.address || 'No address provided'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* ID Proof */}
            {staff.uploadIdProof && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <FileText className="h-6 w-6 mr-3 text-blue-600" />
                  ID Proof Document
                </h3>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">ID Proof Document</p>
                      <p className="text-sm text-gray-600">Click to view document</p>
                    </div>
                  </div>
                  <a
                    href={staff.uploadIdProof.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </a>
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Shield className="h-6 w-6 mr-3 text-blue-600" />
                Permissions & Access
              </h3>

              {staff.permission && staff.permission.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissionsList.map((permission) => {
                    const hasPermission = isEditing
                      ? editData.permission.includes(permission)
                      : staff.permission.includes(permission);

                    return (
                      <div
                        key={permission}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${hasPermission
                            ? 'border-green-200 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                          } ${isEditing ? 'cursor-pointer hover:shadow-md' : ''}`}
                        onClick={isEditing ? () => handlePermissionChange(permission) : undefined}
                      >
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${hasPermission
                              ? 'border-green-500 bg-green-500'
                              : 'border-gray-300'
                            }`}>
                            {hasPermission && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <span className={`font-medium ${hasPermission ? 'text-green-800' : 'text-gray-600'
                            }`}>
                            {permission.replace(/_/g, ' ').replace(/^./, str => str.toUpperCase())}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-800 mb-2">No Permissions Assigned</h4>
                  <p className="text-gray-600">This staff member has no specific permissions assigned.</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-medium transition-colors duration-200 flex items-center"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;

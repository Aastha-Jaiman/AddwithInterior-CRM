"use client";

import { useState } from 'react';
import { Eye, EyeOff, Upload, User, Mail, Phone, MapPin, Shield, X, UserPlus, Check } from 'lucide-react';
import { registerStaffByAdmin } from '@/services/admin.services';

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'salesperson', label: 'Salesperson' },
  { value: 'designer', label: 'Designer' },
  { value: 'carpenter', label: 'Carpenter' },
];

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

const StaffRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    role: '',
    permission: []
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permission: prev.permission.includes(permission)
        ? prev.permission.filter(p => p !== permission)
        : [...prev.permission, permission]
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profileImage: 'Image size should be less than 5MB' }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profileImage: 'Please select a valid image file' }));
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
    if (document.getElementById('profile-image')) {
      document.getElementById('profile-image').value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!profileImage) newErrors.profileImage = 'Profile image is required';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
      role: '',
      permission: []
    });
    removeImage();
    setErrors({});
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setSuccessMessage('');
    setErrors({});
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Create FormData object
      const formDataToSend = new FormData();
      
      // Append all form fields
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('role', formData.role);
      
      // Append permissions (handle array properly)
      if (formData.permission && formData.permission.length > 0) {
        formData.permission.forEach(permission => {
          formDataToSend.append('permission', permission);
        });
      }
      
      // Append profile image
      if (profileImage) {
        formDataToSend.append('profile', profileImage);
      }

      // Debug: Log form data
      console.log("📤 Submitting staff registration:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      // Call the API service
      const response = await registerStaffByAdmin(formDataToSend);
      
      // Handle success
      console.log("✅ Staff registered successfully:", response);
      console.log("vghvhv", response)
      const successMsg = response.message || 'Staff registered successfully!';
      setSuccessMessage(successMsg);
      
      // Show success alert
      alert(`✅ ${successMsg}`);
      
      // Reset form on success
      resetForm();
      
      // Optional: Show success notification
      // You can replace this with your preferred notification system
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error("❌ Error registering staff:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error status
        const errorMessage = error.response.data?.message || 'Server error occurred';
        const statusCode = error.response.status;
        
        // Handle specific error cases
        if (statusCode === 400) {
          // Bad request - could be validation errors
          if (error.response.data?.message?.includes('Email already exists')) {
            setErrors(prev => ({ ...prev, email: 'Email already exists' }));
          } else if (error.response.data?.message?.includes('Phone number already exists')) {
            setErrors(prev => ({ ...prev, phone: 'Phone number already exists' }));
          } else {
            setErrors(prev => ({ ...prev, general: errorMessage }));
          }
        } else if (statusCode === 403) {
          // Forbidden - insufficient permissions
          setErrors(prev => ({ ...prev, general: 'You do not have permission to register staff' }));
        } else if (statusCode === 401) {
          // Unauthorized - need to login
          setErrors(prev => ({ ...prev, general: 'Please login to continue' }));
        } else {
          setErrors(prev => ({ ...prev, general: errorMessage }));
        }
      } else if (error.request) {
        // Network error
        setErrors(prev => ({ ...prev, general: 'Network error. Please check your connection.' }));
      } else {
        // Other errors
        setErrors(prev => ({ ...prev, general: 'An unexpected error occurred' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Staff Registration</h1>
                <p className="text-blue-100 mt-1">Create a new staff account with custom permissions</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mx-8 mt-6 bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center space-x-3">
              <Check className="h-5 w-5 text-green-600" />
              <span className="text-green-800 font-medium">{successMessage}</span>
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="mx-8 mt-6 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center space-x-3">
              <X className="h-5 w-5 text-red-600" />
              <span className="text-red-800 font-medium">{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Profile Image Upload */}
            <div className="text-center">
              <label className="block text-lg font-semibold text-gray-800 mb-4">Profile Image *</label>
              <div className="flex flex-col items-center space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Profile Preview" 
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-blue-100">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
                
                <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center space-x-2 shadow-lg transform hover:scale-105">
                  <Upload size={20} />
                  <span className="font-medium">Upload Photo</span>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.profileImage && (
                <p className="text-red-500 text-sm mt-2 font-medium">{errors.profileImage}</p>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 font-medium">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border-2 border-gray-200 px-4 py-3 pr-12 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm mt-1 font-medium">{errors.password}</p>}
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 font-medium">{errors.phone}</p>}
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none"
                placeholder="Enter complete address"
                rows={3}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1 font-medium">{errors.address}</p>}
            </div>

            {/* Role Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Shield className="inline h-4 w-4 mr-1" />
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border-2 border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 bg-white"
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-sm mt-1 font-medium">{errors.role}</p>}
            </div>

            {/* Permissions Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Shield className="inline h-4 w-4 mr-1" />
                Permissions
              </label>
              <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                  {permissionsList.map(permission => (
                    <label key={permission} className="flex items-center space-x-3 cursor-pointer bg-white hover:bg-blue-50 p-3 rounded-lg border border-gray-200 transition-all duration-300 hover:border-blue-300">
                      <input
                        type="checkbox"
                        checked={formData.permission.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      <span className="text-sm text-gray-700 font-medium">{permission.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {formData.permission.length} permission(s) selected
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg transition-all duration-300 font-semibold text-lg shadow-lg transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <UserPlus className="mr-2 h-5 w-5" />
                    Register Staff
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={resetForm}
                className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-800 py-4 px-6 rounded-lg transition-all duration-300 font-semibold border-2 border-gray-200 hover:border-gray-300"
              >
                Reset Form
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StaffRegistrationForm;
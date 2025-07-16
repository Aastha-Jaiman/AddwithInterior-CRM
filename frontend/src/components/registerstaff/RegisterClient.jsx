"use client";

import React, { useState } from 'react';
import {
  Plus, Trash2, Upload, X, User, Mail,
  Phone, Lock, MapPin, FileText, DollarSign,
  UserPlus
} from 'lucide-react';
import { registerClientByAdmin } from '@/services/client.services';

const ClientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', project: '', quotation: ''
  });

  const [addresses, setAddresses] = useState([{
    addresstype: 'home',
    addressinfo: {
      street: '', city: '', state: '', country: '', pincode: ''
    }
  }]);

  const [profileFile, setProfileFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddressChange = (index, field, value) => {
    const updated = [...addresses];
    if (field === 'addresstype') {
      updated[index][field] = value;
    } else {
      updated[index].addressinfo[field] = value;
    }
    setAddresses(updated);
  };

  const addAddress = () => {
    setAddresses([...addresses, {
      addresstype: 'home',
      addressinfo: { street: '', city: '', state: '', country: '', pincode: '' }
    }]);
  };

  const removeAddress = (index) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setErrors(prev => ({ ...prev, profile: 'Invalid image file' }));
    }

    if (file.size > 5 * 1024 * 1024) {
      return setErrors(prev => ({ ...prev, profile: 'Max size 5MB' }));
    }

    setProfileFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, profile: '' }));
  };

  const removeFile = () => {
    setProfileFile(null);
    setPreviewUrl(null);
    document.getElementById('profile-upload').value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Invalid phone';

    if (!formData.password.trim()) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Minimum 6 characters';

    addresses.forEach((addr, i) => {
      if (!addr.addressinfo.street.trim())
        newErrors[`address_${i}_street`] = 'Street required';
      if (!addr.addressinfo.city.trim())
        newErrors[`address_${i}_city`] = 'City required';
      if (!addr.addressinfo.state.trim())
        newErrors[`address_${i}_state`] = 'State required';
      if (!addr.addressinfo.country.trim())
        newErrors[`address_${i}_country`] = 'Country required';
      if (!addr.addressinfo.pincode.trim())
        newErrors[`address_${i}_pincode`] = 'Pincode required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        formDataToSend.append(key, val)
      );

      formDataToSend.append('address', JSON.stringify(addresses));
      if (profileFile) formDataToSend.append('profile', profileFile);

      const response = await registerClientByAdmin(formDataToSend);
      console.log('Response:', response);
      alert('Client registered successfully');

      // Reset
      setFormData({
        name: '', email: '', phone: '', password: '', project: '', quotation: ''
      });
      setAddresses([{
        addresstype: 'home',
        addressinfo: { street: '', city: '', state: '', country: '', pincode: '' }
      }]);
      setProfileFile(null);
      setPreviewUrl(null);
      setErrors({});
    } catch (err) {
      console.error('Registration Error:', err);
      alert('Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-3 rounded-full">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Client Registration</h1>
                <p className="text-blue-100 mt-1">Create a new staff account with custom permissions</p>
              </div>
            </div>
          </div>


        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <User className="mr-2" size={20} />
              Profile Picture
            </h2>

            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeFile}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={32} className="text-gray-500" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <label className="block">
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                    <Upload className="mr-2" size={16} />
                    Choose Profile Picture
                  </span>
                </label>
                <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline mr-1" size={16} />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline mr-1" size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline mr-1" size={16} />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline mr-1" size={16} />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline mr-1" size={16} />
                  Project
                </label>
                <input
                  type="text"
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="inline mr-1" size={16} />
                  Quotation
                </label>
                <input
                  type="text"
                  name="quotation"
                  value={formData.quotation}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter quotation amount"
                />
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <MapPin className="mr-2" size={20} />
                Addresses *
              </h2>
              <button
                type="button"
                onClick={addAddress}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="mr-1" size={16} />
                Add Address
              </button>
            </div>

            {addresses.map((address, index) => (
              <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">Address {index + 1}</h3>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type *
                    </label>
                    <select
                      value={address.addresstype}
                      onChange={(e) => handleAddressChange(index, 'addresstype', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.addressinfo.street}
                      onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`address_${index}_street`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter street address"
                    />
                    {errors[`address_${index}_street`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_street`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={address.addressinfo.city}
                      onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`address_${index}_city`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter city"
                    />
                    {errors[`address_${index}_city`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_city`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      value={address.addressinfo.state}
                      onChange={(e) => handleAddressChange(index, 'state', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`address_${index}_state`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter state"
                    />
                    {errors[`address_${index}_state`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_state`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={address.addressinfo.country}
                      onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`address_${index}_country`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter country"
                    />
                    {errors[`address_${index}_country`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_country`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={address.addressinfo.pincode}
                      onChange={(e) => handleAddressChange(index, 'pincode', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors[`address_${index}_pincode`] ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter pincode"
                    />
                    {errors[`address_${index}_pincode`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`address_${index}_pincode`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>


          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                'Register Client'
              )}
            </button>
          </div>
        </form>
        </div>
           
      </div>
</div>
  );
};

export default ClientRegistrationForm;

"use client";
import React, { useState } from 'react';
import { 
  Plus, Trash2, Upload, X, User, Mail, Phone, Lock, MapPin, 
  FileText, DollarSign, UserPlus, CreditCard, Building, FileImage 
} from 'lucide-react';
import { registerClientByAdmin } from '@/services/client.services';

const ClientRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    aadharCardNumber: '',
    project: '',
    quotation: ''
  });

  const [addresses, setAddresses] = useState([{
    addresstype: 'home',
    addressinfo: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    }
  }]);

  const [profileFile, setProfileFile] = useState(null);
  const [idProofFile, setIdProofFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [idProofPreviewUrl, setIdProofPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
      addressinfo: {
        street: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
      }
    }]);
  };

  const removeAddress = (index) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setErrors(prev => ({
        ...prev,
        [fileType]: 'Please select a valid image file'
      }));
    }

    if (file.size > 5 * 1024 * 1024) {
      return setErrors(prev => ({
        ...prev,
        [fileType]: 'File size should be less than 5MB'
      }));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (fileType === 'profile') {
        setProfileFile(file);
        setPreviewUrl(e.target.result);
      } else if (fileType === 'idProof') {
        setIdProofFile(file);
        setIdProofPreviewUrl(e.target.result);
      }
    };
    reader.readAsDataURL(file);

    setErrors(prev => ({
      ...prev,
      [fileType]: ''
    }));
  };

  const removeFile = (fileType) => {
    if (fileType === 'profile') {
      setProfileFile(null);
      setPreviewUrl(null);
      document.getElementById('profile-upload').value = '';
    } else if (fileType === 'idProof') {
      setIdProofFile(null);
      setIdProofPreviewUrl(null);
      document.getElementById('idproof-upload').value = '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const aadharRegex = /^[0-9]{12}$/;

    // Basic validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) newErrors.email = 'Please enter a valid email';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Please enter a valid phone number';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    // Aadhar validation (optional but if provided should be valid)
    if (formData.aadharCardNumber && !aadharRegex.test(formData.aadharCardNumber)) {
      newErrors.aadharCardNumber = 'Aadhar number must be 12 digits';
    }

    // Address validation
    addresses.forEach((addr, i) => {
      if (!addr.addressinfo.street.trim()) newErrors[`address_${i}_street`] = 'Street is required';
      if (!addr.addressinfo.city.trim()) newErrors[`address_${i}_city`] = 'City is required';
      if (!addr.addressinfo.state.trim()) newErrors[`address_${i}_state`] = 'State is required';
      if (!addr.addressinfo.country.trim()) newErrors[`address_${i}_country`] = 'Country is required';
      if (!addr.addressinfo.pincode.trim()) newErrors[`address_${i}_pincode`] = 'Pincode is required';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      // Append basic form data
      Object.entries(formData).forEach(([key, val]) => {
        if (val) formDataToSend.append(key, val);
      });
      
      // Append address data
      formDataToSend.append('address', JSON.stringify(addresses));
      
      // Append files
      if (profileFile) formDataToSend.append('profile', profileFile);
      if (idProofFile) formDataToSend.append('idProof', idProofFile);

      const response = await registerClientByAdmin(formDataToSend);
      console.log('Registration Response:', response);
      
      alert('Client registered successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        aadharCardNumber: '',
        project: '',
        quotation: ''
      });
      setAddresses([{
        addresstype: 'home',
        addressinfo: {
          street: '',
          city: '',
          state: '',
          country: '',
          pincode: ''
        }
      }]);
      setProfileFile(null);
      setIdProofFile(null);
      setPreviewUrl(null);
      setIdProofPreviewUrl(null);
      setErrors({});
      
    } catch (err) {
      console.error('Registration Error:', err);
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-blue-600 p-3 rounded-full">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Register New Client</h1>
              <p className="text-gray-600 mt-1">Create a new client account with complete details</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Basic Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card Number (optional)
                </label>
                <input
                  type="text"
                  name="aadharCardNumber"
                  value={formData.aadharCardNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.aadharCardNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 12-digit Aadhar number"
                  maxLength="12"
                />
                {errors.aadharCardNumber && <p className="text-red-500 text-sm mt-1">{errors.aadharCardNumber}</p>}
              </div>
            </div>
          </div>

          {/* File Uploads */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <FileImage className="h-5 w-5 text-blue-600" />
              File Uploads
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Picture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture (optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('profile')}
                        className="absolute top-0 right-1/2 transform translate-x-16 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload profile picture</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profile')}
                    className="hidden"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors mt-2"
                  >
                    Choose File
                  </label>
                </div>
                {errors.profile && <p className="text-red-500 text-sm mt-1">{errors.profile}</p>}
              </div>

              {/* ID Proof */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Proof (Aadhar/PAN/Driving License) (optional)
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${
                  errors.idProof ? 'border-red-300' : 'border-gray-300'
                }`}>
                  {idProofPreviewUrl ? (
                    <div className="relative">
                      <img
                        src={idProofPreviewUrl}
                        alt="ID Proof preview"
                        className="w-32 h-20 object-cover rounded mx-auto mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('idProof')}
                        className="absolute top-0 right-1/2 transform translate-x-16 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload ID proof</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="idproof-upload"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'idProof')}
                    className="hidden"
                  />
                  <label
                    htmlFor="idproof-upload"
                    className="cursor-pointer inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors mt-2"
                  >
                    Choose File
                  </label>
                </div>
                {errors.idProof && <p className="text-red-500 text-sm mt-1">{errors.idProof}</p>}
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Address Information
              </h2>
              <button
                type="button"
                onClick={addAddress}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Address
              </button>
            </div>

            {addresses.map((address, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Address {index + 1}</h3>
                  {addresses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAddress(index)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address Type
                    </label>
                    {/* <select
                      value={address.addresstype}
                      onChange={(e) => handleAddressChange(index, 'addresstype', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="temporary">Temporary</option>
                    </select> */}
                    <select
  value={address.addresstype}
  onChange={(e) =>
    handleAddressChange(index, "addresstype", e.target.value)
  }
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`address_${index}_street`] ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`address_${index}_city`] ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`address_${index}_state`] ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`address_${index}_country`] ? 'border-red-500' : 'border-gray-300'
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
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`address_${index}_pincode`] ? 'border-red-500' : 'border-gray-300'
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

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => {
                if (confirm('Are you sure you want to reset the form?')) {
                  // Reset form logic here
                }
              }}
            >
              Reset Form
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  Register Client
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRegistrationForm;


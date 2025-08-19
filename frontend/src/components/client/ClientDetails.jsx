"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getClientByIdService, updateClientByAdmin } from "@/services/client.services";
import {
  User, Mail, Phone, MapPin, Activity, Calendar, Edit3, Save, X,
  Plus, Trash2, Upload, Lock, FileText, DollarSign, UserPlus,
  Shield, ShieldOff, Building, Home, Briefcase
} from "lucide-react";

const ClientDetailsPage = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '', email: '', phone: '', aadharCardNumber: '',
  });
  const [editAddresses, setEditAddresses] = useState([]);
  const [editProfileFile, setEditProfileFile] = useState(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState(null);
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    if (id) {
      fetchClientDetails(id);
    }
  }, [id]);

  const fetchClientDetails = async (clientId) => {
    try {
      const data = await getClientByIdService(clientId);
      setClient(data.client);
      console.log("Fetched client details:", data.client);
    } catch (err) {
      setError(err.message || "Failed to fetch client details");
    } finally {
      setLoading(false);
    }
  };

  const toggleClientStatus = async () => {
    setTogglingStatus(true);
    try {
      const formData = new FormData();
      formData.append('isActive', !client.isActive);

      await updateClientByAdmin(id, formData);
      setClient(prev => ({ ...prev, isActive: !prev.isActive }));
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update client status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const openEditForm = () => {
    setEditFormData({
      name: client.name || '',
      email: client.email || '',
      phone: client.phone || '',
      aadharCardNumber: client.aadharCardNumber || '',
    });

    setEditAddresses(client.address?.length > 0 ? client.address : [{
      addresstype: 'home',
      addressinfo: { street: '', city: '', state: '', country: '', pincode: '' }
    }]);

    setEditPreviewUrl(client.profile?.url || null);
    setEditErrors({});
    setShowEditForm(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEditAddressChange = (index, field, value) => {
    const updated = [...editAddresses];
    if (field === 'addresstype') {
      updated[index][field] = value;
    } else {
      updated[index].addressinfo[field] = value;
    }
    setEditAddresses(updated);
  };

  const addEditAddress = () => {
    setEditAddresses([...editAddresses, {
      addresstype: 'home',
      addressinfo: { street: '', city: '', state: '', country: '', pincode: '' }
    }]);
  };

  const removeEditAddress = (index) => {
    if (editAddresses.length > 1) {
      setEditAddresses(editAddresses.filter((_, i) => i !== index));
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return setEditErrors(prev => ({ ...prev, profile: 'Invalid image file' }));
    }

    if (file.size > 5 * 1024 * 1024) {
      return setEditErrors(prev => ({ ...prev, profile: 'Max size 5MB' }));
    }

    setEditProfileFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setEditPreviewUrl(e.target.result);
    reader.readAsDataURL(file);
    setEditErrors(prev => ({ ...prev, profile: '' }));
  };

  const removeEditFile = () => {
    setEditProfileFile(null);
    setEditPreviewUrl(client.profile?.url || null);
    document.getElementById('edit-profile-upload').value = '';
  };

  const validateEditForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const aadharCardNumberRegex = /^[0-9]{12}$/;


    if (!editFormData.name.trim()) newErrors.name = 'Name is required';
    if (!editFormData.email.trim()) newErrors.email = 'Email is required';
    else if (!emailRegex.test(editFormData.email)) newErrors.email = 'Invalid email';

    if (!editFormData.phone.trim()) newErrors.phone = 'Phone is required';
    else if (!phoneRegex.test(editFormData.phone)) newErrors.phone = 'Invalid phone';

    // if (!editFormData.aadharCardNumber.trim()) { newErrors.aadharCardNumber = 'Aadhar is required'; }
    // else if (!aadharCardNumberRegex.test(editFormData.aadharCardNumber)) {
    //   newErrors.aadharCardNumber = 'Aadhar must be exactly 12 digits';
    // }

    if (editFormData.aadharCardNumber.trim()) {
      if (!aadharCardNumberRegex.test(editFormData.aadharCardNumber)) {
        newErrors.aadharCardNumber = 'Aadhar must be exactly 12 digits';
      }
    }



    editAddresses.forEach((addr, i) => {
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

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateSubmit = async () => {
    if (!validateEditForm()) return;

    setUpdating(true);
    try {
      const formDataToSend = new FormData();

      Object.entries(editFormData).forEach(([key, val]) => {
        if (val.trim()) {
          formDataToSend.append(key, val);
        }
      });

      formDataToSend.append('address', JSON.stringify(editAddresses));
      if (editProfileFile) formDataToSend.append('profile', editProfileFile);

      await updateClientByAdmin(id, formDataToSend);

      await fetchClientDetails(id);
      setShowEditForm(false);
      alert('Client updated successfully');
    } catch (err) {
      console.error('Update Error:', err);
      alert('Update failed.');
    } finally {
      setUpdating(false);
    }
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'work': return <Briefcase className="w-4 h-4" />;
      case 'home': return <Home className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4 text-lg">Loading client details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Data Found</h2>
            <p className="text-gray-600">No client data found.</p>
          </div>
        </div>
      </div>
    );
  }

  const primaryAddress = client.address?.[0]?.addressinfo;
  const addressText = primaryAddress
    ? `${primaryAddress.street || ''}, ${primaryAddress.city || ''}, ${primaryAddress.state || ''}, ${primaryAddress.country || ''} - ${primaryAddress.pincode || ''}`
    : 'No address provided';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className=" envie max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {client.profile?.url ? (
                    <img
                      src={client.profile.url}
                      alt={client.name}
                      className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white">
                      <User className="w-8 h-8 text-white" />
                    </div>
                  )}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${client.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                    {client.isActive ? (
                      <Shield className="w-3 h-3 text-white" />
                    ) : (
                      <ShieldOff className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                  <p className="text-blue-100 text-lg">{client.role || "Client"}</p>
                  <div className="flex items-center mt-2 space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${client.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-blue-100 text-sm flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleClientStatus}
                  disabled={togglingStatus}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${client.isActive
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                    } disabled:opacity-50`}
                >
                  {togglingStatus ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  ) : client.isActive ? (
                    <ShieldOff className="w-4 h-4" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  <span>{client.isActive ? 'Deactivate' : 'Activate'}</span>
                </button>
                <button
                  onClick={openEditForm}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Client</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {showEditForm ? (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Edit3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Client</h2>
                  <p className="text-gray-600">Update client information</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditForm(false)}
                className="text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="mr-2" size={20} />
                  Profile Picture
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {editPreviewUrl ? (
                      <div className="relative">
                        <img
                          src={editPreviewUrl}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                        />
                        <button
                          type="button"
                          onClick={removeEditFile}
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
                        id="edit-profile-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleEditFileChange}
                        className="hidden"
                      />
                      <span className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                        <Upload className="mr-2" size={16} />
                        Change Profile Picture
                      </span>
                    </label>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    {editErrors.profile && <p className="text-red-500 text-sm mt-1">{editErrors.profile}</p>}
                  </div>
                </div>
              </div>

              {/* Basic Information Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="inline mr-1" size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter full name"
                    />
                    {editErrors.name && <p className="text-red-500 text-sm mt-1">{editErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline mr-1" size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter email address"
                    />
                    {editErrors.email && <p className="text-red-500 text-sm mt-1">{editErrors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-1" size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditInputChange}
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter phone number"
                    />
                    {editErrors.phone && <p className="text-red-500 text-sm mt-1">{editErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline mr-1" size={16} />
                      Aadhar Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="aadharCardNumber"
                      value={editFormData.aadharCardNumber}
                      onChange={handleEditInputChange}
                      maxLength={12}
                      pattern="\d{12}"
                      inputMode="numeric"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors.aadharCardNumber ? 'border-red-500' : 'border-gray-300'
                        }`}
                      placeholder="Enter 12-digit Aadhar number"
                    />
                    {editErrors.aadharCardNumber && <p className="text-red-500 text-sm mt-1">{editErrors.aadharCardNumber}</p>}
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <MapPin className="mr-2" size={20} />
                    Addresses *
                  </h3>
                  <button
                    type="button"
                    onClick={addEditAddress}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="mr-1" size={16} />
                    Add Address
                  </button>
                </div>

                {editAddresses.map((address, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium text-gray-800">Address {index + 1}</h4>
                      {editAddresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEditAddress(index)}
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
                          onChange={(e) => handleEditAddressChange(index, 'addresstype', e.target.value)}
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
                          onChange={(e) => handleEditAddressChange(index, 'street', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors[`address_${index}_street`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter street address"
                        />
                        {editErrors[`address_${index}_street`] && (
                          <p className="text-red-500 text-sm mt-1">{editErrors[`address_${index}_street`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={address.addressinfo.city}
                          onChange={(e) => handleEditAddressChange(index, 'city', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors[`address_${index}_city`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter city"
                        />
                        {editErrors[`address_${index}_city`] && (
                          <p className="text-red-500 text-sm mt-1">{editErrors[`address_${index}_city`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          value={address.addressinfo.state}
                          onChange={(e) => handleEditAddressChange(index, 'state', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors[`address_${index}_state`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter state"
                        />
                        {editErrors[`address_${index}_state`] && (
                          <p className="text-red-500 text-sm mt-1">{editErrors[`address_${index}_state`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country *
                        </label>
                        <input
                          type="text"
                          value={address.addressinfo.country}
                          onChange={(e) => handleEditAddressChange(index, 'country', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors[`address_${index}_country`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter country"
                        />
                        {editErrors[`address_${index}_country`] && (
                          <p className="text-red-500 text-sm mt-1">{editErrors[`address_${index}_country`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={address.addressinfo.pincode}
                          onChange={(e) => handleEditAddressChange(index, 'pincode', e.target.value)}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${editErrors[`address_${index}_pincode`] ? 'border-red-500' : 'border-gray-300'
                            }`}
                          placeholder="Enter pincode"
                        />
                        {editErrors[`address_${index}_pincode`] && (
                          <p className="text-red-500 text-sm mt-1">{editErrors[`address_${index}_pincode`]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={handleUpdateSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Update Client
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email Address</p>
                      <p className="text-gray-900 font-medium">{client.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone Number</p>
                      <p className="text-gray-900 font-medium">{client.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Aadhar Number</p>
                      <p className="text-gray-900 font-medium">{client.aadharCardNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-red-600" />
                  Address Information
                </h2>
                {client.address && client.address.length > 0 ? (
                  <div className="space-y-4">
                    {client.address.map((addr, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getAddressIcon(addr.addresstype)}
                            <span className="font-medium text-gray-900 capitalize">
                              {addr.addresstype} Address
                            </span>
                          </div>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            Address {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {addr.addressinfo.street && `${addr.addressinfo.street}, `}
                          {addr.addressinfo.city && `${addr.addressinfo.city}, `}
                          {addr.addressinfo.state && `${addr.addressinfo.state}, `}
                          {addr.addressinfo.country && `${addr.addressinfo.country}`}
                          {addr.addressinfo.pincode && ` - ${addr.addressinfo.pincode}`}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No address information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-indigo-600" />
                  Account Status
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${client.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {client.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">
                      {new Date(client.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {client.updatedAt && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="font-medium text-gray-900">
                        {new Date(client.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Addresses</span>
                    <span className="font-bold text-2xl text-blue-600">
                      {client.address ? client.address.length : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDetailsPage;
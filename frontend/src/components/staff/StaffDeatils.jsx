"use client";
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Edit, 
  Save, 
  X,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { getStaffByIdService, updateStaffByAdmin } from '@/services/admin.services';

const StaffDetailsComponent = () => {
  const router = useRouter();
  const params = useParams();
  const staffId = params.id;

  const [staff, setStaff] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const roles = ['carpenter', 'designer', 'salesperson'];

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        setIsLoading(true);
        const response = await getStaffByIdService();
        const staffData = Array.isArray(response.staff) ? response.staff : [];
        const foundStaff = staffData.find(staff => staff._id === staffId);
        
        if (foundStaff) {
          const mappedStaff = {
            ...foundStaff,
            id: foundStaff._id
          };
          setStaff(mappedStaff);
          setEditingStaff(mappedStaff);
        } else {
          setError('Staff member not found');
        }
      } catch (err) {
        setError('Failed to fetch staff details: ' + err.message);
        console.error('Fetch staff details error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (staffId) {
      fetchStaffDetails();
    }
  }, [staffId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditingStaff({ ...staff });
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editingStaff.name.trim());
      formData.append('email', editingStaff.email.trim());
      formData.append('phone', editingStaff.phone ? editingStaff.phone.trim() : '');
      formData.append('address', editingStaff.address ? editingStaff.address.trim() : '');
      formData.append('role', editingStaff.role.trim());

      const updatedStaff = await updateStaffByAdmin(staffId, formData);
      setStaff(updatedStaff);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to update staff: ' + err.message);
      console.error('Update staff error:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingStaff({ ...staff });
    setError(null);
  };

  const handleInputChange = (field, value) => {
    setEditingStaff(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleActive = async () => {
    try {
      const formData = new FormData();
      formData.append("isactive", (!staff.isactive).toString());

      const updatedStaff = await updateStaffByAdmin(staffId, formData);
      setStaff(prev => ({ ...prev, isactive: updatedStaff.isactive }));
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation");
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'carpenter':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'designer':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'salesperson':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading staff details...</p>
        </div>
      </div>
    );
  }

  if (error && !staff) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Staff List</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                    {staff?.profile?.url ? (
                      <img
                        src={staff.profile.url}
                        alt={staff.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                        <User className="w-16 h-16 text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 border-white ${staff?.isactive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {staff?.name || 'N/A'}
                </h1>
                
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(staff?.role)}`}>
                  <Briefcase className="w-4 h-4 mr-1" />
                  {staff?.role ? staff.role.charAt(0).toUpperCase() + staff.role.slice(1) : 'N/A'}
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleToggleActive}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${staff?.isactive 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {staff?.isactive ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Active</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Inactive</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Staff Details</h2>
              
              {!isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Full Name</p>
                        <p className="font-medium text-gray-900">{staff?.name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-gray-900">{staff?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{staff?.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">{staff?.address || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Verification Status</p>
                          <p className={`font-medium ${staff?.isVerified ? 'text-green-600' : 'text-red-600'}`}>
                            {staff?.isVerified ? 'Verified' : 'Not Verified'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Joined Date</p>
                          <p className="font-medium text-gray-900">
                            {staff?.createdAt ? formatDate(staff.createdAt) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 md:col-span-2">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Last Updated</p>
                          <p className="font-medium text-gray-900">
                            {staff?.updatedAt ? formatDate(staff.updatedAt) : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={editingStaff?.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={editingStaff?.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={editingStaff?.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                      <select
                        value={editingStaff?.role || ''}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      >
                        <option value="">Select Role</option>
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={editingStaff?.address || ''}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      placeholder="Enter address"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsComponent;
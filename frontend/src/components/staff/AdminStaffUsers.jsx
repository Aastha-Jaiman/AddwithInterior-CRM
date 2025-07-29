"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Edit, Trash2, Save, User, Shield, Phone, Mail, MapPin, UserCheck, UserX, Filter, RefreshCw } from 'lucide-react';
import { getAllStaff, updateStaffByAdmin } from '@/services/admin.services';
import Link from 'next/link';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const roles = ['carpenter', 'designer', 'salesperson'];

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setIsLoading(true);
        const response = await getAllStaff();
        console.log("response", response)
        const staffData = Array.isArray(response.staff) ? response.staff.map(staff => ({
          id: staff._id || '',
          name: staff.name || '',
          email: staff.email || '',
          phone: staff.phone || '',
          secondaryPhone: staff.secondaryPhone || '',
          address: staff.address || '',
          role: staff.role || '',
          avatar: staff.profile?.url || '👤',
          isactive: staff.isactive,
          aadhaarNumber: staff.aadhaarNumber || '',
          isVerified: staff.isVerified || false,
          permission: staff.permission || [],
          createdAt: staff.createdAt || '',
          uploadIdProof: staff.uploadIdProof || null
        })) : [];

        setUsers(staffData);
      } catch (err) {
        setError('Failed to fetch staff data: ' + err.message);
        console.error('Fetch staff error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone || '').includes(searchTerm) ||
        (user.aadhaarNumber || '').includes(searchTerm);
      const matchesRole = selectedRole === '' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, selectedRole]);

  const handleEdit = (user) => {
    setEditingUserId(user.id);
    setEditingUser({ ...user });
  };

  const handleSave = async () => {
    if (!editingUser) {
      setError('No user data to update');
      return;
    }

    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      setError('Name, email, and role are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingUser.name.trim());
      formData.append('email', editingUser.email.trim());
      formData.append('phone', editingUser.phone ? editingUser.phone.trim() : '');
      formData.append('secondaryPhone', editingUser.secondaryPhone ? editingUser.secondaryPhone.trim() : '');
      formData.append('address', editingUser.address ? editingUser.address.trim() : '');
      formData.append('role', editingUser.role.trim());
      formData.append('aadhaarNumber', editingUser.aadhaarNumber ? editingUser.aadhaarNumber.trim() : '');

      const updatedUser = await updateStaffByAdmin(editingUser.id, formData);

      if (!updatedUser) {
        throw new Error('No response from updateStaffByAdmin');
      }

      const mappedUpdatedUser = {
        ...editingUser,
        id: updatedUser._id || editingUser.id,
        name: updatedUser.name || editingUser.name,
        email: updatedUser.email || editingUser.email,
        phone: updatedUser.phone || editingUser.phone,
        secondaryPhone: updatedUser.secondaryPhone || editingUser.secondaryPhone,
        address: updatedUser.address || editingUser.address,
        role: updatedUser.role || editingUser.role,
        aadhaarNumber: updatedUser.aadhaarNumber || editingUser.aadhaarNumber,
        avatar: updatedUser.profile?.url || editingUser.avatar || '👤'
      };

      setUsers(users.map(user => user.id === editingUser.id ? mappedUpdatedUser : user));
      setEditingUserId(null);
      setEditingUser(null);
      setError(null);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      setError(`Failed to update user: ${errorMessage}`);
      console.error('Update user error:', err);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const formData = new FormData();
      formData.append("isactive", (!user.isactive).toString());
      const updatedUser = await updateStaffByAdmin(user.id, formData);

      if (!updatedUser) throw new Error("No response from updateStaffByAdmin");

      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isactive: updatedUser.isactive } : u));
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation");
    }
  };

  const handleInputChange = (field, value) => {
    setEditingUser(prev => ({ ...prev, [field]: value }));
  };

  const closeForm = () => {
    setEditingUserId(null);
    setEditingUser(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-gray-700">Loading staff data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
              <p className="text-gray-600">Manage your team members and their information</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <User className="w-4 h-4" />
              <span>{filteredUsers.length} total staff members</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or Aadhaar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 focus:bg-white min-w-[200px]"
              >
                <option value="">All Roles</option>
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Staff Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Profile</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      {editingUserId === user.id ? (
                        // Edit Mode Row
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {user.avatar.startsWith('http') ? (
                                  <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                )}
                              </div>
                              <input
                                type="text"
                                value={editingUser?.name || ''}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="Name"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4 space-y-2">
                            <input
                              type="email"
                              value={editingUser?.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Email"
                            />
                            <input
                              type="tel"
                              value={editingUser?.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Phone"
                            />
                            <input
                              type="tel"
                              value={editingUser?.secondaryPhone || ''}
                              onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Secondary Phone"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <textarea
                              value={editingUser?.address || ''}
                              onChange={(e) => handleInputChange('address', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                              rows="2"
                              placeholder="Address"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editingUser?.role || ''}
                              onChange={(e) => handleInputChange('role', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            >
                              <option value="">Select Role</option>
                              {roles.map(role => (
                                <option key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={editingUser?.aadhaarNumber || ''}
                              onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                              className="block w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="Aadhaar Number"
                              maxLength="12"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.isactive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.isactive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </button>
                              <button
                                onClick={closeForm}
                                className="inline-flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 text-sm font-medium"
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        // View Mode Row
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                {user.avatar.startsWith('http') ? (
                                  <img src={user.avatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                                {/* <div className="flex items-center space-x-2 mt-1">
                                  {user.isVerified && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      <Shield className="w-3 h-3 mr-1" />
                                      Verified
                                    </span>
                                  )}
                                  {user.permission && user.permission.length > 0 && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      {user.permission.length} Permissions
                                    </span>
                                  )}
                                </div> */}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm text-gray-900">
                                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                {user.email || 'N/A'}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                {user.phone || 'N/A'}
                              </div>
                              {user.secondaryPhone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                  {user.secondaryPhone}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start text-sm text-gray-900">
                              <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{user.address || 'No address provided'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role === 'carpenter' ? 'bg-orange-100 text-orange-800' :
                                user.role === 'designer' ? 'bg-purple-100 text-purple-800' :
                                  user.role === 'salesperson' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                              }`}>
                              {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-2">
                              {user.aadhaarNumber && (
                                <div className="text-xs text-gray-600">
                                  <span className="font-medium">Aadhaar:</span> {user.aadhaarNumber}
                                </div>
                              )}
                              {user.uploadIdProof && (
                                <div className="text-xs text-green-600 font-medium">
                                  ID Proof Uploaded
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleActive(user)}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${user.isactive
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                            >
                              {user.isactive ? (
                                <>
                                  <UserCheck className="w-4 h-4 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="w-4 h-4 mr-1" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                              >
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </button>
                              <Link
                                href={`/admin/staffusers/${user.id}`}
                                className="inline-flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
                              >
                                View Details
                              </Link>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <User className="w-12 h-12 text-gray-300" />
                        <p className="text-gray-500 text-lg font-medium">No staff members found</p>
                        <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementComponent;

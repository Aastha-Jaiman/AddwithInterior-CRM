"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Edit, Trash2, Save, User } from 'lucide-react';
import { getAllStaff, updateStaffByAdmin } from '@/services/admin.services';

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
        const staffData = Array.isArray(response.staff) ? response.staff.map(staff => ({
          id: staff._id || '',
          name: staff.name || '',
          email: staff.email || '',
          phone: staff.phone || '',
          address: staff.address || '',
          role: staff.role || '',
          avatar: staff.profile?.url || '👤'
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
    if (!Array.isArray(users)) return [];
    return users.filter(user => {
      const matchesSearch =
        (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone || '').includes(searchTerm);
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

    // Basic validation
    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      setError('Name, email, and role are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editingUser.name.trim());
      formData.append('email', editingUser.email.trim());
      formData.append('phone', editingUser.phone ? editingUser.phone.trim() : '');
      formData.append('address', editingUser.address ? editingUser.address.trim() : '');
      formData.append('role', editingUser.role.trim());

      // Log FormData for debugging
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const updatedUser = await updateStaffByAdmin(editingUser.id, formData);

      if (!updatedUser) {
        throw new Error('No response from updateStaffByAdmin');
      }

      const mappedUpdatedUser = {
        id: updatedUser._id || editingUser.id,
        name: updatedUser.name || editingUser.name || '',
        email: updatedUser.email || editingUser.email || '',
        phone: updatedUser.phone || editingUser.phone || '',
        address: updatedUser.address || editingUser.address || '',
        role: updatedUser.role || editingUser.role || '',
        avatar: updatedUser.profile?.url || editingUser.avatar || '👤'
      };

      setUsers(users.map(user =>
        user.id === editingUser.id ? mappedUpdatedUser : user
      ));
      setEditingUserId(null);
      setEditingUser(null);
      setError(null); // Clear any previous errors
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update user';
      setError(`Failed to update user: ${errorMessage}`);
      console.error('Update user error:', err);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleInputChange = (field, value) => {
    setEditingUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const closeForm = () => {
    setEditingUserId(null);
    setEditingUser(null);
    setError(null); // Clear error when closing form
  };

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  if (error && !editingUserId) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        {/* Error Message */}
        {error && editingUserId && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
              />
            </div>

            <div className="md:w-48">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Avatar</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <tr className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          {user.avatar.startsWith('http') ? (
                            <img src={user.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-indigo-600" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.address || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${user.role === 'carpenter' ? 'bg-green-100 text-green-800' :
                          user.role === 'designer' ? 'bg-indigo-100 text-indigo-800' :
                            user.role === 'salesperson' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900 p-1.5 hover:bg-indigo-50 rounded transition-colors duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-900 p-1.5 hover:bg-red-50 rounded transition-colors duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {editingUserId === user.id && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4">
                          <div className="bg-white rounded-lg p-4 transition-all duration-300 ease-in-out">
                            <div className="space-y-4">
                              <div className='flex justify-between items-center gap-5'>
                                <div className='w-full'>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                  <input
                                    type="text"
                                    value={editingUser.name || ''}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                  />
                                </div>
                                <div className='w-full'>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                  <input
                                    type="email"
                                    value={editingUser.email || ''}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                  />
                                </div>
                              </div>
                              <div className='flex justify-between items-center gap-5'>
                                <div className='w-full'>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                  <input
                                    type="tel"
                                    value={editingUser.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                  />
                                </div>
                                <div className='w-full'>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                  <select
                                    value={editingUser.role || ''}
                                    onChange={(e) => handleInputChange('role', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <input
                                  type="text"
                                  value={editingUser.address || ''}
                                  onChange={(e) => handleInputChange('address', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                                />
                              </div>
                              <div className="flex justify-end space-x-3 pt-2">
                                <button
                                  onClick={closeForm}
                                  className="px-4 py-2 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={handleSave}
                                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center space-x-2 transition-colors duration-200"
                                >
                                  <Save className="w-4 h-4" />
                                  <span>Save Changes</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagementComponent;
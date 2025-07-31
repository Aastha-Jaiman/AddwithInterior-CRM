"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, Phone, Mail, MapPin, UserCheck, UserX, Filter, RefreshCw, User, Grid3X3, List, User2 } from 'lucide-react';
import { getAllStaff, updateStaffByAdmin } from '@/services/admin.services';
import Link from 'next/link';

const UserManagementComponent = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-lg font-medium text-gray-700">Loading staff data...</p>
        </div>
      </div>
    );
  }

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredUsers.length > 0 ? (
        filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Profile Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0">
                {user.avatar.startsWith('http') ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{user.name || 'N/A'}</h3>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'carpenter' ? 'bg-orange-100 text-orange-800' :
                  user.role === 'designer' ? 'bg-purple-100 text-purple-800' :
                    user.role === 'salesperson' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Email:</span>
                <span className="truncate">{user.email || 'No email'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Phone:</span>
                <span>{user.phone || 'No phone'}</span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <User2 className="w-4 h-4 mr-2 text-gray-400" />
                <span className="font-medium mr-1">Aadhar:</span>
                <span>{user.aadhaarNumber || 'No Aadhar'}</span>
              </div>

              {user.address && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="font-medium mr-1">Address:</span>
                  <span className="line-clamp-2">{user.address}</span>
                </div>
              )}
            </div>


            {/* Status and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => handleToggleActive(user)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${user.isactive
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                  }`}
              >
                {user.isactive ? (
                  <>
                    <UserCheck className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <UserX className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </button>

              <Link
                href={`/admin/staffusers/${user.id}`}
                className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <User className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">No staff members found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );

  const TableView = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {user.avatar.startsWith('http') ? (
                          <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-[200px]">{user.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{user.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <span className="truncate max-w-[200px]">{user.aadhaarNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.role === 'carpenter' ? 'bg-orange-100 text-orange-800' :
                      user.role === 'designer' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'salesperson' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${user.isactive
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                    >
                      {user.isactive ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Active
                        </>
                      ) : (
                        <>
                          <UserX className="w-3 h-3 mr-1" />
                          Inactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/staffusers/${user.id}`}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
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
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Staff Management</h1>
              <p className="text-gray-600">Manage your team members</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span>{filteredUsers.length} staff members</span>
              </div>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'cards'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <List className="w-4 h-4 mr-1" />
                  Table
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Content */}
        {viewMode === 'cards' ? <CardView /> : <TableView />}
      </div>
    </div>
  );
};

export default UserManagementComponent;
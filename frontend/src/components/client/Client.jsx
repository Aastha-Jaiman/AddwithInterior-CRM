"use client";
import React, { useEffect, useState } from "react";
import { getAllClientsByAdmin, updateClientByAdmin } from "@/services/client.services";
import { User, Pencil, Eye, X, Check, MapPin, Mail, Phone, Calendar, Shield, Activity } from "lucide-react";
import { useRouter } from 'next/navigation';

const ClientManagementComponent = () => {
  const router = useRouter();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editClientId, setEditClientId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: null,
    isActive: ''
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllClientsByAdmin();
      const clientList = Array.isArray(response.client) ? response.client : [];

      const mappedClients = clientList.map(client => ({
        id: client._id || '',
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address?.[0]?.addressinfo
          ? `${client.address[0].addressinfo.street || ''}, ${client.address[0].addressinfo.city || ''}, ${client.address[0].addressinfo.state || ''}, ${client.address[0].addressinfo.country || ''} - ${client.address[0].addressinfo.pincode || ''}`
          : client.address || 'N/A',
        role: client.role || 'client',
        avatar: client.profile?.url || '',
        isActive: client.isActive || client.isActive || false,
        createdAt: client.createdAt
      }));

      setClients(mappedClients);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed function - changed from user to client and setUsers to setClients
  const handleToggleActive = async (client) => {
    try {
      const newActiveStatus = !client.isActive;
      const formData = new FormData();
      formData.append("isActive", newActiveStatus.toString());

      const updatedClient = await updateClientByAdmin(client.id, formData);

      if (!updatedClient) throw new Error("No response from updateClientByAdmin");

      // Update the client in the state with the new status
      setClients(prev =>
        prev.map(c =>
          c.id === client.id ? { ...c, isActive: newActiveStatus } : c
        )
      );

      // Success message
      console.log(`Client ${client.name} is now ${newActiveStatus ? 'active' : 'inactive'}`);

    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation: " + err.message);
    }
  };

  const handleEditClick = (client) => {
    setEditClientId(client.id);
    setEditFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      avatar: null,
      isActive: client.isActive
    });
  };

  const handleEditSubmit = async () => {
    try {
      console.log('Updating client with ID:', editClientId);
      console.log('Form data:', editFormData);

      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("phone", editFormData.phone);

      // Only append email if it's different from original
      if (editFormData.email) {
        formData.append("email", editFormData.email);
      }

      // Handle boolean values properly

      formData.append("isaAtive", editFormData.isActive.toString());

      // Only append profile if a new file is selected
      if (editFormData.avatar) {
        formData.append("profile", editFormData.avatar);
      }

      console.log('Sending FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await updateClientByAdmin(editClientId, formData);
      console.log('Update response:', response);

      // Update the client in the state with the new data
      setClients(prev =>
        prev.map(c =>
          c.id === editClientId ? {
            ...c,
            name: editFormData.name,
            email: editFormData.email,
            phone: editFormData.phone,
            isActive: editFormData.isActive
          } : c
        )
      );

      setEditClientId(null);
      alert('Client updated successfully!');
    } catch (err) {
      console.error("Update failed - Full error:", err);
      console.error("Error message:", err.message);
      console.error("Error response:", err.response?.data);

      // Show more detailed error message
      let errorMessage = "Failed to update client";
      if (err.response?.data?.message) {
        errorMessage += ": " + err.response.data.message;
      } else if (err.message) {
        errorMessage += ": " + err.message;
      }

      alert(errorMessage);
    }
  };

  const handleInputChange = (field, value) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="flex items-center justify-center space-x-2 text-gray-500">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading clients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Client Management</h2>
          <p className="text-gray-600">Manage and view all your clients in one place</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Client</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>Phone</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-4 h-4" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Joined</span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {clients.map(client => (
                  <React.Fragment key={client.id}>
                    <tr className="hover:bg-gray-50 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center shadow-sm">
                            {client.avatar ? (
                              <img
                                src={client.avatar}
                                alt="avatar"
                                className="w-12 h-12 object-cover"
                              />
                            ) : (
                              <User className="text-blue-600 w-6 h-6" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                              <span>{client.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{client.email}</td>
                      <td className="px-6 py-4 text-gray-600">{client.phone}</td>
                      {/* Fixed status column - changed from user to client */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(client)}
                          className={`inline-block text-xs px-2 py-1 rounded-full font-semibold cursor-pointer transition-colors duration-200 ${client.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                            }`}
                          title={client.isActive ? "Deactivate Client" : "Activate Client"}
                        >
                          {client.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(client.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => router.push(`/admin/clients/${client.id}`)}
                            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleEditClick(client)}
                            className="p-2 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-all duration-200"
                            title="Edit Client"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {editClientId === client.id && (
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                        <td colSpan={6} className="px-6 py-6">
                          <div className="space-y-6">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-900">Edit Client Information</h3>
                              <button
                                type="button"
                                onClick={() => setEditClientId(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                              >
                                <X size={20} />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <User className="w-4 h-4 inline mr-2" />
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter full name"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 inline mr-2" />
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter email address"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 inline mr-2" />
                                    Phone Number
                                  </label>
                                  <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter phone number"
                                  />
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Picture
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleInputChange('avatar', e.target.files[0])}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                  />
                                </div>

                                <div className="flex space-x-4">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={editFormData.isActive}
                                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                      <Activity className="w-4 h-4 inline mr-1" />
                                      Active
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                              <button
                                type="button"
                                onClick={() => setEditClientId(null)}
                                className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all duration-200"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleEditSubmit}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2"
                              >
                                <Check className="w-4 h-4" />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {clients.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium">No clients found</p>
                        <p className="text-sm">Start by adding your first client</p>
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

export default ClientManagementComponent;
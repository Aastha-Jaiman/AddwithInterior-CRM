"use client";
import React, { useEffect, useState } from "react";
import { getAllClientsByAdmin, updateClientByAdmin } from "@/services/client.services";
import {
  User, Pencil, Eye, X, Check, MapPin, Mail, Phone,
  Calendar, Shield, Activity, Users, Search, Filter
} from "lucide-react";
import { useRouter } from 'next/navigation';

const ClientManagementComponent = () => {
  const router = useRouter();

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editClientId, setEditClientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Edit form state with addresstype included
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    aadharCardNumber: '',
    avatar: null,
    idProof: null,
    isActive: false,
    addresstype: "home", // Important for backend schema
    addressinfo: { street: '', city: '', state: '', country: '', pincode: '' }
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getAllClientsByAdmin();
      const clientList = Array.isArray(response.client) ? response.client : [];

      // Map clients to keep address array and a formatted string for UI display
      const mappedClients = clientList.map(client => ({
        id: client._id || '',
        name: client.name || '',
        email: client.email || '',
        phone: client.phone || '',
        address: client.address, // keep full address array for editing
        fullAddress: client.address?.[0]?.addressinfo
          ? `${client.address[0].addressinfo.street}, ${client.address[0].addressinfo.city}, ${client.address[0].addressinfo.state}, ${client.address[0].addressinfo.country} - ${client.address[0].addressinfo.pincode}`
          : 'N/A',
        role: client.role || 'client',
        avatar: client.profile?.url || '',
        isActive: !!client.isActive,
        aadharCardNumber: client.aadharCardNumber || 'N/A',
        createdAt: client.createdAt
      }));

      setClients(mappedClients);
      setError(null);
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError("Failed to load clients: " + (err.message || "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle active/inactive status of client
  const handleToggleActive = async (client) => {
    try {
      const newStatus = !client.isActive;
      const formData = new FormData();
      formData.append("isActive", newStatus.toString());

      const updatedClient = await updateClientByAdmin(client.id, formData);
      if (!updatedClient) throw new Error("No response from updateClientByAdmin");

      setClients(prev =>
        prev.map(c => (c.id === client.id ? { ...c, isActive: newStatus } : c))
      );
    } catch (err) {
      console.error("Toggle active error:", err);
      setError("Failed to toggle activation: " + (err.message || "Unknown error"));
    }
  };

  // Prepare editing form data, including addresstype fallback to "home"
  const handleEditClick = (client) => {
    setEditClientId(client.id);

    const addr =
      Array.isArray(client.address) && client.address[0]
        ? client.address[0]
        : {
            addresstype: "home",
            addressinfo: {
              street: "", city: "", state: "", country: "", pincode: ""
            }
          };

    setEditFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      aadharCardNumber: client.aadharCardNumber || "",
      avatar: null,
      idProof: null,
      isActive: client.isActive,
      addresstype: addr.addresstype || "home",
      addressinfo: {
        street: addr.addressinfo.street || "",
        city: addr.addressinfo.city || "",
        state: addr.addressinfo.state || "",
        country: addr.addressinfo.country || "",
        pincode: addr.addressinfo.pincode || ""
      }
    });
  };

  // Handle controlled inputs for form, including nested addressinfo and addresstype
  const handleInputChange = (field, value) => {
    setEditFormData(prev => {
      if (field === "addressinfo") {
        return { ...prev, addressinfo: value };
      }
      return { ...prev, [field]: value };
    });
  };

  // Submit edited client data with addresstype included in address array
  const handleEditSubmit = async () => {
    try {
      // Basic validation (expand as needed)
      if (
        !editFormData.name.trim() ||
        !editFormData.email.trim() ||
        !editFormData.phone.trim() ||
        !editFormData.addressinfo.street.trim()
      ) {
        alert("Please fill in at least name, email, phone, and street address.");
        return;
      }

      const formData = new FormData();
      formData.append("name", editFormData.name);
      formData.append("email", editFormData.email);
      formData.append("phone", editFormData.phone);
      formData.append("aadharCardNumber", editFormData.aadharCardNumber);
      formData.append("isActive", editFormData.isActive ? "true" : "false");

      formData.append(
        "address",
        JSON.stringify([{
          addresstype: editFormData.addresstype,
          addressinfo: editFormData.addressinfo
        }])
      );

      if (editFormData.avatar) formData.append("profile", editFormData.avatar);
      if (editFormData.idProof) formData.append("idProof", editFormData.idProof);

      await updateClientByAdmin(editClientId, formData);
      await fetchClients();
      setEditClientId(null);
      alert("Client updated successfully!");
    } catch (err) {
      alert("Failed to update client: " + (err?.response?.data?.message || err.message));
    }
  };

  // Filter clients by search term and active/inactive/all
  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      client.name.toLowerCase().includes(search) ||
      client.email.toLowerCase().includes(search) ||
      client.phone.includes(search);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && client.isActive) ||
      (filterStatus === "inactive" && !client.isActive);
    return matchesSearch && matchesStatus;
  });

  const activeClientsCount = clients.filter(c => c.isActive).length;
  const inactiveClientsCount = clients.length - activeClientsCount;

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-400 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Loading Clients</h3>
            <p className="text-gray-500">Please wait while we fetch your data...</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchClients}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Client Management
              </h1>
              <p className="text-gray-600 text-lg">Manage and monitor all your clients efficiently</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
                    <p className="text-sm text-gray-500">Total Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-600">{activeClientsCount}</p>
                  <p className="text-gray-600">Active Clients</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-gray-600">{inactiveClientsCount}</p>
                  <p className="text-gray-600">Inactive Clients</p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-blue-600">{filteredClients.length}</p>
                  <p className="text-gray-600">Filtered Results</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search clients by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Client</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span>Contact</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      <span>Status</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span>Joined</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span>Aadhar</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>Address</span>
                    </div>
                  </th>
                  <th className="px-6 py-5 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-50">
                {filteredClients.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-600 mb-2">No clients found</p>
                        <p className="text-gray-500">
                          {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "Start by adding your first client"}
                        </p>
                        {(searchTerm || filterStatus !== "all") && (
                          <button
                            onClick={() => {
                              setSearchTerm("");
                              setFilterStatus("all");
                            }}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Clear Filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Client rows */}
                {filteredClients.map((client, index) => (
                  <React.Fragment key={client.id}>
                    <tr
                      className={`hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300 ${
                        index % 2 === 0 ? 'bg-gray-25' : 'bg-white'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center shadow-md ring-2 ring-white">
                              {client.avatar ? (
                                <img
                                  src={client.avatar}
                                  alt="avatar"
                                  className="w-14 h-14 object-cover"
                                />
                              ) : (
                                <User className="text-blue-600 w-7 h-7" />
                              )}
                            </div>
                            <div
                              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                client.isActive ? 'bg-green-400' : 'bg-gray-400'
                              }`}
                            ></div>
                          </div>
                          <div>
                            <div className="font-bold text-gray-900 text-lg">{client.name}</div>
                            <div className="text-sm text-gray-500 flex items-center space-x-1">
                              <span className="capitalize bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                                {client.role}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium">{client.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{client.phone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleActive(client)}
                          className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 shadow-md ${
                            client.isActive
                              ? "bg-gradient-to-r from-green-400 to-green-600 text-white hover:from-green-500 hover:to-green-700 shadow-green-200"
                              : "bg-gradient-to-r from-gray-300 to-gray-500 text-white hover:from-gray-400 hover:to-gray-600 shadow-gray-200"
                          }`}
                          title={client.isActive ? "Deactivate Client" : "Activate Client"}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${client.isActive ? 'bg-white' : 'bg-gray-100'}`}></div>
                          {client.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-6 py-5 text-gray-600 font-medium">
                        {client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {client.aadharCardNumber}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-gray-600 max-w-xs">
                        <div className="truncate" title={client.fullAddress}>
                          {client.fullAddress || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => router.push(`/admin/clients/${client.id}`)}
                            className="p-3 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleEditClick(client)}
                            className="p-3 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded-full transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
                            title="Edit Client"
                          >
                            <Pencil size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded edit row */}
                    {editClientId === client.id && (
                      <tr className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t-2 border-blue-200">
                        <td colSpan={7} className="p-8">
                          <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                  <Pencil className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-bold text-gray-800">Edit Client Information</h3>
                                  <p className="text-gray-600">Update client details and preferences</p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => setEditClientId(null)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-100 p-3 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                              >
                                <X className="w-6 h-6" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              {/* Left column */}
                              <div className="space-y-6">
                                {/* Full Name */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <User className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Full Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editFormData.name}
                                    onChange={e => handleInputChange('name', e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="Enter full name"
                                  />
                                </div>

                                {/* Email */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Mail className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Email Address
                                  </label>
                                  <input
                                    type="email"
                                    value={editFormData.email}
                                    onChange={e => handleInputChange('email', e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="Enter email address"
                                  />
                                </div>

                                {/* Phone */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Phone className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Phone Number
                                  </label>
                                  <input
                                    type="tel"
                                    value={editFormData.phone}
                                    onChange={e => handleInputChange('phone', e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="Enter phone number"
                                  />
                                </div>

                                {/* Address Type */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <MapPin className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Address Type
                                  </label>
                                  <select
                                    value={editFormData.addresstype}
                                    onChange={e => handleInputChange("addresstype", e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all mb-4"
                                  >
                                    <option value="home">Home</option>
                                    <option value="work">Work</option>
                                    <option value="other">Other</option>
                                  </select>
                                  <div className="grid grid-cols-2 gap-4">
                                    <input
                                      type="text"
                                      value={editFormData.addressinfo.street}
                                      onChange={e =>
                                        handleInputChange("addressinfo", {
                                          ...editFormData.addressinfo,
                                          street: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                      placeholder="Street"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.addressinfo.city}
                                      onChange={e =>
                                        handleInputChange("addressinfo", {
                                          ...editFormData.addressinfo,
                                          city: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                      placeholder="City"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.addressinfo.state}
                                      onChange={e =>
                                        handleInputChange("addressinfo", {
                                          ...editFormData.addressinfo,
                                          state: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                      placeholder="State"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.addressinfo.country}
                                      onChange={e =>
                                        handleInputChange("addressinfo", {
                                          ...editFormData.addressinfo,
                                          country: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                      placeholder="Country"
                                    />
                                    <input
                                      type="text"
                                      value={editFormData.addressinfo.pincode}
                                      onChange={e =>
                                        handleInputChange("addressinfo", {
                                          ...editFormData.addressinfo,
                                          pincode: e.target.value,
                                        })
                                      }
                                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                      placeholder="Pincode"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Right column */}
                              <div className="space-y-6">

                                {/* Profile Picture */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <User className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Profile Picture
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => handleInputChange('avatar', e.target.files[0])}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                  />
                                </div>

                                {/* Aadhar Card Number */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Shield className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Aadhar Card Number
                                  </label>
                                  <input
                                    type="text"
                                    value={editFormData.aadharCardNumber}
                                    onChange={e => handleInputChange('aadharCardNumber', e.target.value)}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 group-hover:border-gray-300"
                                    placeholder="Enter Aadhar number"
                                  />
                                </div>

                                {/* ID Proof Upload */}
                                <div className="group">
                                  <label className="block text-sm font-bold text-gray-700 mb-2">
                                    <Shield className="w-5 h-5 inline mr-2 text-blue-600" />
                                    Upload ID Proof
                                  </label>
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={e => handleInputChange('idProof', e.target.files[0])}
                                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                                  />
                                </div>

                                {/* Active Toggle */}
                                <div className="group pt-4">
                                  <label className="flex items-center space-x-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all duration-200 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={editFormData.isActive}
                                      onChange={e => handleInputChange('isActive', e.target.checked)}
                                      className="w-6 h-6 text-blue-600 border-2 border-gray-300 rounded focus:ring-4 focus:ring-blue-100"
                                    />
                                    <div className="flex items-center space-x-2">
                                      <Activity className="w-5 h-5 text-blue-600" />
                                      <span className="text-sm font-bold text-gray-700">Active Status</span>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-6 border-t border-gray-200 space-x-4">
                              <button
                                type="button"
                                onClick={() => setEditClientId(null)}
                                className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 rounded-xl font-bold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={handleEditSubmit}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
                              >
                                <Check className="w-5 h-5" />
                                <span>Save Changes</span>
                              </button>
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
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Showing {filteredClients.length} of {clients.length} clients
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientManagementComponent;

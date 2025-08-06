"use client";
import React, { useEffect, useState } from "react";
import { getAllClientsByAdmin, updateClientByAdmin } from "@/services/client.services";
import {
  User, Eye, X, MapPin, Mail, Phone,
  Calendar, Shield, Activity, Users, Search, Filter, Grid3X3, List
} from "lucide-react";
import { useRouter } from 'next/navigation';

const ClientManagementComponent = () => {
  const router = useRouter();

  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

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
        address: client.address,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full text-center">
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
    );
  }

  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredClients.length > 0 ? (
        filteredClients.map(client => (
          <div key={client.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            {/* Profile Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
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
                <div
                  className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    client.isActive ? 'bg-green-400' : 'bg-gray-400'
                  }`}
                ></div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {client.role}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-gray-400" />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                <span>{client.phone}</span>
              </div>
              {client.fullAddress !== 'N/A' && (
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{client.fullAddress}</span>
                </div>
              )}
              {client.aadharCardNumber !== 'N/A' && (
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{client.aadharCardNumber}</span>
                </div>
              )}
            </div>

            {/* Date and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                {client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
              
              <button
                onClick={() => router.push(`/admin/clients/${client.id}`)}
                className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">No clients found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
          {(searchTerm || filterStatus !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterStatus("all");
              }}
              className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          )}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredClients.length > 0 ? (
              filteredClients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-r from-blue-100 to-indigo-100 flex items-center justify-center">
                          {client.avatar ? (
                            <img
                              src={client.avatar}
                              alt="avatar"
                              className="w-10 h-10 object-cover"
                            />
                          ) : (
                            <User className="text-blue-600 w-5 h-5" />
                          )}
                        </div>
                        <div
                          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                            client.isActive ? 'bg-green-400' : 'bg-gray-400'
                          }`}
                        ></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{client.name}</div>
                        <div className="text-xs text-gray-500">{client.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate max-w-[200px]">{client.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {client.createdAt ? new Date(client.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {client.aadharCardNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/admin/clients/${client.id}`)}
                      className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Users className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500 text-lg font-medium">No clients found</p>
                    <p className="text-gray-400 text-sm">Try adjusting your search criteria</p>
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
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Client Management</h1>
              <p className="text-gray-600">Manage your clients</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <Users className="w-4 h-4" />
                <span>{filteredClients.length} clients</span>
              </div>
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'cards'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4 mr-1" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'table'
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

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{activeClientsCount}</p>
                <p className="text-gray-600 text-sm">Active Clients</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-600">{clients.length - activeClientsCount}</p>
                <p className="text-gray-600 text-sm">Inactive Clients</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
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
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[150px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'cards' ? <CardView /> : <TableView />}
      </div>
    </div>
  );
};

export default ClientManagementComponent;
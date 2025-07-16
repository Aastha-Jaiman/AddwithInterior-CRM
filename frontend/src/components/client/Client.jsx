"use client";
import React, { useEffect, useState } from "react";
import { getAllClientsByAdmin } from "@/services/client.services";
import { User } from "lucide-react";

const ClientManagementComponent = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await getAllClientsByAdmin();
        console.log("API response:", response); // ✅ log stays for debug

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
          isVerified: client.isVerified || false,
          isactive: client.isactive || client.isActive || false,
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

    fetchClients();
  }, []);


  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading clients...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6">Client List</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Avatar</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Address</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Verified</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100 text-sm">
            {clients.map(client => (
              <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
                    {client.avatar ? (
                      <img
                        src={client.avatar}
                        alt="avatar"
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      <User className="text-indigo-600 w-5 h-5" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                <td className="px-6 py-4 text-gray-600">{client.email}</td>
                <td className="px-6 py-4 text-gray-600">{client.phone}</td>
                <td className="px-6 py-4 text-gray-600">{client.address}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${client.role === 'carpenter'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                    }`}>
                    {client.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-medium ${client.isVerified ? 'text-green-600' : 'text-red-500'}`}>
                    {client.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${client.isactive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                    }`}>
                    {client.isactive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="9" className="px-6 py-8 text-center text-gray-500">
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientManagementComponent;

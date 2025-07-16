'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getClientById } from '@/services/client.services'; // Or use getStaffById if you have one
import { Loader2 } from 'lucide-react';

const StaffUserDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchClientDetails(id);
  }, [id]);

  const fetchClientDetails = async (id) => {
    try {
      const res = await getClientById(id); // Replace if needed with getStaffById
      setClient(res.client);
    } catch (error) {
      console.error('Error fetching client details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!client) {
    return <div className="text-center text-red-500 mt-10">Client not found.</div>;
  }

  const address = client.address?.[0]?.addressinfo || {};

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-8 rounded-xl border">
      <button
        onClick={() => router.back()}
        className="mb-4 text-blue-600 hover:underline text-sm"
      >
        ← Back
      </button>

      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={client.profile?.url}
          alt={client.name}
          className="w-24 h-24 rounded-full object-cover ring-2 ring-blue-500"
        />
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{client.name}</h2>
          <p className="text-sm text-gray-500">{client.email}</p>
          <p className="text-sm text-gray-500">{client.phone}</p>
          <p className="text-xs mt-2 inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-700">
            Role: {client.role || 'N/A'}
          </p>
          <p className={`mt-2 text-sm font-medium ${client.isActive ? 'text-green-600' : 'text-red-600'}`}>
            {client.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Address</h3>
        <div className="bg-slate-50 p-4 rounded-md text-sm text-slate-700">
          <p><strong>Street:</strong> {address.street || '-'}</p>
          <p><strong>City:</strong> {address.city || '-'}</p>
          <p><strong>State:</strong> {address.state || '-'}</p>
          <p><strong>Country:</strong> {address.country || '-'}</p>
          <p><strong>Pincode:</strong> {address.pincode || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default StaffUserDetail;

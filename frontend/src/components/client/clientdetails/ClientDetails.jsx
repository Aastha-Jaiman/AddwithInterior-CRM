'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';
import { getClientByIdService } from '@/services/client.services';


export const ClientDetails = ({ selectedClient, backToList, handleEdit }) => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch latest client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const data =
          selectedClient?._id || selectedClient?.id
            ? await getClientByIdService(selectedClient._id || selectedClient.id)
            : selectedClient;
        setClientData(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch client data');
      } finally {
        setLoading(false);
      }
    };

    if (selectedClient) {
      fetchClient();
    }
  }, [selectedClient]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 text-lg">
        Loading client details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-md shadow-md border-b border-slate-200 px-6 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={backToList}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">
              Client Details
            </h1>
            <p className="text-slate-600 mt-1">
              View detailed information about{' '}
              <span className="font-semibold">{clientData?.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Client Details Content */}
      <div className="px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-12 text-white">
              <div className="flex items-center gap-6">
                <img
                  src={
                    clientData.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      clientData.name
                    )}&background=random`
                  }
                  alt={clientData.name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform hover:scale-105"
                />
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{clientData.name}</h2>
                  <p className="text-blue-100 text-lg mb-1">{clientData.projectName}</p>
                  <p className="text-blue-200">Member since {clientData.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Email, Phone, Join Date */}
                <div className="space-y-6">
                  <DetailCard icon={<Mail size={18} />} label="Email Address" value={clientData.email} color="blue" />
                  <DetailCard icon={<Phone size={18} />} label="Phone Number" value={clientData.phone} color="green" />
                  <DetailCard icon={<Calendar size={18} />} label="Join Date" value={clientData.joinDate} color="purple" />
                </div>

                {/* Project, Address, ID */}
                <div className="space-y-6">
                  <DetailCard icon={<User size={18} />} label="Project Name" value={clientData.projectName} color="orange" />
                  <DetailCard icon={<MapPin size={18} />} label="Address" value={clientData.address} color="teal" />
                  <DetailCard icon={<span className="text-sm font-bold">ID</span>} label="Client ID" value={`#${clientData._id || clientData.id}`} color="indigo" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4 justify-center">
                <button
                  onClick={() => handleEdit(clientData)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="p-1 bg-white/20 rounded-full">
                    <Edit size={18} />
                  </span>
                  Edit Client
                </button>
                <button
                  onClick={backToList}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                >
                  <span className="p-1 bg-white/20 rounded-full">
                    <ArrowLeft size={18} />
                  </span>
                  Back to List
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Card Component
const DetailCard = ({ icon, label, value, color }) => {
  const bgColor = `${color}-100`;
  const textColor = `${color}-600`;
  return (
    <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center bg-${bgColor} text-${textColor}`}>
          {icon}
        </div>
        <h3 className="text-base font-medium text-slate-800">{label}</h3>
      </div>
      <p className="text-slate-600 text-base">{value}</p>
    </div>
  );
};

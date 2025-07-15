import React from 'react';
import { ArrowLeft, Edit, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

export const ClientDetails = ({ selectedClient, backToList, handleEdit }) => {
  if (!selectedClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-slate-600">No client selected</div>
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
              View detailed information about <span className="font-semibold">{selectedClient.name}</span>
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
                <div className="relative">
                  <img
                    src={selectedClient.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedClient.name)}&background=random`}
                    alt={selectedClient.name}
                    className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg transition-transform hover:scale-105"
                  />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">{selectedClient.name}</h2>
                  <p className="text-blue-100 text-lg mb-1">{selectedClient.projectName}</p>
                  <p className="text-blue-200">Member since {selectedClient.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Mail size={18} />
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Email Address</h3>
                    </div>
                    <p className="text-slate-600 text-base">{selectedClient.email}</p>
                  </div>

                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Phone size={18} />
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Phone Number</h3>
                    </div>
                    <p className="text-slate-600 text-base">{selectedClient.phone}</p>
                  </div>

                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        <Calendar size={18} />
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Join Date</h3>
                    </div>
                    <p className="text-slate-600 text-base">{selectedClient.joinDate}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                        <User size={18} />
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Project Name</h3>
                    </div>
                    <p className="text-slate-600 text-base">{selectedClient.projectName}</p>
                  </div>

                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center text-teal-600">
                        <MapPin size={18} />
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Address</h3>
                    </div>
                    <p className="text-slate-600 text-base">{selectedClient.address}</p>
                  </div>

                  <div className="bg-white/90 border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <span className="text-sm font-bold">ID</span>
                      </div>
                      <h3 className="text-base font-medium text-slate-800">Client ID</h3>
                    </div>
                    <p className="text-slate-600 text-base">#{selectedClient.id}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex gap-4 justify-center">
                <button
                  onClick={() => handleEdit(selectedClient)}
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
import React from 'react';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Upload, Camera, Save } from 'lucide-react';

export const ClientForm = ({ formData, setFormData, editingId, backToList, handleSubmit, handleUpdate, handleImageUpload }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60 px-6 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={backToList}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h1>
            <p className="text-slate-600 mt-1">
              {editingId ? 'Update client information' : 'Fill in the details to add a new client'}
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center space-y-4 mb-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                  <img
                    src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`}
                    alt="Preview"
                    className="w-full h-full rounded-full object-cover bg-white"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                  <Camera size={16} className="text-white" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
                  <Upload size={16} />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, avatar: '' })}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Join Date *</label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={formData.joinDate}
                    onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="space-y-6 mb-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name *</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Enter project name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Complete Address *</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
                    placeholder="Enter complete address"
                    rows="3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture URL (Alternative)</label>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="https://example.com/profile.jpg (optional)"
                  />
                </div>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4">
              <button
                onClick={backToList}
                className="flex-1 px-6 py-3 bg-white/80 hover:bg-white text-slate-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={editingId ? handleUpdate : handleSubmit}
                className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
              >
                <Save size={20} />
                {editingId ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
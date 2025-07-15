// StaffForm Component

"use client";
import React, { createContext, useContext, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera,
  Briefcase, ArrowLeft
} from 'lucide-react';

export const StaffForm = ({ formData, setFormData, handleSubmit, resetForm, isEditing }) => {
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Designer': return '🎨';
      case 'Salesperson': return '💼';
      case 'Carpenter': return '🔨';
      default: return '👤';
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-white via-white/95 to-blue-50/80 rounded-3xl w-full max-w-2xl shadow-2xl backdrop-blur-sm border border-white/20 transform animate-slideUp max-h-[90vh] flex flex-col">
        <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-t-3xl"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white">
                {isEditing ? 'Edit Staff Member' : 'Add New Staff Member'}
              </h2>
              <p className="text-blue-100 mt-1">
                {isEditing ? 'Update the staff member details' : 'Fill in the details to add a new team member'}
              </p>
            </div>
            <button
              onClick={resetForm}
              className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 text-white hover:scale-110"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <label className="block text-sm font-semibold text-slate-700 mb-2">Job Category *</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="Designer">{getCategoryIcon('Designer')} Designer</option>
                  <option value="Salesperson">{getCategoryIcon('Salesperson')} Salesperson</option>
                  <option value="Carpenter">{getCategoryIcon('Carpenter')} Carpenter</option>
                </select>
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
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Salary *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                <input
                  type="text"
                  required
                  placeholder="60,000"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
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
        </div>
        <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-b-3xl border-t border-slate-200/50">
          <div className="flex gap-4">
            <button
              onClick={resetForm}
              className="flex-1 px-6 py-3 bg-white/80 hover:bg-white text-slate-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
            >
              <Save size={20} />
              {isEditing ? 'Update Staff Member' : 'Add Staff Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
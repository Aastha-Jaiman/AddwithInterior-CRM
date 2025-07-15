"use client";
import React, { createContext, useContext, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera,
  Briefcase, ArrowLeft
} from 'lucide-react';


// StaffList Component
export const StaffList = ({ staffList, handleEdit, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const router = useRouter();
  const categories = ['All', 'Designer', 'Salesperson', 'Carpenter'];

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || staff.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Designer': return 'bg-purple-100 text-purple-700';
      case 'Salesperson': return 'bg-green-100 text-green-700';
      case 'Carpenter': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewDetails = (staffId) => {
    router.push(`/admin/staffusers/${staffId}`);
  };

  return (
    <>
      <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 px-6 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
              <Filter size={18} className="text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Filter by:</span>
          </div>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${filterCategory === category
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-white/80 hover:bg-white text-slate-700 shadow-md hover:shadow-lg'
              }`}
            >
              {category}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="overflow-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Avatar</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Join Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Salary</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => handleViewDetails(staff.id)}>
                  <td className="px-4 py-3">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{staff.name}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.address}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(staff.category)}`}>
                      {staff.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{staff.joinDate}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.salary}</td>
                  <td className="px-4 py-3 text-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(staff)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-md"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
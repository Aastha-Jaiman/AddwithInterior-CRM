"use client"

import React, { useState } from 'react';
import { 
  Upload, FileText, Trash2, Eye, Download, Plus, Search, 
  TrendingUp, Star, Palette, Sofa, Lightbulb, Bath, 
  ChefHat, Bed, Users, Home, FileType 
} from 'lucide-react';

const DashboardView = ({ 
  brochures, 
  setBrochures, 
  setSelectedBrochure, 
  setCurrentView, 
  deleteBrochure, 
  handleDownload, 
  toggleStar, 
  isAdmin, 
  user 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = ['all', 'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Traditional'];

  const filteredBrochures = brochures.filter(brochure => {
    const matchesSearch = brochure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brochure.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || brochure.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'size':
        return parseFloat(b.size) - parseFloat(a.size);
      case 'downloads':
        return b.downloads - a.downloads;
      default:
        return 0;
    }
  });

  const totalDownloads = brochures.reduce((acc, b) => acc + b.downloads, 0);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Living Room': return <Sofa className="w-5 h-5" />;
      case 'Bedroom': return <Bed className="w-5 h-5" />;
      case 'Kitchen': return <ChefHat className="w-5 h-5" />;
      case 'Bathroom': return <Bath className="w-5 h-5" />;
      case 'Office': return <Users className="w-5 h-5" />;
      case 'Traditional': return <Home className="w-5 h-5" />;
      default: return <Palette className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-blue-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Interior Design Portfolio
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {isAdmin ? 'Admin Panel - Professional interior design showcase' : 'Professional interior design showcase'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role}</p>
              </div>
              {isAdmin && (
                <button
                  onClick={() => setCurrentView('upload')}
                  className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New Design</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Dashboard - Only for Admin */}
      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-8">
        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Projects</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{brochures.length}</p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% this month
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Palette className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{totalDownloads.toLocaleString()}</p>
                  <p className="text-xs text-emerald-600 mt-1 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18% this week
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Eye className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Design Categories</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{categories.length - 1}</p>
                  <p className="text-xs text-gray-500 mt-1">Active categories</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileType className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 mb-8">
          <div className="flex items-center mb-4 space-x-2">
            <Search className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Search & Filters</h2>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div className="w-full sm:max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search interior designs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm transition-all"
                />
              </div>
            </div>

            <div className="w-full sm:w-60">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm transition-all"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-60">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm transition-all"
              >
                <option value="recent">Recently Added</option>
                <option value="name">Name A-Z</option>
                <option value="size">File Size</option>
                <option value="downloads">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Brochures Display */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50">
                {filteredBrochures.map((brochure) => (
                  <tr key={brochure.id} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-100 rounded-lg flex items-center justify-center mr-3">
                          {getCategoryIcon(brochure.category)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{brochure.name}</div>
                          <div className="text-xs text-gray-500">{brochure.type} • {brochure.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gradient-to-r from-blue-100 to-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit">
                        {getCategoryIcon(brochure.category)}
                        <span>{brochure.category}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brochure.designer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{brochure.downloads}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleStar(brochure.id)}
                          className={`p-2 rounded-lg transition-all duration-200 ${brochure.starred ? 'text-yellow-500 hover:bg-yellow-50' : 'text-gray-400 hover:bg-gray-100'}`}
                        >
                          <Star className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedBrochure(brochure);
                            setCurrentView('preview');
                          }}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(brochure)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => deleteBrochure(brochure.id)}
                            className="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredBrochures.length === 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No designs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 font-medium"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardView;
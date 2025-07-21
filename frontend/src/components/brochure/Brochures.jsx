"use client";

import React, { useState } from "react";
import { Search, FileText, Filter, Upload, Download, Trash2 } from "lucide-react";
import UploadBrochure from "./UploadView";


// Dummy data for brochures
const initialBrochures = [
  { id: "1", name: "Company Overview 2025.pdf", url: "#", uploadedAt: "2025-07-01T10:00:00Z", category: "Corporate", views: 120 },
  { id: "2", name: "Product Catalog.pdf", url: "#", uploadedAt: "2025-06-15T14:30:00Z", category: "Marketing", views: 85 },
  { id: "3", name: "Services Brochure.pdf", url: "#", uploadedAt: "2025-05-20T09:15:00Z", category: "Services", views: 200 },
  { id: "4", name: "Annual Report.pdf", url: "#", uploadedAt: "2025-04-10T11:45:00Z", category: "Corporate", views: 150 },
];

const BrochureManagement = () => {
  const [brochures, setBrochures] = useState(initialBrochures);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Calculate stats
  const totalBrochures = brochures.length;
  const uniqueCategories = [...new Set(brochures.map((b) => b.category))].length;
  const totalViews = brochures.reduce((sum, b) => sum + b.views, 0);

  // Filter brochures
  const filteredBrochures = brochures.filter((brochure) => {
    const matchesSearch = brochure.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || brochure.category === categoryFilter;
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "last30" &&
        new Date(brochure.uploadedAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleDelete = (brochureId) => {
    if (!confirm("Are you sure you want to delete this brochure?")) return;
    setBrochures(brochures.filter((brochure) => brochure.id !== brochureId));
    alert("Brochure deleted successfully");
  };

  const handleDownload = (url, name) => {
    alert(`Downloading ${name}`);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSuccess = (newBrochure) => {
    setBrochures([...brochures, newBrochure]);
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-blue-100/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-4 sm:px-6 sm:py-5">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Brochure Management</h1>
                <p className="text-blue-100 text-sm sm:text-base mt-1">Effortlessly manage and distribute your brochures</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload New Brochure</span>
              </button>
            </div>
          </div>

          {/* Stats Dashboard */}
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <div className="bg-blue-200 p-3 rounded-full">
                <FileText className="w-7 h-7 text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Brochures</p>
                <p className="text-3xl font-bold text-gray-900">{totalBrochures}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <div className="bg-purple-200 p-3 rounded-full">
                <FileText className="w-7 h-7 text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Design Categories</p>
                <p className="text-3xl font-bold text-gray-900">{uniqueCategories}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 flex items-center space-x-4 transform hover:scale-105 transition-transform duration-200 shadow-sm">
              <div className="bg-green-200 p-3 rounded-full">
                <FileText className="w-7 h-7 text-green-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{totalViews}</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
            <div className="relative w-full sm:w-1/3">
              <input
                type="text"
                placeholder="Search brochures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
              />
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200"
                >
                  <option value="all">All Categories</option>
                  {[...new Set(brochures.map((b) => b.category))].map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full sm:w-48 pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white shadow-sm transition-all duration-200"
                >
                  <option value="all">All Time</option>
                  <option value="last30">Last 30 Days</option>
                </select>
                <Filter className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Brochure Table */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            {filteredBrochures.length === 0 ? (
              <div className="text-center py-10">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No brochures found</p>
              </div>
            ) : (
              <table className="w-full text-left border-separate border-spacing-0">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 text-sm font-semibold text-gray-700 border-b-2 border-gray-200 rounded-tl-lg">Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-700 border-b-2 border-gray-200 hidden sm:table-cell">Category</th>
                    <th className="p-4 text-sm font-semibold text-gray-700 border-b-2 border-gray-200 hidden md:table-cell">Upload Date</th>
                    <th className="p-4 text-sm font-semibold text-gray-700 border-b-2 border-gray-200 hidden lg:table-cell">Views</th>
                    <th className="p-4 text-sm font-semibold text-gray-700 border-b-2 border-gray-200 rounded-tr-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBrochures.map((brochure, index) => (
                    <tr key={brochure.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-150`}>
                      <td className="p-4 text-sm text-gray-900 border-b border-gray-200">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-red-500" />
                          <span>{brochure.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-b border-gray-200 hidden sm:table-cell">{brochure.category}</td>
                      <td className="p-4 text-sm text-gray-600 border-b border-gray-200 hidden md:table-cell">
                        {new Date(brochure.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-sm text-gray-600 border-b border-gray-200 hidden lg:table-cell">{brochure.views}</td>
                      <td className="p-4 text-sm border-b border-gray-200">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDownload(brochure.url, brochure.name)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Download"
                          >
                            <Download className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(brochure.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-blue-100/50">
            <UploadBrochure onUploadSuccess={handleUploadSuccess} onClose={() => setShowUploadModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BrochureManagement;
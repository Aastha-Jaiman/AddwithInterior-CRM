"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Trash2, FileText, Search, Plus, Eye } from 'lucide-react';
import { addBrochure, deleteBrochureById, getAllBrochures } from '@/services/brochure.services';

const BrochureManager = () => {
  const [brochures, setBrochures] = useState([]);

  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    keywords: '',
    file: null
  });

  useEffect(() => {
    const fetchBrochures = async () => {
      try {
        const data = await getAllBrochures();
        setBrochures(data.brochures || []);
      } catch (error) {
        console.error("Failed to fetch brochures:", error);
      }
    };

    fetchBrochures();
  }, []);

  const fileInputRef = useRef(null);

  const categories = ['modular_kitchen', 'inPlace_Furniture'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    } else {
      alert('Please select a PDF file');
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.category || !formData.file) {
      alert('Please fill in all required fields and select a PDF file');
      return;
    }

    setIsUploading(true);

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("category", formData.category);
    payload.append("keywords", formData.keywords);
    payload.append("document", formData.document || formData.file);

    try {
      const response = await addBrochure(payload);
      setBrochures(prev => [response.brochure, ...prev]);
      alert("Brochure uploaded successfully!");

      setFormData({ title: '', category: '', keywords: '', file: null });
      setShowUploadForm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload brochure");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this brochure?');
  if (!confirmed) return;

  try {
    await deleteBrochureById(id);
    setBrochures(prev => prev.filter(b => b._id !== id));
  } catch (error) {
    console.error("Delete failed:", error);
  }
};


  const handleView = (brochure) => {
    window.open(brochure.document, '_blank'); // open in new tab
  };

  // Calculate statistics
  const totalBrochures = brochures.length;
  const modularKitchenCount = brochures.filter(b => b.category === 'modular_kitchen').length;
  const inPlaceFurnitureCount = brochures.filter(b => b.category === 'inPlace_Furniture').length;

  const filteredBrochures = brochures.filter(brochure => {
    const matchesSearch = brochure.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      brochure.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || brochure.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brochure Management</h1>
        <p className="text-gray-600">Upload, manage, and organize your brochures</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Brochures */}
        <div className="bg-white rounded-lg border-l-4 border-blue-700 p-6 text-white shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-700 text-sm font-medium">Total Brochures</p>
              <p className="text-3xl font-bold text-blue-700">{totalBrochures}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-700" />
          </div>
        </div>

        {/* Modular Kitchen */}
        <div className="bg-white rounded-lg border-l-4 border-green-600 p-6 text-white shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Modular Kitchen</p>
              <p className="text-3xl font-bold text-green-600">{modularKitchenCount}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* InPlace Furniture */}
        <div className="bg-white rounded-lg border-l-4 border-purple-600 p-6 text-white shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">InPlace Furniture</p>
              <p className="text-3xl font-bold text-purple-600">{inPlaceFurnitureCount}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>



      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search brochures..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'modular_kitchen' ? 'Modular Kitchen' : 'InPlace Furniture'}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowUploadForm(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Brochure
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="mb-8 bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Upload New Brochure</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter brochure title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'modular_kitchen' ? 'Modular Kitchen' : 'InPlace Furniture'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PDF File *
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
            </div>

            <div className="md:col-span-2 flex gap-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading}
                className={`px-6 py-2 rounded-md flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 
    ${isUploading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
  `}
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Upload Brochure'}
              </button>

              <button
                type="button"
                onClick={() => setShowUploadForm(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Brochures Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brochure Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keywords
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrochures.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No brochures found</p>
                  </td>
                </tr>
              ) : (
                filteredBrochures.map((brochure) => (
                  <tr key={brochure._id || brochure.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-8 h-8 text-red-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {brochure.title}
                          </div>
                          <div className="text-sm text-gray-500 w-48 truncate">
                            {brochure.document}
                          </div>

                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${brochure.category === 'modular_kitchen'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                        }`}>
                        {brochure.category === 'modular_kitchen' ? 'Modular Kitchen' : 'InPlace Furniture'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {brochure.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-800"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(brochure.uploadDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(brochure.fileSize / 1024).toFixed(2)} KB
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleView(brochure)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="View"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brochure._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredBrochures.length} of {brochures.length} brochures
      </div>
    </div>
  );
};

export default BrochureManager;
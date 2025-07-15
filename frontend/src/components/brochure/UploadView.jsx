"use client"

import React, { useState, useRef } from 'react';
import { Upload, FileText, X, ArrowLeft, Camera, MapPin, User, Calendar, DollarSign, Home } from 'lucide-react';

const UploadView = ({ setBrochures, setCurrentView, isAdmin }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: '',
    designer: '',
    description: '',
    tags: '',
    projectLocation: '',
    projectYear: new Date().getFullYear().toString(),
    clientType: 'Residential',
    budget: '',
    area: ''
  });

  const fileInputRef = useRef(null);

  const categories = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Commercial', 'Traditional'];
  const clientTypes = ['Residential', 'Commercial', 'Hospitality', 'Office', 'Retail'];

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Only admin users can upload designs.</p>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 font-medium"
          >
            Go Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file');
      return;
    }

    if (!uploadForm.name || !uploadForm.category || !uploadForm.designer) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUploading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      selectedFiles.forEach((file, index) => {
        const newBrochure = {
          id: Date.now() + index,
          name: uploadForm.name || file.name.replace(/\.[^/.]+$/, ""),
          type: file.type.split('/')[1]?.toUpperCase() || 'PDF',
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploadDate: new Date().toISOString().split('T')[0],
          thumbnail: '/api/placeholder/300/400',
          url: URL.createObjectURL(file),
          category: uploadForm.category,
          status: 'active',
          downloads: 0,
          starred: false,
          tags: uploadForm.tags ? uploadForm.tags.split(',').map(tag => tag.trim()) : ['new'],
          description: uploadForm.description || 'No description provided',
          designer: uploadForm.designer,
          projectLocation: uploadForm.projectLocation || 'Not specified',
          projectYear: uploadForm.projectYear,
          clientType: uploadForm.clientType,
          budget: uploadForm.budget || 'Not specified',
          area: uploadForm.area || 'Not specified'
        };
        setBrochures(prev => [newBrochure, ...prev]);
      });

      alert('Files uploaded successfully!');
      setSelectedFiles([]);
      setUploadForm({
        name: '',
        category: '',
        designer: '',
        description: '',
        tags: '',
        projectLocation: '',
        projectYear: new Date().getFullYear().toString(),
        clientType: 'Residential',
        budget: '',
        area: ''
      });
      setCurrentView('dashboard');

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Design</h1>
                <p className="text-sm text-gray-500">Upload your interior design brochure</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
          {/* Upload Area */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload Design Files *
            </label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your files here, or click to browse
              </h3>
              <p className="text-gray-600 mb-4">
                Support for PDF, JPG, PNG files up to 10MB each
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  PDF
                </span>
                <span className="flex items-center">
                  <Camera className="w-4 h-4 mr-1" />
                  Images
                </span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Files</h3>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designer Name *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={uploadForm.designer}
                  onChange={(e) => setUploadForm({...uploadForm, designer: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  placeholder="Enter designer name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Location
              </label>
              <div className="relative">
                <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={uploadForm.projectLocation}
                  onChange={(e) => setUploadForm({...uploadForm, projectLocation: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  placeholder="e.g., Mumbai, India"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Year
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="number"
                  value={uploadForm.projectYear}
                  onChange={(e) => setUploadForm({...uploadForm, projectYear: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  placeholder="2024"
                  min="2000"
                  max="2030"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Type
              </label>
              <select
                value={uploadForm.clientType}
                onChange={(e) => setUploadForm({...uploadForm, clientType: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              >
                {clientTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Range
              </label>
              <div className="relative">
                <DollarSign className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={uploadForm.budget}
                  onChange={(e) => setUploadForm({...uploadForm, budget: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  placeholder="e.g., ₹8-12 Lakhs"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <div className="relative">
                <Home className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={uploadForm.area}
                  onChange={(e) => setUploadForm({...uploadForm, area: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
                  placeholder="e.g., 1200 sq ft"
                />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={uploadForm.description}
              onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              placeholder="Describe your interior design project..."
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={uploadForm.tags}
              onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all"
              placeholder="modern, luxury, contemporary (separated by commas)"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || selectedFiles.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-xl hover:from-blue-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-medium flex items-center space-x-2"
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload Design</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadView;
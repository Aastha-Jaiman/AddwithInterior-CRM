"use client";
import React, { useState, useRef } from "react";
import { Search, FileText, Filter, Upload, Download, Trash2, Eye, X, Plus } from "lucide-react";


// Dummy data for brochures
const initialBrochures = [
  {
    id: "1",
    title: "Modern Living Room Collection",
    name: "Company Overview 2025.pdf",
    url: "https://example.com/brochure1.pdf",
    uploadedAt: "2025-07-01T10:00:00Z",
    category: "Inplace Furniture",
    keywords: ["modern", "living room", "furniture"],
    views: 120,
    downloads: 45
  },
  {
    id: "2",
    title: "Premium Kitchen Solutions", 
    name: "Product Catalog.pdf",
    url: "https://example.com/brochure2.pdf",
    uploadedAt: "2025-06-15T14:30:00Z",
    category: "Modular Kitchen",
    keywords: ["kitchen", "modular", "premium"],
    views: 85,
    downloads: 32
  },
  {
    id: "3",
    title: "Custom Interior Services",
    name: "Services Brochure.pdf", 
    url: "https://example.com/brochure3.pdf",
    uploadedAt: "2025-05-20T09:15:00Z",
    category: "Inplace Furniture",
    keywords: ["interior", "custom", "services"],
    views: 200,
    downloads: 78
  },
  {
    id: "4",
    title: "Annual Kitchen Trends",
    name: "Annual Report.pdf",
    url: "https://example.com/brochure4.pdf",
    uploadedAt: "2025-04-10T11:45:00Z",
    category: "Modular Kitchen", 
    keywords: ["trends", "annual", "kitchen"],
    views: 150,
    downloads: 55
  },
];

const BrochureManagement = () => {
  const [brochures, setBrochures] = useState(initialBrochures);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showUploadForm, setShowUploadForm] = useState(false);

  // Upload form states
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    keywords: [],
    file: null
  });
  const [newKeyword, setNewKeyword] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const categories = ["Inplace Furniture", "Modular Kitchen"];

  // Calculate stats
  const totalBrochures = brochures.length;
  const uniqueCategories = [...new Set(brochures.map((b) => b.category))].length;
  const totalDownloads = brochures.reduce((sum, b) => sum + b.downloads, 0);

  // Filter brochures
  const filteredBrochures = brochures.filter((brochure) => {
    const matchesSearch = brochure.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         brochure.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || brochure.category === categoryFilter;
    const matchesDate = dateFilter === "all" || 
      (dateFilter === "last30" && new Date(brochure.uploadedAt) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const handleDelete = (brochureId) => {
    if (!confirm("Are you sure you want to delete this brochure?")) return;
    setBrochures(brochures.filter((brochure) => brochure.id !== brochureId));
    alert("Brochure deleted successfully");
  };

  const handleDownload = (url, name) => {
    const brochureId = brochures.find(b => b.name === name)?.id;
    if (brochureId) {
      setBrochures(prev => prev.map(b => 
        b.id === brochureId ? { ...b, downloads: b.downloads + 1 } : b
      ));
    }

    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewPDF = (url, title) => {
    window.open(url, '_blank');
  };

  // Upload form functions
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setUploadError("");
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !formData.keywords.includes(newKeyword.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  };

  const handleFileChange = (file) => {
    if (!file) return;

    if (!file.type.includes("pdf")) {
      setUploadError("Only PDF files are allowed");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setFormData(prev => ({
      ...prev,
      file: file
    }));
    setUploadError("");
  };

  const handleInputFileChange = (e) => {
    handleFileChange(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClearFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }));
    setUploadError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setUploadError("Please enter a brochure title");
      return;
    }
    
    if (!formData.category) {
      setUploadError("Please select a category");
      return;
    }
    
    if (formData.keywords.length === 0) {
      setUploadError("Please add at least one keyword");
      return;
    }
    
    if (!formData.file) {
      setUploadError("Please select a file to upload");
      return;
    }

    setUploading(true);

    try {
      const newBrochure = {
        id: Math.random().toString(36).substr(2, 9),
        title: formData.title,
        name: formData.file.name,
        url: URL.createObjectURL(formData.file),
        uploadedAt: new Date().toISOString(),
        category: formData.category,
        keywords: formData.keywords,
        views: 0,
        downloads: 0
      };

      // Add new brochure to list
      setBrochures([newBrochure, ...brochures]);
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        keywords: [],
        file: null
      });
      setNewKeyword("");
      setShowUploadForm(false);
      
      alert("Brochure uploaded successfully!");
      
    } catch (err) {
      setUploadError("Failed to upload brochure");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setFormData({
      title: "",
      category: "",
      keywords: [],
      file: null
    });
    setNewKeyword("");
    setUploadError("");
    setShowUploadForm(false);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Brochure Management</h1>
        <p className="text-gray-600">Effortlessly manage and distribute your brochures</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Brochures</p>
              <p className="text-3xl font-bold text-gray-900">{totalBrochures}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-3xl font-bold text-gray-900">{uniqueCategories}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Filter className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900">{totalDownloads}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Download className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search brochures..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="Inplace Furniture">Inplace Furniture</option>
              <option value="Modular Kitchen">Modular Kitchen</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="last30">Last 30 Days</option>
            </select>
          </div>

          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Upload Brochure
          </button>
        </div>
      </div>

      {/* Upload Form - Shows above table when button is clicked */}
      {showUploadForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upload New Brochure</h2>
            <button
              onClick={handleCancelUpload}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brochure Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brochure Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Enter brochure title"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Keywords *
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddKeyword())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Add a keyword"
                  />
                  <button
                    type="button"
                    onClick={handleAddKeyword}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
                
                {formData.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {formData.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                      >
                        {keyword}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(keyword)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload PDF File *
              </label>
              
              {!formData.file ? (
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-900 mb-1">
                    Drop your PDF file here, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-blue-600 hover:text-blue-700 underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-gray-500">PDF only, max 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleInputFileChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-6 w-6 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{formData.file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{uploadError}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelUpload}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload Brochure
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Brochures Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
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
                  Downloads
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBrochures.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No brochures found</p>
                    <p className="text-gray-400">Try adjusting your search or filters</p>
                  </td>
                </tr>
              ) : (
                filteredBrochures.map((brochure) => (
                  <tr key={brochure.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{brochure.title}</div>
                        <div className="text-sm text-gray-500">{brochure.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {brochure.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {brochure.keywords.map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(brochure.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {brochure.downloads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewPDF(brochure.url, brochure.title)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="View PDF"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(brochure.url, brochure.name)}
                          className="text-green-600 hover:text-green-900 p-1 rounded"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brochure.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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
    </div>
  );
};

export default BrochureManagement;

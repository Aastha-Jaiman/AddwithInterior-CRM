"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowLeft, Upload, File, User, Calendar, MapPin, 
  DollarSign, FileText, Plus, Trash2, Camera, ChevronDown 
} from "lucide-react";

const ProjectForm = ({ currentView, selectedProject, navigateToList, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    estimatedBudget: "",
    finalBudget: "",
    designer: "",
    salesperson: "",
    carpenters: [""],
    startingDate: "",
    location: "",
    description: "",
    projectImage: null,
    roughQuotation: null,
    finalQuotation: null,
    currentStatus: "pending",
    customerName: "",
    customerNumber: "",
    customerEmail: "",
    customerAddress: "",
  });

  const teamMembers = {
    salespersons: [
      { id: 1, name: "Mike Johnson" },
      { id: 2, name: "Lisa Anderson" },
      { id: 3, name: "Robert Wilson" }
    ],
    designers: [
      { id: 1, name: "Sarah Wilson" },
      { id: 2, name: "Alex Cooper" },
      { id: 3, name: "Emma Davis" }
    ],
    carpenters: [
      { id: 1, name: "David Brown" },
      { id: 2, name: "Tom Wilson" },
      { id: 3, name: "Robert Davis" },
      { id: 4, name: "James Miller" }
    ]
  };

  const clients = [
    { id: 1, name: "John Doe", number: "+91 9876543210", email: "john@example.com", address: "123 Main St, Mumbai" },
    { id: 2, name: "Jane Smith", number: "+91 8765432109", email: "jane@example.com", address: "456 Oak Ave, Delhi" },
    { id: 3, name: "Alice Brown", number: "+91 7654321098", email: "alice@example.com", address: "789 Pine Rd, Bangalore" }
  ];

  const [errors, setErrors] = useState({});
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);

  // Check if design PDF exists for final quotation upload
  const hasDesignPdf = selectedProject?.documents?.designPdf;

  useEffect(() => {
    if (currentView === 'edit' && selectedProject) {
      setFormData({
        name: selectedProject.name || "",
        category: selectedProject.category || "",
        estimatedBudget: selectedProject.estimatedBudget || "",
        finalBudget: selectedProject.finalBudget || "",
        designer: selectedProject.designer || "",
        salesperson: selectedProject.salesperson || "",
        carpenters: selectedProject.carpenter || [""],
        startingDate: selectedProject.startingDate || "",
        location: selectedProject.location || "",
        description: selectedProject.description || "",
        projectImage: null,
        roughQuotation: null,
        finalQuotation: null,
        currentStatus: selectedProject.designStatus || "pending",
        customerName: selectedProject.customerName || "",
        customerNumber: selectedProject.customerNumber || "",
        customerEmail: selectedProject.customerEmail || "",
        customerAddress: selectedProject.customerAddress || "",
      });
    }
  }, [currentView, selectedProject]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleClientSelect = (client) => {
    setFormData({
      ...formData,
      customerName: client.name,
      customerNumber: client.number,
      customerEmail: client.email,
      customerAddress: client.address,
    });
    setClientDropdownOpen(false);
  };

  const addCarpenter = () => {
    setFormData({
      ...formData,
      carpenters: [...formData.carpenters, ""],
    });
  };

  const removeCarpenter = (index) => {
    const newCarpenters = formData.carpenters.filter((_, i) => i !== index);
    setFormData({ ...formData, carpenters: newCarpenters });
  };

  const updateCarpenter = (index, value) => {
    const newCarpenters = [...formData.carpenters];
    newCarpenters[index] = value;
    setFormData({ ...formData, carpenters: newCarpenters });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Project name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.estimatedBudget) newErrors.estimatedBudget = "Estimated budget is required";
    if (!formData.designer) newErrors.designer = "Designer is required";
    if (!formData.salesperson) newErrors.salesperson = "Salesperson is required";
    if (!formData.startingDate) newErrors.startingDate = "Starting date is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.customerName) newErrors.customerName = "Customer name is required";
    if (!formData.customerNumber) newErrors.customerNumber = "Customer number is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                onClick={navigateToList}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to Projects</span>
              </button>
              
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {currentView === 'edit' ? 'Edit Project' : 'Create New Project'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {currentView === 'edit' ? "Update project information" : "Fill in the project details"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Project Details
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Project Name */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.name 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter project name"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.category 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select category</option>
                    <option value="Modular Kitchen">Modular Kitchen</option>
                    <option value="Inplace Furniture">Inplace Furniture</option>
                    <option value="Full Home Interior">Full Home Interior</option>
                    <option value="Office Interior">Office Interior</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                </div>

                {/* Current Status - Only show in edit mode */}
                {currentView === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Status
                    </label>
                    <select
                      name="currentStatus"
                      value={formData.currentStatus}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    >
                      <option value="pending">Pending</option>
                      <option value="uploaded">Uploaded</option>
                      <option value="finalize">Finalize</option>
                    </select>
                  </div>
                )}

                {/* Budgets */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Estimated Budget *
                  </label>
                  <input
                    type="number"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.estimatedBudget 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter estimated budget"
                  />
                  {errors.estimatedBudget && <p className="text-red-500 text-xs mt-1">{errors.estimatedBudget}</p>}
                </div>

                {/* Final Budget - Only show in edit mode */}
                {currentView === 'edit' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Final Budget
                    </label>
                    <input
                      type="number"
                      name="finalBudget"
                      value={formData.finalBudget}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                      placeholder="Enter final budget"
                    />
                  </div>
                )}

                {/* Starting Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Starting Date *
                  </label>
                  <input
                    type="date"
                    name="startingDate"
                    value={formData.startingDate}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.startingDate 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  />
                  {errors.startingDate && <p className="text-red-500 text-xs mt-1">{errors.startingDate}</p>}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.location 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter location"
                  />
                  {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                </div>

                {/* Description */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors resize-none"
                    placeholder="Enter project description"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>

              {/* Client Dropdown */}
              <div className="mb-4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-between gap-2"
                  >
                    <span>Select Existing Client</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {clientDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 sm:right-auto sm:w-64 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
                      {clients.map(client => (
                        <button
                          key={client.id}
                          type="button"
                          onClick={() => handleClientSelect(client)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                          <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{client.number}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.customerName 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="customerNumber"
                    value={formData.customerNumber}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.customerNumber 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                    placeholder="Enter phone number"
                  />
                  {errors.customerNumber && <p className="text-red-500 text-xs mt-1">{errors.customerNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Team Assignment
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Designer */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Designer *
                  </label>
                  <select
                    name="designer"
                    value={formData.designer}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.designer 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select designer</option>
                    {teamMembers.designers.map(designer => (
                      <option key={designer.id} value={designer.name}>
                        {designer.name}
                      </option>
                    ))}
                  </select>
                  {errors.designer && <p className="text-red-500 text-xs mt-1">{errors.designer}</p>}
                </div>

                {/* Salesperson */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Salesperson *
                  </label>
                  <select
                    name="salesperson"
                    value={formData.salesperson}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.salesperson 
                        ? 'border-red-500 dark:border-red-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    } dark:bg-gray-700 dark:text-white`}
                  >
                    <option value="">Select salesperson</option>
                    {teamMembers.salespersons.map(salesperson => (
                      <option key={salesperson.id} value={salesperson.name}>
                        {salesperson.name}
                      </option>
                    ))}
                  </select>
                  {errors.salesperson && <p className="text-red-500 text-xs mt-1">{errors.salesperson}</p>}
                </div>

                {/* Carpenters */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Carpenters
                  </label>
                  <div className="space-y-2">
                    {formData.carpenters.map((carpenter, index) => (
                      <div key={index} className="flex gap-2">
                        <select
                          value={carpenter}
                          onChange={(e) => updateCarpenter(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                        >
                          <option value="">Select carpenter</option>
                          {teamMembers.carpenters.map(c => (
                            <option key={c.id} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        {formData.carpenters.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeCarpenter(index)}
                            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addCarpenter}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Carpenter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Document Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Document Upload
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Project Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Camera className="w-4 h-4 inline mr-1" />
                    Project Image
                  </label>
                  <input
                    type="file"
                    name="projectImage"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                </div>

                {/* Rough Quotation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <File className="w-4 h-4 inline mr-1" />
                    Rough Quotation
                  </label>
                  <input
                    type="file"
                    name="roughQuotation"
                    onChange={handleInputChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                  />
                </div>

                {/* Final Quotation - Only show if design PDF exists */}
                {hasDesignPdf && (
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <File className="w-4 h-4 inline mr-1" />
                      Final Quotation
                      <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                        (Available - Design PDF uploaded)
                      </span>
                    </label>
                    <input
                      type="file"
                      name="finalQuotation"
                      onChange={handleInputChange}
                      accept=".pdf,.doc,.docx"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>
                )}

                {/* Message when final quotation not available */}
                {!hasDesignPdf && (
                  <div className="sm:col-span-2">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <File className="w-4 h-4 inline mr-1" />
                        Final Quotation upload will be available after design PDF is uploaded by admin.
                      </p>
                    </div>
                  </div>
                )}

                {/* Show existing documents */}
                {currentView === 'edit' && selectedProject?.documents && (
                  <div className="sm:col-span-2">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Existing Documents</h3>
                    <div className="space-y-2">
                      {selectedProject.documents.roughQuotation && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedProject.documents.roughQuotation.filename}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({selectedProject.documents.roughQuotation.uploadDate})
                          </span>
                        </div>
                      )}
                      {selectedProject.documents.designPdf && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedProject.documents.designPdf.filename}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({selectedProject.documents.designPdf.uploadDate})
                          </span>
                        </div>
                      )}
                      {selectedProject.documents.finalQuotation && (
                        <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <File className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedProject.documents.finalQuotation.filename}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({selectedProject.documents.finalQuotation.uploadDate})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={navigateToList}
              className="w-full sm:w-auto px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {currentView === 'edit' ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;

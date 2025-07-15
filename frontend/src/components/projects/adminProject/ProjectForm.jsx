"use client";
import { useRef } from "react";
import {
  X, User, Calendar, Tag, Download, Phone, Mail, MapPin, 
  IndianRupee, FileText, Users, Briefcase, Eye, Upload
} from 'lucide-react';

export const ProjectForm = ({
  formData,
  setFormData,
  handleSubmit,
  resetForm,
  designers,
  salespersons,
  statuses,
  isEdit,
}) => {
  const imageInputRef = useRef(null);

  // File Upload Handler
  const handleFileUpload = (event, field) => {
    const file = event.target.files[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setFormData({ ...formData, [field]: { name: file.name, url: fileURL } });
    }
  };

  // Upload Card Component
  const UploadCard = ({ icon, title, description, accept, field, required }) => (
    <div className="group transition">
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-all p-4">
        <div className="text-center mb-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            {icon}
          </div>
          <p className="text-sm font-medium text-gray-700">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <input
          type="file"
          accept={accept}
          ref={field === 'image' ? imageInputRef : null}
          onChange={(e) => handleFileUpload(e, field)}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
          required={required}
        />
        {formData[field] && (
          <div className="mt-2 flex items-center gap-2">
            {field === 'image' ? (
              <img src={formData[field].url} alt="Preview" className="w-20 h-20 object-cover rounded" />
            ) : (
              <div className="flex items-center gap-2">
                <Download className="text-green-600" size={16} />
                <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                  {formData[field].name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // Check if project has design uploaded
  const hasDesignUploaded = isEdit && (formData.design || formData.designFile);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-5 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEdit ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button onClick={resetForm} className="hover:text-gray-300 transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-10">
          {/* Project Details */}
          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <Briefcase className="text-blue-600" size={22} /> Project Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Project Name *', name: 'name', type: 'text', placeholder: 'Enter project name' },
                { label: 'Category *', name: 'category', type: 'select', options: ['Modular Kitchen', 'Inplace Furniture'] },
                { label: 'Estimated Budget *', name: 'estimatedBudget', type: 'text', placeholder: '₹0,00,000' },
                { label: 'Final Quotation', name: 'finalQuotation', type: 'text', placeholder: '₹0,00,000' },
                { label: 'Status', name: 'status', type: 'select', options: statuses },
                { label: 'Designer *', name: 'designer', type: 'select', options: designers, placeholder: 'Select Designer' },
                { label: 'Salesperson *', name: 'salesperson', type: 'select', options: salespersons, placeholder: 'Select Salesperson' },
                { label: 'Project Type', name: 'projectType', type: 'select', options: ['Residential', 'Commercial'] },
                { label: 'Starting Date *', name: 'startingDate', type: 'date' },
                { label: 'Location *', name: 'location', type: 'text', placeholder: 'City, State' },
              ].map(({ label, name, type, options, placeholder }, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {type === 'select' ? (
                    <select
                      value={formData[name]}
                      onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required={label.includes('*')}
                    >
                      {placeholder && <option value="">{placeholder}</option>}
                      {options.map(opt => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      value={formData[name]}
                      onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={placeholder}
                      required={label.includes('*')}
                    />
                  )}
                </div>
              ))}

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Project description..."
                  required
                />
              </div>

              {/* File Upload Section */}
              <div className="md:col-span-2">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-200 space-y-6">
                  <h4 className="text-lg font-semibold text-indigo-900 flex items-center gap-2">
                    <FileText className="text-indigo-600" size={20} /> Document Uploads
                  </h4>

                  <div className={`grid grid-cols-1 gap-6 ${hasDesignUploaded ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
                    {/* Project Image */}
                    <UploadCard
                      icon={<Eye className="text-indigo-600" size={24} />}
                      title="Project Image"
                      description="JPG, PNG, GIF up to 10MB"
                      accept="image/*"
                      field="image"
                    />

                    {/* Rough Quotation */}
                    <UploadCard
                      icon={<FileText className="text-green-600" size={24} />}
                      title={`Rough Quotation ${!isEdit ? '*' : ''}`}
                      description="PDF files only"
                      accept=".pdf"
                      field="roughQuotation"
                      required={!isEdit}
                    />

                    {/* Final Quotation - only show when editing and design is uploaded */}
                    {hasDesignUploaded && (
                      <UploadCard
                        icon={<Download className="text-blue-600" size={24} />}
                        title="Final Quotation"
                        description="PDF files only"
                        accept=".pdf"
                        field="finalQuotationFile"
                      />
                    )}
                  </div>

                  {/* Status message for final quotation */}
                  {hasDesignUploaded && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <div className="flex items-center gap-2">
                        <FileText className="text-blue-600" size={16} />
                        <p className="text-sm font-medium text-blue-800">
                          Design uploaded - Final quotation can now be uploaded
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                    Files will be uploaded when you {isEdit ? 'update' : 'create'} the project
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
              <User className="text-green-600" size={22} /> Customer Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Customer Name *', name: 'name', type: 'text', placeholder: 'Customer name' },
                { label: 'Phone Number *', name: 'phone', type: 'tel', placeholder: '+91 XXXXX XXXXX' },
                { label: 'Email Address *', name: 'email', type: 'email', placeholder: 'customer@email.com' },
                { label: 'Address', name: 'address', type: 'text', placeholder: 'Complete address' },
              ].map(({ label, name, type, placeholder }, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={formData.customer[name]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer: { ...formData.customer, [name]: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder={placeholder}
                    required={label.includes('*')}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              onClick={handleSubmit}
              className="w-full sm:w-auto flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
            >
              {isEdit ? 'Update Project' : 'Create Project'}
            </button>
            <button
              onClick={resetForm}
              className="w-full sm:w-auto flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl transition duration-200 font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
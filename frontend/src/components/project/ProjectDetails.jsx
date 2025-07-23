"use client";

import React from "react";
import { 
  ArrowLeft, Edit3, Calendar, MapPin, DollarSign, 
  User, Phone, Mail, FileText, Users, Download, Camera 
} from "lucide-react";

const ProjectDetails = ({ selectedProject, navigateToList, navigateToEdit, handleDownloadDocument }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-800",
      },
      uploaded: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300", 
        border: "border-blue-200 dark:border-blue-800",
      },
      finalize: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-200 dark:border-green-800",
      },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const InfoCard = ({ icon, title, children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoItem = ({ label, value, icon }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
        {icon && icon}
        {label}
      </div>
      <div className="text-sm sm:text-right text-gray-900 dark:text-white font-medium">
        {value}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <button
                  onClick={navigateToList}
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Projects</span>
                </button>
                
                <div className="flex items-center gap-4">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.name}
                    className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProject.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedProject.category}
                      </span>
                      {getStatusBadge(selectedProject.designStatus)}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={navigateToEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Project</span>
              </button>
            </div>
            
            {selectedProject.description && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedProject.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget & Timeline */}
            <InfoCard icon={<DollarSign className="w-5 h-5" />} title="Budget & Timeline">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Estimated Budget
                  </div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-200">
                    ₹{selectedProject.estimatedBudget?.toLocaleString()}
                  </div>
                </div>
                
                {selectedProject.finalBudget && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                      Final Budget
                    </div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-200">
                      ₹{selectedProject.finalBudget.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <InfoItem
                  label="Starting Date"
                  value={new Date(selectedProject.startingDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoItem
                  label="Location"
                  value={selectedProject.location}
                  icon={<MapPin className="w-4 h-4" />}
                />
                <InfoItem
                  label="Category"
                  value={selectedProject.category}
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>
            </InfoCard>

            {/* Customer Information */}
            <InfoCard icon={<User className="w-5 h-5" />} title="Customer Information">
              <div className="space-y-2">
                <InfoItem
                  label="Customer Name"
                  value={selectedProject.customerName}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Phone Number"
                  value={selectedProject.customerNumber}
                  icon={<Phone className="w-4 h-4" />}
                />
                {selectedProject.customerEmail && (
                  <InfoItem
                    label="Email"
                    value={selectedProject.customerEmail}
                    icon={<Mail className="w-4 h-4" />}
                  />
                )}
                {selectedProject.customerAddress && (
                  <InfoItem
                    label="Address"
                    value={selectedProject.customerAddress}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                )}
              </div>
            </InfoCard>

            {/* Team Information */}
            <InfoCard icon={<Users className="w-5 h-5" />} title="Team Information">
              <div className="space-y-2">
                <InfoItem
                  label="Salesperson"
                  value={selectedProject.salesperson}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Designer"
                  value={selectedProject.designer}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Carpenters"
                  value=""
                  icon={<Users className="w-4 h-4" />}
                />
                <div className="pl-6">
                  {selectedProject.carpenter.map((carpenter, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300 py-1">
                      • {carpenter}
                    </div>
                  ))}
                </div>
              </div>
            </InfoCard>
          </div>

          {/* Documents */}
          <div className="lg:col-span-1">
            <InfoCard icon={<FileText className="w-5 h-5" />} title="Documents">
              <div className="space-y-3">
                {/* Only show uploaded documents */}
                {selectedProject.documents?.roughQuotation && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Rough Quotation
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedProject.id,
                          'roughQuotation',
                          selectedProject.documents.roughQuotation.filename
                        )}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.documents.roughQuotation.filename}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {selectedProject.documents.roughQuotation.uploadDate}
                    </div>
                  </div>
                )}

                {selectedProject.documents?.designPdf && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Design PDF
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedProject.id,
                          'designPdf',
                          selectedProject.documents.designPdf.filename
                        )}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.documents.designPdf.filename}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {selectedProject.documents.designPdf.uploadDate}
                    </div>
                  </div>
                )}

                {selectedProject.documents?.finalQuotation && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Final Quotation
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedProject.id,
                          'finalQuotation',
                          selectedProject.documents.finalQuotation.filename
                        )}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.documents.finalQuotation.filename}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {selectedProject.documents.finalQuotation.uploadDate}
                    </div>
                  </div>
                )}

                {/* Show message if no documents */}
                {!selectedProject.documents?.roughQuotation && 
                 !selectedProject.documents?.designPdf && 
                 !selectedProject.documents?.finalQuotation && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No documents uploaded yet</p>
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;

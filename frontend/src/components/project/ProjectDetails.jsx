"use client";
import React from "react";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  MapPin,
  DollarSign,
  User,
  Phone,
  Mail,
  FileText,
  Users,
  Download,
  Camera,
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
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium border ${config.bg} ${config.text} ${config.border}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const InfoCard = ({ icon, title, children, className = "" }) => (
    <div className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 ring-1 ring-black/5 dark:ring-white/10 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={navigateToList}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Projects
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {selectedProject.name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">{selectedProject.category}</p>
            </div>

            <button
              onClick={navigateToEdit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Edit3 className="h-5 w-5" />
              Edit Project
            </button>
          </div>
        </div>

        {/* Project Image and Description */}
        <div className="mb-8">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Project Image */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-600" />
                  Project Image
                </h3>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Project Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Budget and Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 ring-1 ring-green-200 dark:ring-green-800">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">Estimated Budget</span>
            </div>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100">
              ₹{selectedProject.estimatedBudget?.toLocaleString()}
            </p>
          </div>

          {selectedProject.finalBudget && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 ring-1 ring-blue-200 dark:ring-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Final Budget</span>
              </div>
              <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                ₹{selectedProject.finalBudget.toLocaleString()}
              </p>
            </div>
          )}

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 ring-1 ring-purple-200 dark:ring-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Design Status</span>
            </div>
            <div className="mt-3">
              {getStatusBadge(selectedProject.designStatus)}
            </div>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Information */}
          <InfoCard
            icon={<FileText className="h-5 w-5 text-blue-600" />}
            title="Project Information"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Starting Date</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(selectedProject.startingDate).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProject.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProject.category}</p>
                </div>
              </div>
            </div>
          </InfoCard>

          {/* Customer Information */}
          <InfoCard
            icon={<User className="h-5 w-5 text-green-600" />}
            title="Client Details"
          >
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer Name</p>
                <p className="font-medium text-gray-900 dark:text-white">{selectedProject.customerName}</p>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone Number</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    <a href={`tel:${selectedProject.customerNumber}`} className="hover:text-blue-600 transition-colors">
                      {selectedProject.customerNumber}
                    </a>
                  </p>
                </div>
              </div>

              {selectedProject.customerEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      <a href={`mailto:${selectedProject.customerEmail}`} className="hover:text-blue-600 transition-colors">
                        {selectedProject.customerEmail}
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {selectedProject.customerAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white leading-relaxed">{selectedProject.customerAddress}</p>
                  </div>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

        {/* Team Members */}
        <div className="mb-8">
          <InfoCard
            icon={<Users className="h-5 w-5 text-purple-600" />}
            title="Team Members"
            className="lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Salesperson</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedProject.salesperson?.charAt(0)}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProject.salesperson}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Designer</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                    {selectedProject.designer?.charAt(0)}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">{selectedProject.designer}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Carpenters</p>
                <div className="space-y-3">
                  {selectedProject.carpenter?.map((carpenter, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-semibold text-sm">
                        {carpenter?.charAt(0)}
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">{carpenter}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Project Documents */}
        {/* Project Documents */}
        <div className="mb-8">
          <InfoCard
            icon={<Download className="h-5 w-5 text-indigo-600" />}
            title="Project Documents"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedProject.documents.roughQuotation && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Rough Quotation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">PDF file</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(selectedProject.id, 'rough', selectedProject.documents.roughQuotation)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}

              {selectedProject.documents.design && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Design PDF</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">PDF file</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(selectedProject.id, 'design', selectedProject.documents.design)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}

              {selectedProject.documents.finalQuotation && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Final Quotation</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">PDF file</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadDocument(selectedProject.id, 'final', selectedProject.documents.finalQuotation)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <Download className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              )}

              {!selectedProject.documents.roughQuotation && !selectedProject.documents.design && !selectedProject.documents.finalQuotation && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No documents uploaded yet</p>
                </div>
              )}
            </div>
          </InfoCard>
        </div>

      </div>
    </div>
  );
};

export default ProjectDetails;

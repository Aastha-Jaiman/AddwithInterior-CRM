"use client";
import {
    Edit, Trash2, User, Calendar, Tag, Download, Phone, Mail, MapPin, 
    IndianRupee, FileText, Users, Briefcase, Clock, Building, UserCheck, Eye
} from 'lucide-react';

export const ProjectDetail = ({ selectedProject, handleEdit, handleDelete, handleDownload }) => {
    const getStatusColor = (status) => ({
        'Active': 'bg-emerald-500 text-white shadow-emerald-500/25',
        'In Progress': 'bg-amber-500 text-white shadow-amber-500/25',
        'Completed': 'bg-blue-500 text-white shadow-blue-500/25',
        'On Hold': 'bg-gray-500 text-white shadow-gray-500/25'
    }[status] || 'bg-gray-500 text-white shadow-gray-500/25');

    // Detail Item Component
    const DetailItem = ({ icon, label, value }) => (
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
            <div className="p-2 bg-white rounded-lg shadow-sm">
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</p>
                <p className="text-gray-800 font-semibold">{value}</p>
            </div>
        </div>
    );

    // Download Item Component
    const DownloadItem = ({ label, file }) => (
        <div 
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-200 hover:shadow-md group"
            onClick={() => handleDownload(file)}
        >
            <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Download className="text-green-600 size-5" />
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{file?.name || 'No file available'}</p>
            </div>
        </div>
    );

    // Info Card Component
    const InfoCard = ({ title, icon, children, className = "" }) => (
        <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 ${className}`}>
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                        {icon}
                    </div>
                    {title}
                </h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    // Progress Bar Component
    const ProgressBar = ({ percentage, color = "bg-blue-500" }) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
                className={`${color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );

    // Calculate completion percentage
    const completionPercentage = selectedProject.status === 'Completed' ? 100 : 
                               selectedProject.status === 'In Progress' ? 60 : 
                               selectedProject.status === 'Active' ? 30 : 0;

    return (
        <div className="max-w-7xl mx-auto">
            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
                <div className="relative">
                    <div className="md:flex">
                        {/* Project Image */}
                        <div className="md:w-2/5 relative">
                            <img
                                src={selectedProject.image?.url || '/api/placeholder/600/400'}
                                alt={selectedProject.name}
                                className="w-full h-80 md:h-96 object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(selectedProject.status)} shadow-lg`}>
                                    {selectedProject.status}
                                </span>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="md:w-3/5 p-8">
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedProject.name}</h1>
                                    <p className="text-gray-600 mb-6">{selectedProject.description}</p>
                                    
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <IndianRupee className="text-blue-600 size-5" />
                                                <span className="text-sm font-medium text-blue-800">Estimated Budget</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {selectedProject.estimatedBudget || 'TBD'}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <IndianRupee className="text-green-600 size-5" />
                                                <span className="text-sm font-medium text-green-800">Final Quotation</span>
                                            </div>
                                            <p className="text-2xl font-bold text-green-900">
                                                {selectedProject.finalQuotation || 'Pending'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Progress */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-medium text-gray-700">Project Progress</span>
                                            <span className="text-sm font-bold text-gray-900">{completionPercentage}%</span>
                                        </div>
                                        <ProgressBar percentage={completionPercentage} />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(selectedProject)}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <Edit size={18} />
                                        Edit Project
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedProject.id)}
                                        className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <Trash2 size={18} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Project Details */}
                    <InfoCard title="Project Information" icon={<Briefcase className="text-blue-600" size={20} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DetailItem 
                                icon={<Tag className="text-purple-600" size={18} />} 
                                label="Category" 
                                value={selectedProject.category}
                            />
                            <DetailItem 
                                icon={<Building className="text-orange-600" size={18} />} 
                                label="Project Type" 
                                value={selectedProject.projectType}
                            />
                            <DetailItem 
                                icon={<Calendar className="text-green-600" size={18} />} 
                                label="Starting Date" 
                                value={selectedProject.startingDate}
                            />
                            <DetailItem 
                                icon={<MapPin className="text-red-600" size={18} />} 
                                label="Location" 
                                value={selectedProject.location}
                            />
                            <DetailItem 
                                icon={<User className="text-indigo-600" size={18} />} 
                                label="Designer" 
                                value={selectedProject.designer}
                            />
                            <DetailItem 
                                icon={<User className="text-purple-600" size={18} />} 
                                label="Salesperson" 
                                value={selectedProject.salesperson}
                            />
                        </div>
                    </InfoCard>

                    {/* Documents Section */}
                    <InfoCard title="Project Documents" icon={<FileText className="text-purple-600" size={20} />}>
                        <div className="space-y-3">
                            {selectedProject.roughQuotation && (
                                <DownloadItem label="Rough Quotation" file={selectedProject.roughQuotation} />
                            )}
                            {selectedProject.finalQuotationFile && (
                                <DownloadItem label="Final Quotation" file={selectedProject.finalQuotationFile} />
                            )}
                        </div>
                    </InfoCard>

                    {/* Design Section - Only show if design exists */}
                    {selectedProject.design && (
                        <InfoCard title="Project Design" icon={<Eye className="text-indigo-600" size={20} />}>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Eye className="text-indigo-600" size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-indigo-900">Design Available</h4>
                                            <p className="text-sm text-indigo-700">Project design has been uploaded</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <img 
                                            src={selectedProject.design.url} 
                                            alt="Project Design" 
                                            className="w-24 h-24 object-cover rounded-lg border border-indigo-200"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-indigo-900">Design Preview</p>
                                            <p className="text-xs text-indigo-600 mb-2">{selectedProject.design.name}</p>
                                            <button 
                                                onClick={() => handleDownload(selectedProject.design)}
                                                className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <Download size={14} />
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </InfoCard>
                    )}

                    {/* Project Timeline */}
                    <InfoCard title="Project Timeline" icon={<Clock className="text-indigo-600" size={20} />}>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">Project Started</p>
                                    <p className="text-sm text-gray-600">{selectedProject.startingDate}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded-full ${
                                    selectedProject.status === 'Completed' ? 'bg-green-500' : 
                                    selectedProject.status === 'In Progress' ? 'bg-yellow-500' : 
                                    'bg-gray-300'
                                }`}></div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">Current Status</p>
                                    <p className="text-sm text-gray-600">{selectedProject.status}</p>
                                </div>
                            </div>
                        </div>
                    </InfoCard>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <InfoCard title="Customer Information" icon={<User className="text-blue-600" size={20} />}>
                        <div className="space-y-4">
                            <DetailItem 
                                icon={<User className="text-blue-600" size={18} />} 
                                label="Customer Name" 
                                value={selectedProject.customer?.name}
                            />
                            <DetailItem 
                                icon={<Phone className="text-green-600" size={18} />} 
                                label="Phone" 
                                value={selectedProject.customer?.phone}
                            />
                            <DetailItem 
                                icon={<Mail className="text-purple-600" size={18} />} 
                                label="Email" 
                                value={selectedProject.customer?.email}
                            />
                            {selectedProject.customer?.address && (
                                <DetailItem 
                                    icon={<MapPin className="text-red-600" size={18} />} 
                                    label="Address" 
                                    value={selectedProject.customer.address}
                                />
                            )}
                        </div>
                    </InfoCard>

                    {/* Project Stats */}
                    <InfoCard title="Project Statistics" icon={<FileText className="text-gray-600" size={20} />}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Days Active</span>
                                <span className="font-semibold text-gray-900">
                                    {selectedProject.startingDate ? 
                                        Math.ceil((new Date() - new Date(selectedProject.startingDate)) / (1000 * 60 * 60 * 24)) : 
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Project Phase</span>
                                <span className="font-semibold text-gray-900">
                                    {selectedProject.status === 'Completed' ? 'Completed' : 
                                     selectedProject.status === 'In Progress' ? 'Execution' : 
                                     selectedProject.status === 'Active' ? 'Planning' : 'On Hold'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Category</span>
                                <span className="font-semibold text-gray-900">
                                    {selectedProject.category}
                                </span>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};
import React, { useState } from 'react';
import {
    User, Calendar, Tag, Download, Phone, Mail, MapPin, 
    IndianRupee, FileText, Briefcase, Clock, Building, 
    Eye, Upload, Check, X, CheckCircle, Upload as UploadIcon
} from 'lucide-react';

const ProjectDetails = ({ project, onBack, onProjectUpdate }) => {
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);

    // Get status colors
    const getStatusColor = (status) => ({
        'Active': 'bg-emerald-500 text-white',
        'In Progress': 'bg-amber-500 text-white',
        'Completed': 'bg-blue-500 text-white',
        'On Hold': 'bg-gray-500 text-white'
    }[status] || 'bg-gray-500 text-white');

    const getDesignStatusColor = (status) => ({
        'pending': 'bg-gray-100 text-gray-800',
        'uploaded': 'bg-blue-100 text-blue-800',
        'finalized': 'bg-green-100 text-green-800'
    }[status] || 'bg-gray-100 text-gray-800');

    const getDesignStatusText = (status) => ({
        'pending': 'Design Pending',
        'uploaded': 'Design Uploaded',
        'finalized': 'Design Finalized'
    }[status] || 'Design Pending');

    // Handle design upload
    const handleUploadDesign = () => {
        setIsUploadModalOpen(true);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'application/pdf') {
            setUploadFile(file);
        } else {
            alert('Please select a PDF file only');
        }
    };

    const confirmUpload = () => {
        if (!uploadFile) return;

        const newVersion = (project.designHistory?.length || 0) + 1;
        const newDesign = {
            url: URL.createObjectURL(uploadFile),
            name: uploadFile.name,
            uploadDate: new Date().toISOString().split('T')[0]
        };

        const updatedProject = {
            ...project,
            design: newDesign,
            designStatus: 'uploaded',
            designHistory: [
                ...(project.designHistory || []),
                { version: newVersion, name: uploadFile.name, uploadDate: new Date().toISOString().split('T')[0] }
            ]
        };

        onProjectUpdate(updatedProject);
        setIsUploadModalOpen(false);
        setUploadFile(null);
    };

    // Handle design finalization
    const handleFinalizeDesign = () => {
        if (!project.design) return;

        const updatedProject = {
            ...project,
            designStatus: 'finalized'
        };

        onProjectUpdate(updatedProject);
    };

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

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
                ← Back to Projects
            </button>

            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
                <div className="relative">
                    <div className="md:flex">
                        {/* Project Image */}
                        <div className="md:w-2/5 relative">
                            <img
                                src={project.design?.url || '/api/placeholder/600/400'}
                                alt={project.name}
                                className="w-full h-80 md:h-96 object-cover"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(project.status)} shadow-lg`}>
                                    {project.status}
                                </span>
                            </div>
                            <div className="absolute top-4 right-4">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getDesignStatusColor(project.designStatus)} shadow-lg`}>
                                    {getDesignStatusText(project.designStatus)}
                                </span>
                            </div>
                        </div>

                        {/* Project Info */}
                        <div className="md:w-3/5 p-8">
                            <div className="flex flex-col h-full">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
                                    <p className="text-gray-600 mb-6">{project.description}</p>
                                    
                                    {/* Key Metrics */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <IndianRupee className="text-blue-600 size-5" />
                                                <span className="text-sm font-medium text-blue-800">Estimated Budget</span>
                                            </div>
                                            <p className="text-2xl font-bold text-blue-900">
                                                {project.estimatedBudget || 'TBD'}
                                            </p>
                                        </div>
                                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileText className="text-green-600 size-5" />
                                                <span className="text-sm font-medium text-green-800">Design Status</span>
                                            </div>
                                            <p className="text-lg font-bold text-green-900">
                                                {getDesignStatusText(project.designStatus)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Design Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleUploadDesign}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <Upload size={18} />
                                        Upload Design
                                    </button>
                                    
                                    {project.design && project.designStatus !== 'finalized' && (
                                        <button
                                            onClick={handleFinalizeDesign}
                                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                                        >
                                            <Check size={18} />
                                            Finalize Design
                                        </button>
                                    )}
                                    
                                    {project.designStatus === 'finalized' && (
                                        <div className="flex items-center gap-2 px-6 py-3 bg-green-100 text-green-800 rounded-lg">
                                            <CheckCircle size={18} />
                                            Design Finalized
                                        </div>
                                    )}
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
                                value={project.category}
                            />
                            <DetailItem 
                                icon={<Building className="text-orange-600" size={18} />} 
                                label="Project Type" 
                                value={project.projectType}
                            />
                            <DetailItem 
                                icon={<Calendar className="text-green-600" size={18} />} 
                                label="Starting Date" 
                                value={project.startingDate}
                            />
                            <DetailItem 
                                icon={<MapPin className="text-red-600" size={18} />} 
                                label="Location" 
                                value={project.location}
                            />
                            <DetailItem 
                                icon={<User className="text-indigo-600" size={18} />} 
                                label="Designer" 
                                value={project.designer}
                            />
                            <DetailItem 
                                icon={<User className="text-purple-600" size={18} />} 
                                label="Salesperson" 
                                value={project.salesperson}
                            />
                        </div>
                    </InfoCard>

                    {/* Current Design */}
                    {project.design && (
                        <InfoCard title="Current Design" icon={<Eye className="text-indigo-600" size={20} />}>
                            <div className="space-y-4">
                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <FileText className="text-indigo-600" size={18} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-indigo-900">{project.design.name}</h4>
                                            <p className="text-sm text-indigo-700">Uploaded on {project.design.uploadDate}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => window.open(project.design.url, '_blank')}
                                                className="flex items-center gap-1 px-3 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = project.design.url;
                                                    link.download = project.design.name;
                                                    link.click();
                                                }}
                                                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
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

                    {/* Design History */}
                    {project.designHistory && project.designHistory.length > 0 && (
                        <InfoCard title="Design History" icon={<Clock className="text-gray-600" size={20} />}>
                            <div className="space-y-3">
                                {project.designHistory.map((design, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <FileText className="text-gray-600" size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900">Version {design.version}</p>
                                            <p className="text-sm text-gray-600">{design.name}</p>
                                            <p className="text-xs text-gray-500">{design.uploadDate}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </InfoCard>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Customer Information */}
                    <InfoCard title="Customer Information" icon={<User className="text-blue-600" size={20} />}>
                        <div className="space-y-4">
                            <DetailItem 
                                icon={<User className="text-blue-600" size={18} />} 
                                label="Customer Name" 
                                value={project.customer?.name}
                            />
                            <DetailItem 
                                icon={<Phone className="text-green-600" size={18} />} 
                                label="Phone" 
                                value={project.customer?.phone}
                            />
                            <DetailItem 
                                icon={<Mail className="text-purple-600" size={18} />} 
                                label="Email" 
                                value={project.customer?.email}
                            />
                        </div>
                    </InfoCard>

                    {/* Project Stats */}
                    <InfoCard title="Project Statistics" icon={<FileText className="text-gray-600" size={20} />}>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Days Active</span>
                                <span className="font-semibold text-gray-900">
                                    {project.startingDate ? 
                                        Math.ceil((new Date() - new Date(project.startingDate)) / (1000 * 60 * 60 * 24)) : 
                                        'N/A'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Design Versions</span>
                                <span className="font-semibold text-gray-900">
                                    {project.designHistory?.length || 0}
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-600">Category</span>
                                <span className="font-semibold text-gray-900">
                                    {project.category}
                                </span>
                            </div>
                        </div>
                    </InfoCard>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Upload Design</h3>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <UploadIcon className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-600 mb-2">Select PDF file to upload</p>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Choose File
                                </label>
                            </div>
                            
                            {uploadFile && (
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-green-800 font-medium">{uploadFile.name}</p>
                                    <p className="text-green-600 text-sm">Ready to upload</p>
                                </div>
                            )}
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmUpload}
                                    disabled={!uploadFile}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Upload
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectDetails;
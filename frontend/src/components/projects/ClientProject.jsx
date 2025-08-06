// 'use client';
// import React, { useState, useEffect } from 'react';
// import { 
//   Calendar, User, Phone, Mail, MapPin, IndianRupee, FileText, Download, Eye, 
//   Clock, CheckCircle, AlertCircle, Users, Building, Star, ArrowRight, 
//   Briefcase, Target, TrendingUp, Archive, Edit, Plus
// } from 'lucide-react';

// const ProjectDetails = ({ 
//   projectData, 
//   onDesignUpdate, 
//   onDesignFinalize, 
//   onDocumentView, 
//   onDocumentDownload,
//   isLoading = false 
// }) => {
//   const [designStatus, setDesignStatus] = useState(projectData?.designStatus || 'pending');
//   const [activeTab, setActiveTab] = useState('overview');
//   const [designVersions, setDesignVersions] = useState([]);
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Initialize design versions dynamically
//   useEffect(() => {
//     if (projectData?.documents?.designPdf) {
//       setDesignVersions([
//         {
//           version: 1,
//           filename: projectData.documents.designPdf.filename,
//           uploadDate: projectData.documents.designPdf.uploadDate,
//           status: 'current'
//         }
//       ]);
//     }
//   }, [projectData]);

//   const handleDesignAction = async (action) => {
//     setIsUpdating(true);
//     try {
//       if (action === 'update') {
//         const newVersion = {
//           version: designVersions.length + 1,
//           filename: `design_v${designVersions.length + 1}_${Date.now()}.pdf`,
//           uploadDate: new Date().toISOString().split('T')[0],
//           status: 'pending'
//         };
//         setDesignVersions([...designVersions, newVersion]);
//         setDesignStatus('pending');
        
//         if (onDesignUpdate) {
//           await onDesignUpdate(projectData.id, newVersion);
//         }
//       } else if (action === 'finalize') {
//         setDesignStatus('finalized');
//         if (onDesignFinalize) {
//           await onDesignFinalize(projectData.id);
//         }
//       }
//     } catch (error) {
//       console.error('Error handling design action:', error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const formatCurrency = (amount) => {
//     if (!amount) return '₹0';
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       maximumFractionDigits: 0
//     }).format(amount);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getStatusConfig = (status) => {
//     const configs = {
//       finalized: {
//         icon: <CheckCircle className="w-5 h-5" />,
//         color: 'text-green-700',
//         bg: 'bg-green-50',
//         border: 'border-green-200',
//         text: 'Design Finalized'
//       },
//       pending: {
//         icon: <Clock className="w-5 h-5" />,
//         color: 'text-amber-700',
//         bg: 'bg-amber-50',
//         border: 'border-amber-200',
//         text: 'Update Pending'
//       },
//       default: {
//         icon: <AlertCircle className="w-5 h-5" />,
//         color: 'text-blue-700',
//         bg: 'bg-blue-50',
//         border: 'border-blue-200',
//         text: 'Awaiting Review'
//       }
//     };
//     return configs[status] || configs.default;
//   };

//   const statusConfig = getStatusConfig(designStatus);

//   const tabs = [
//     { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
//     { id: 'team', label: 'Team', icon: <Users className="w-4 h-4" /> },
//     { id: 'documents', label: 'Documents', icon: <FileText className="w-4 h-4" /> },
//     { id: 'design', label: 'Design', icon: <Star className="w-4 h-4" /> }
//   ];

//   // Loading state
//   if (isLoading || !projectData) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading project details...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
//       <div className="max-w-7xl mx-auto">
        
//         {/* Clean Header */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
//           <div className="p-6 sm:p-8">
//             <div className="flex flex-col lg:flex-row items-center gap-6">
              
//               {/* Project Image */}
//               <div className="flex-shrink-0">
//                 <img 
//                   src={projectData.image || '/placeholder-image.jpg'} 
//                   alt={projectData.name || 'Project'}
//                   className="w-full max-w-sm sm:w-48 sm:h-36 lg:w-56 lg:h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
//                 />
//               </div>
              
//               {/* Project Info */}
//               <div className="flex-grow text-center lg:text-left">
//                 <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
//                   {projectData.name || 'Untitled Project'}
//                 </h1>
//                 <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3 mb-4">
//                   <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full">
//                     <Building className="w-4 h-4 mr-2" />
//                     {projectData.category || 'General'}
//                   </span>
//                   <div className="flex items-center gap-2 text-gray-600 bg-gray-100 px-3 py-2 rounded-full">
//                     <Calendar className="w-4 h-4" />
//                     <span className="text-sm font-medium">
//                       Started: {formatDate(projectData.startingDate)}
//                     </span>
//                   </div>
//                 </div>
                
//                 {/* Status */}
//                 <div className="flex justify-center lg:justify-start">
//                   <div className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.border} border rounded-full`}>
//                     <div className={statusConfig.color}>
//                       {statusConfig.icon}
//                     </div>
//                     <span className={`font-medium ${statusConfig.color}`}>
//                       {statusConfig.text}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//           {/* Project Description */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-orange-100 rounded-lg">
//                     <Briefcase className="w-5 h-5 text-orange-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">Description</h3>
//                 </div>
//                 <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                   <p className="text-gray-700 leading-relaxed">
//                     {projectData.description || 'No description provided.'}
//                   </p>
//                 </div>
//               </div>

//         {/* Navigation Tabs */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
//           <div className="flex overflow-x-auto">
//             {tabs.map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`flex-1 min-w-0 flex items-center justify-center gap-2 px-4 py-4 font-medium transition-colors ${
//                   activeTab === tab.id
//                     ? 'bg-blue-600 text-white border-b-2 border-blue-600'
//                     : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
//                 }`}
//               >
//                 {tab.icon}
//                 <span className="hidden sm:inline">{tab.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="space-y-6">

//           {/* Overview Tab */}
//           {activeTab === 'overview' && (
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
//               {/* Customer Information */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-purple-100 rounded-lg">
//                     <User className="w-5 h-5 text-purple-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">Customer Details</h3>
//                 </div>
//                 <div className="space-y-3">
//                   {[
//                     { icon: <User className="w-4 h-4" />, label: projectData.customerName, sublabel: 'Name' },
//                     { icon: <Phone className="w-4 h-4" />, label: projectData.customerNumber, sublabel: 'Phone' },
//                     { icon: <Mail className="w-4 h-4" />, label: projectData.customerEmail, sublabel: 'Email' },
//                     { icon: <MapPin className="w-4 h-4" />, label: projectData.customerAddress, sublabel: 'Address' }
//                   ].filter(item => item.label).map((item, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//                       <div className="text-gray-500 mt-0.5">
//                         {item.icon}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium text-gray-900 break-words">{item.label}</p>
//                         <p className="text-xs text-gray-500">{item.sublabel}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Budget Information */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="p-2 bg-green-100 rounded-lg">
//                     <IndianRupee className="w-5 h-5 text-green-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">Budget Overview</h3>
//                 </div>
//                 <div className="space-y-4">
//                   <div className="bg-green-50 rounded-lg p-4 border border-green-200">
//                     <p className="text-xs text-green-600 mb-1">Estimated Budget</p>
//                     <p className="text-2xl font-bold text-green-700">
//                       {formatCurrency(projectData.estimatedBudget)}
//                     </p>
//                   </div>
//                   <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                     <p className="text-xs text-blue-600 mb-1">Final Budget</p>
//                     <p className="text-2xl font-bold text-blue-700">
//                       {formatCurrency(projectData.finalBudget)}
//                     </p>
//                   </div>
//                   {projectData.estimatedBudget && projectData.finalBudget && (
//                     <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-600">Variance:</span>
//                         <span className={`font-medium ${
//                           (projectData.finalBudget - projectData.estimatedBudget) >= 0 
//                             ? 'text-red-600' : 'text-green-600'
//                         }`}>
//                           {formatCurrency(Math.abs(projectData.finalBudget - projectData.estimatedBudget))}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>

              
//             </div>
//           )}

//           {/* Team Tab */}
//           {activeTab === 'team' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[
//                 { role: 'Designer', name: projectData.designer, color: 'purple', icon: <Star className="w-5 h-5" /> },
//                 { role: 'Salesperson', name: projectData.salesperson, color: 'green', icon: <Target className="w-5 h-5" /> },
//                 { role: 'Location', name: projectData.location, color: 'blue', icon: <MapPin className="w-5 h-5" /> }
//               ].filter(member => member.name).map((member, index) => (
//                 <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className={`p-2 bg-${member.color}-100 rounded-lg`}>
//                       <div className={`text-${member.color}-600`}>
//                         {member.icon}
//                       </div>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{member.role}</h3>
//                       <p className="text-xs text-gray-500">Team Member</p>
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                     <p className="font-medium text-gray-900">
//                       {Array.isArray(member.name) ? member.name.join(', ') : member.name}
//                     </p>
//                   </div>
//                 </div>
//               ))}
              
//               {/* Carpenters - Special handling for array */}
//               {projectData.carpenter && projectData.carpenter.length > 0 && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="p-2 bg-indigo-100 rounded-lg">
//                       <Users className="w-5 h-5 text-indigo-600" />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">Carpenters</h3>
//                       <p className="text-xs text-gray-500">Team Members</p>
//                     </div>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                     <p className="font-medium text-gray-900">
//                       {projectData.carpenter.join(', ')}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* Documents Tab */}
//           {activeTab === 'documents' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {projectData.documents && Object.entries(projectData.documents).map(([key, doc], index) => {
//                 const colors = ['red', 'green', 'blue'];
//                 const colorClass = colors[index % colors.length];
                
//                 return (
//                   <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                     <div className="flex items-center gap-3 mb-4">
//                       <div className={`p-2 bg-${colorClass}-100 rounded-lg`}>
//                         <FileText className={`w-5 h-5 text-${colorClass}-600`} />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900 capitalize">
//                           {key.replace(/([A-Z])/g, ' $1').trim()}
//                         </h3>
//                         <p className="text-xs text-gray-500">
//                           {formatDate(doc.uploadDate)}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-3">
//                       <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                         <p className="text-xs text-gray-600 truncate">{doc.filename}</p>
//                       </div>
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => onDocumentView && onDocumentView(key, doc)}
//                           className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
//                         >
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                         <button 
//                           onClick={() => onDocumentDownload && onDocumentDownload(key, doc)}
//                           className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                           <Download className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Design Tab */}
//           {activeTab === 'design' && (
//             <div className="space-y-6">
//               {/* Design Versions */}
//               <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
//                     <Archive className="w-5 h-5 text-blue-600" />
//                     Design Versions
//                   </h3>
//                   <span className="text-sm text-gray-500">
//                     {designVersions.length} version{designVersions.length !== 1 ? 's' : ''}
//                   </span>
//                 </div>
//                 <div className="space-y-3">
//                   {designVersions.map((version, index) => (
//                     <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                       <div className="flex items-center gap-3 flex-grow">
//                         <div className="p-2 bg-blue-100 rounded-lg">
//                           <FileText className="w-5 h-5 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-900">Version {version.version}</p>
//                           <p className="text-sm text-gray-500">
//                             Uploaded: {formatDate(version.uploadDate)}
//                           </p>
//                         </div>
//                         {version.status === 'current' && (
//                           <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
//                             Current
//                           </span>
//                         )}
//                         {version.status === 'pending' && (
//                           <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
//                             Pending
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex gap-2">
//                         <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
//                           <Eye className="w-4 h-4" />
//                           View
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
//                           <Download className="w-4 h-4" />
//                           Download
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Design Actions */}
//               {designStatus !== 'finalized' && (
//                 <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Design Actions</h3>
//                   <div className="flex flex-col sm:flex-row gap-4">
//                     <button
//                       onClick={() => handleDesignAction('update')}
//                       disabled={designStatus === 'pending' || isUpdating}
//                       className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
//                         designStatus === 'pending' || isUpdating
//                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
//                           : 'bg-orange-600 text-white hover:bg-orange-700'
//                       }`}
//                     >
//                       {isUpdating ? (
//                         <>
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                           Processing...
//                         </>
//                       ) : (
//                         <>
//                           <Edit className="w-4 h-4" />
//                           {designStatus === 'pending' ? 'Update Requested' : 'Request Update'}
//                         </>
//                       )}
//                     </button>
//                     <button
//                       onClick={() => handleDesignAction('finalize')}
//                       disabled={isUpdating}
//                       className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                       Finalize Design
//                     </button>
//                   </div>
//                 </div>
//               )}
              
//               {designStatus === 'finalized' && (
//                 <div className="bg-green-50 border border-green-200 rounded-xl p-6">
//                   <div className="flex items-center justify-center gap-3">
//                     <CheckCircle className="w-6 h-6 text-green-600" />
//                     <span className="text-green-800 font-semibold text-lg">
//                       Design has been successfully finalized!
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectDetails;


import React from 'react'

const ClientProject = () => {
  return (
    <div>
      Client Projects
    </div>
  )
}

export default ClientProject

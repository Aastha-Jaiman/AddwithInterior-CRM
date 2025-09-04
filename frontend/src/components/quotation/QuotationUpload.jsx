// "use client"
// import React, { useState } from 'react';
// import { ChevronDown, Users, FolderOpen, Calculator, Package, Wrench, Settings, CheckCircle, FileText } from 'lucide-react';
// import FinalQuotationUpload from './FinalQuotationUpload';
// import ModularKitchenQuotation from './ModularKitchenQuotation';
// import InplaceFurnitureQuotation from './InplaceFurnitureQuotation';

// const QuotationUpload = () => {
//   const [selectedClient, setSelectedClient] = useState('');
//   const [selectedProject, setSelectedProject] = useState('');
//   const [category, setCategory] = useState('');
//   const [showQuotationForm, setShowQuotationForm] = useState(false);
//   const [showFinalQuotation, setShowFinalQuotation] = useState(false);
//   const [savedQuotations, setSavedQuotations] = useState([]);

//   // Sample data
//   const clients = [
//     { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com' },
//     { id: 2, name: 'Priya Singh', email: 'priya@example.com' },
//     { id: 3, name: 'Amit Kumar', email: 'amit@example.com' }
//   ];

//   const projects = {
//     1: [
//       { id: 1, name: 'Living Room Design', category: 'inplace-furniture', status: 'Active' },
//       { id: 2, name: 'Kitchen Renovation', category: 'modular-kitchen', status: 'Active' }
//     ],
//     2: [
//       { id: 3, name: 'Bedroom Setup', category: 'inplace-furniture', status: 'Active' },
//       { id: 4, name: 'Modern Kitchen', category: 'modular-kitchen', status: 'Active' }
//     ],
//     3: [
//       { id: 5, name: 'Office Interior', category: 'inplace-furniture', status: 'Active' }
//     ]
//   };

//   const handleProjectSelect = (projectId) => {
//     const project = Object.values(projects).flat().find(p => p.id === parseInt(projectId));
//     if (project) {
//       setSelectedProject(projectId);
//       setCategory(project.category);
//     }
//   };

//   const handleProceed = () => {
//     if (!selectedClient || !selectedProject) {
//       alert('Please select both client and project');
//       return;
//     }
//     setShowQuotationForm(true);
//   };

//   const handleBack = () => {
//     setShowQuotationForm(false);
//     setShowFinalQuotation(false);
//   };

//   const handleQuotationSaved = (quotationData) => {
//     const newQuotation = {
//       id: Date.now(),
//       clientName: getSelectedClientName(),
//       projectName: getSelectedProjectName(),
//       projectId: selectedProject,
//       category,
//       data: quotationData,
//       createdAt: new Date().toLocaleDateString(),
//       status: 'Rough',
//       type: 'rough'
//     };
//     setSavedQuotations([...savedQuotations, newQuotation]);
//     setShowQuotationForm(false);
//   };

//   const handleCreateFinalQuotation = () => {
//     setShowFinalQuotation(true);
//   };

// const handleFinalQuotationUploaded = (finalQuotationData) => {
//   const newFinalQuotation = {
//     id: Date.now(),
//     clientName: getSelectedClientName(),
//     projectName: getSelectedProjectName(),
//     projectId: selectedProject,
//     category,
//     fileName: finalQuotationData.fileName,
//     fileSize: finalQuotationData.fileSize,
//     createdAt: new Date().toLocaleDateString(),
//     status: 'Final',
//     type: 'final'
//   };
//   setSavedQuotations([...savedQuotations, newFinalQuotation]);
//   setShowFinalQuotation(false);
  
//   // Force re-render to show updated table
//   console.log('Final quotation uploaded:', newFinalQuotation);
// };


//   const getSelectedClientName = () => {
//     const client = clients.find(c => c.id === parseInt(selectedClient));
//     return client ? client.name : '';
//   };

//   const getSelectedProjectName = () => {
//     const project = Object.values(projects).flat().find(p => p.id === parseInt(selectedProject));
//     return project ? project.name : '';
//   };

//   // Check if rough quotation exists for selected project
//   const hasRoughQuotationForProject = () => {
//     if (!selectedClient || !selectedProject) return false;
//     return savedQuotations.some(q => 
//       q.clientName === getSelectedClientName() && 
//       q.projectId === selectedProject && 
//       q.type === 'rough'
//     );
//   };

//   // Check if final quotation already exists for selected project
//   const hasFinalQuotationForProject = () => {
//     if (!selectedClient || !selectedProject) return false;
//     return savedQuotations.some(q => 
//       q.clientName === getSelectedClientName() && 
//       q.projectId === selectedProject && 
//       q.type === 'final'
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white shadow-lg border-b rounded-b-xl">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-4">
//               <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
//                 <Calculator className="h-7 w-7" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-slate-800">Quotation Management System</h1>
//                 <p className="text-sm text-slate-600">Professional quotation creation and management</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-slate-700">Admin Dashboard</p>
//                 <p className="text-xs text-slate-500">Manage quotations efficiently</p>
//               </div>
//               <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold rounded-xl shadow-lg">
//                 A
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Selection Form - Only show when not in form or final quotation mode */}
//       {!showQuotationForm && !showFinalQuotation && (
//         <div className="bg-white shadow-lg border-b relative z-40 rounded-b-xl mx-4 mt-4">
//           <div className="max-w-7xl mx-auto px-6 py-6">
//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//               {/* Client Selection */}
//               <div className="space-y-3">
//                 <label className="flex items-center text-sm font-semibold text-slate-700">
//                   <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white mr-3 rounded-lg">
//                     <Users className="h-4 w-4" />
//                   </div>
//                   Select Client
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedClient}
//                     onChange={(e) => setSelectedClient(e.target.value)}
//                     className="w-full p-4 border-2 border-slate-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white appearance-none text-slate-700 font-medium rounded-xl shadow-sm transition-all"
//                   >
//                     <option value="">Choose Client</option>
//                     {clients.map(client => (
//                       <option key={client.id} value={client.id}>{client.name}</option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 </div>
//               </div>

//               {/* Project Selection */}
//               <div className="space-y-3">
//                 <label className="flex items-center text-sm font-semibold text-slate-700">
//                   <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 rounded-lg">
//                     <FolderOpen className="h-4 w-4" />
//                   </div>
//                   Select Project
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedProject}
//                     onChange={(e) => handleProjectSelect(e.target.value)}
//                     disabled={!selectedClient}
//                     className="w-full p-4 border-2 border-slate-200 focus:ring-4 focus:ring-green-200 focus:border-green-400 bg-white appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 font-medium rounded-xl shadow-sm transition-all"
//                   >
//                     <option value="">Choose Project</option>
//                     {selectedClient && projects[selectedClient]?.map(project => (
//                       <option key={project.id} value={project.id}>{project.name}</option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
//                 </div>
//               </div>

//               {/* Category Display */}
//               <div className="space-y-3">
//                 <label className="flex items-center text-sm font-semibold text-slate-700">
//                   <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white mr-3 rounded-lg">
//                     <Settings className="h-4 w-4" />
//                   </div>
//                   Category
//                 </label>
//                 <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 min-h-[56px] flex items-center rounded-xl">
//                   {category ? (
//                     <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm ${
//                       category === 'modular-kitchen' 
//                         ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' 
//                         : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
//                     }`}>
//                       {category === 'modular-kitchen' ? (
//                         <>
//                           <Wrench className="h-4 w-4 mr-2" />
//                           Modular Kitchen
//                         </>
//                       ) : (
//                         <>
//                           <Package className="h-4 w-4 mr-2" />
//                           Inplace Furniture
//                         </>
//                       )}
//                     </span>
//                   ) : (
//                     <span className="text-slate-400 text-sm font-medium">Select project first</span>
//                   )}
//                 </div>
//               </div>

//               {/* Action Button */}
//               <div className="space-y-3">
//                 <label className="text-sm font-semibold text-slate-700 block">Action</label>
//                 <button
//                   onClick={handleProceed}
//                   disabled={!selectedClient || !selectedProject}
//                   className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 font-semibold rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100"
//                 >
//                   <Calculator className="h-5 w-5" />
//                   <span>Create Quotation</span>
//                 </button>
//               </div>
//             </div>

//             {/* Selected Info Bar */}
//             {(selectedClient || selectedProject) && (
//               <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-6 text-sm">
//                     {selectedClient && (
//                       <div className="flex items-center text-blue-700 font-medium">
//                         <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white mr-3 rounded-lg">
//                           <Users className="h-4 w-4" />
//                         </div>
//                         <span className="font-semibold">Client:</span>
//                         <span className="ml-2">{getSelectedClientName()}</span>
//                       </div>
//                     )}
//                     {selectedProject && (
//                       <div className="flex items-center text-blue-700 font-medium">
//                         <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 rounded-lg">
//                           <FolderOpen className="h-4 w-4" />
//                         </div>
//                         <span className="font-semibold">Project:</span>
//                         <span className="ml-2">{getSelectedProjectName()}</span>
//                       </div>
//                     )}
//                   </div>
//                   <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg">
//                     <CheckCircle className="h-5 w-5" />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Main Content Area */}
//       <div className="max-w-7xl mx-auto px-6 py-6">
//         {showFinalQuotation ? (
//           <FinalQuotationUpload 
//             onBack={handleBack} 
//             onUpload={handleFinalQuotationUploaded}
//             clientName={getSelectedClientName()} 
//             projectName={getSelectedProjectName()} 
//           />
//         ) : showQuotationForm ? (
//           <div className="space-y-6">
//             {/* Breadcrumb */}
//             <div className="flex items-center space-x-3 text-sm text-slate-600 font-medium bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100">
//               <span>Quotation Management</span>
//               <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-400" />
//               <span>Create Quotation</span>
//               <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-400" />
//               <span className="text-blue-600 font-semibold">
//                 {category === 'modular-kitchen' ? 'Modular Kitchen' : 'Inplace Furniture'}
//               </span>
//             </div>

//             {/* Quotation Form */}
//             {category === 'modular-kitchen' ? (
//               <ModularKitchenQuotation 
//                 onBack={handleBack} 
//                 onSave={handleQuotationSaved}
//                 clientName={getSelectedClientName()} 
//                 projectName={getSelectedProjectName()} 
//               />
//             ) : category === 'inplace-furniture' ? (
//               <InplaceFurnitureQuotation 
//                 onBack={handleBack} 
//                 onSave={handleQuotationSaved}
//                 clientName={getSelectedClientName()} 
//                 projectName={getSelectedProjectName()} 
//               />
//             ) : null}
//           </div>
//         ) : (
//           <div>
//             {/* Saved Quotations List - Only show when client is selected */}
//             {selectedClient && (
//               <div className="mb-8">
//                 <div className="flex items-center justify-between mb-6">
//                   <h2 className="text-2xl font-bold text-slate-800">
//                     Quotations for {getSelectedClientName()}
//                   </h2>
//                   {/* Final quotation button - only show if rough quotation exists and no final quotation yet */}
//                   {hasRoughQuotationForProject() && !hasFinalQuotationForProject() && selectedProject && (
//                     <button
//                       onClick={handleCreateFinalQuotation}
//                       className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 font-semibold rounded-xl shadow-lg transform hover:scale-105"
//                     >
//                       <FileText className="h-5 w-5" />
//                       <span>Create Final Quotation</span>
//                     </button>
//                   )}
//                   {hasFinalQuotationForProject() && selectedProject && (
//                     <button
//                       disabled
//                       className="bg-slate-400 text-white px-6 py-3 cursor-not-allowed flex items-center space-x-2 font-semibold rounded-xl shadow-lg opacity-60"
//                     >
//                       <CheckCircle className="h-5 w-5" />
//                       <span>Final Quotation Uploaded</span>
//                     </button>
//                   )}
//                 </div>

//                 {/* Filter quotations based on selected client */}
//                 {(() => {
//                   const filteredQuotations = savedQuotations.filter(q => q.clientName === getSelectedClientName());

//                   return filteredQuotations.length > 0 ? (
//                     <div className="bg-white border-2 border-slate-200 overflow-hidden rounded-xl shadow-lg">
//                       <div className="overflow-x-auto">
//                         <table className="w-full">
//                           <thead>
//                             <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Type</th>
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Project</th>
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Category</th>
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Created Date</th>
//                               <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Details</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {filteredQuotations.map((quotation) => (
//                               <tr key={quotation.id} className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
//                                 <td className="px-6 py-4">
//                                   <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
//                                     quotation.type === 'final' 
//                                       ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white' 
//                                       : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
//                                   }`}>
//                                     {quotation.type === 'final' ? 'Final' : 'Rough'}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm font-medium text-slate-800">
//                                   {quotation.projectName}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                   <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
//                                     quotation.category === 'modular-kitchen' 
//                                       ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white' 
//                                       : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
//                                   }`}>
//                                     {quotation.category === 'modular-kitchen' ? (
//                                       <>
//                                         <Wrench className="h-3 w-3 mr-2" />
//                                         Modular Kitchen
//                                       </>
//                                     ) : (
//                                       <>
//                                         <Package className="h-3 w-3 mr-2" />
//                                         Inplace Furniture
//                                       </>
//                                     )}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                   <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
//                                     quotation.status === 'Final' 
//                                       ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
//                                       : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
//                                   }`}>
//                                     {quotation.status}
//                                   </span>
//                                 </td>
//                                 <td className="px-6 py-4 text-sm text-slate-600">
//                                   {quotation.createdAt}
//                                 </td>
//                                 <td className="px-6 py-4 text-sm">
//                                   {quotation.type === 'final' ? (
//                                     <div>
//                                       <p className="font-medium text-slate-800">{quotation.fileName}</p>
//                                       <p className="text-xs text-slate-500">{quotation.fileSize} MB</p>
//                                     </div>
//                                   ) : (
//                                     <p className="font-bold text-green-600">
//                                       ₹{quotation.data.grandTotal?.toFixed(2) || '0.00'}
//                                     </p>
//                                   )}
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="bg-white border-2 border-slate-200 p-10 text-center rounded-xl shadow-lg">
//                       <div className="text-slate-500">
//                         <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
//                         <p className="text-xl font-medium">No quotations uploaded yet</p>
//                         <p className="text-sm">
//                           Create first rough quotation for {getSelectedClientName()}
//                         </p>
//                       </div>
//                     </div>
//                   )
//                 })()}
//               </div>
//             )}

//             {/* Default Content - show when no client is selected */}
//             {!selectedClient && (
//               <div className="text-center py-20">
//                 <div className="p-8 bg-white border-2 border-slate-200 max-w-lg mx-auto rounded-xl shadow-lg">
//                   <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white mx-auto w-fit mb-6 rounded-xl shadow-lg">
//                     <Calculator className="h-16 w-16" />
//                   </div>
//                   <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Create Quotation</h3>
//                   <p className="text-slate-500 font-medium text-lg">
//                     Select client from the form above to view and manage quotations
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuotationUpload; 



"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, User, Building, FileText, Calculator, ChevronDown, Edit3 } from 'lucide-react';

const QuotationComponent = () => {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [showChangeProject, setShowChangeProject] = useState(false);

  // Sample data with only 2 categories
  const sampleClients = [
    { _id: '1', email: 'john@example.com', name: 'John Doe', phone: '+91 98765 43210', address: '123 Main St, Mumbai' },
    { _id: '2', email: 'jane@example.com', name: 'Jane Smith', phone: '+91 87654 32109', address: '456 Oak Ave, Delhi' },
    { _id: '3', email: 'mike@example.com', name: 'Mike Johnson', phone: '+91 76543 21098', address: '789 Pine Rd, Bangalore' }
  ];

  const sampleProjects = {
    'john@example.com': [
      { _id: '1', title: 'Modern Kitchen Design', category: 'Modular Kitchen', location: 'Gurgaon', budget: '₹5,00,000' },
      { _id: '2', title: 'Office Furniture Setup', category: 'Inplace Furniture', location: 'Noida', budget: '₹3,50,000' }
    ],
    'jane@example.com': [
      { _id: '3', title: 'Luxury Kitchen', category: 'Modular Kitchen', location: 'Mumbai', budget: '₹8,00,000' }
    ],
    'mike@example.com': [
      { _id: '4', title: 'Home Furniture', category: 'Inplace Furniture', location: 'Pune', budget: '₹4,50,000' },
      { _id: '5', title: 'Restaurant Kitchen', category: 'Modular Kitchen', location: 'Jaipur', budget: '₹12,00,000' }
    ]
  };

  // Category-specific templates
  const categoryTemplates = {
    'Modular Kitchen': [
      { name: 'Base Units', items: ['Base Cabinet', 'Drawer Unit', 'Corner Unit'] },
      { name: 'Wall Units', items: ['Wall Cabinet', 'Open Shelves', 'Glass Unit'] },
      { name: 'Accessories', items: ['Hardware', 'Handles', 'Hinges'] }
    ],
    'Inplace Furniture': [
      { name: 'Living Room', items: ['Sofa Set', 'Coffee Table', 'TV Unit'] },
      { name: 'Bedroom', items: ['Bed', 'Wardrobe', 'Side Table'] },
      { name: 'Office', items: ['Desk', 'Chair', 'Storage'] }
    ]
  };

  useEffect(() => {
    setClients(sampleClients);
  }, []);

  const handleClientSelect = async (client) => {
    setSelectedClient(client);
    setSelectedProject(null);
    setSections([]);
    setShowClientDropdown(false);
    setShowChangeProject(false);
    setLoading(true);

    setTimeout(() => {
      setProjects(sampleProjects[client.email] || []);
      setLoading(false);
    }, 500);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSections([]);
    setShowChangeProject(false);
    // Auto-generate sections based on category
    generateSectionsFromCategory(project.category);
  };

  const generateSectionsFromCategory = (category) => {
    const template = categoryTemplates[category] || [];
    const newSections = template.map((section, index) => ({
      id: Date.now() + index,
      sectionName: section.name,
      items: section.items.map((item, itemIndex) => ({
        id: Date.now() + index + itemIndex + 1000,
        itemName: item,
        height: '',
        width: '',
        total: 0
      }))
    }));
    setSections(newSections);
  };

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      sectionName: '',
      items: [{ id: Date.now(), itemName: '', height: '', width: '', total: 0 }]
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const updateSection = (sectionId, field, value) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, [field]: value } : section
    ));
  };

  const addItem = (sectionId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            items: [...section.items, { id: Date.now(), itemName: '', height: '', width: '', total: 0 }] 
          }
        : section
    ));
  };

  const removeItem = (sectionId, itemId) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, items: section.items.filter(item => item.id !== itemId) }
        : section
    ));
  };

  const updateItem = (sectionId, itemId, field, value) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? {
            ...section,
            items: section.items.map(item => 
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : section
    ));
  };

  const calculateItemTotal = (height, width) => {
    const h = parseFloat(height) || 0;
    const w = parseFloat(width) || 0;
    return h * w;
  };

  const getSectionTotal = (section) => {
    return section.items.reduce((total, item) => {
      return total + calculateItemTotal(item.height, item.width);
    }, 0);
  };

  const getGrandTotal = () => {
    return sections.reduce((total, section) => total + getSectionTotal(section), 0);
  };

  const handleSubmit = () => {
    if (!selectedClient || !selectedProject) {
      alert('Please select client and project');
      return;
    }

    const quotationData = {
      client: selectedClient._id,
      project: selectedProject._id,
      category: selectedProject.category,
      sections: sections.map(section => ({
        sectionName: section.sectionName,
        items: section.items.map(item => ({
          itemName: item.itemName,
          height: parseFloat(item.height) || 0,
          width: parseFloat(item.width) || 0,
          total: calculateItemTotal(item.height, item.width)
        }))
      }))
    };

    console.log('Quotation Data:', quotationData);
    alert('Quotation created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Quotation
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Select client, project and add quotation details</p>
        </div>

        {/* Client Selection */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-lg mr-3">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">Select Client</h2>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowClientDropdown(!showClientDropdown)}
                className="w-full p-4 text-left bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className={selectedClient ? 'text-gray-800' : 'text-gray-500'}>
                    {selectedClient ? selectedClient.name : 'Choose a client...'}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showClientDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showClientDropdown && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {clients.map(client => (
                    <div
                      key={client._id}
                      onClick={() => handleClientSelect(client)}
                      className="p-4 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{client.name}</div>
                      <div className="text-sm text-gray-600">{client.email}</div>
                      <div className="text-sm text-gray-500">{client.phone}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Client Details */}
            {selectedClient && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-3">Selected Client Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</label>
                    <p className="text-gray-800 font-medium">{selectedClient.name}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-gray-800">{selectedClient.email}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</label>
                    <p className="text-gray-800">{selectedClient.phone}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Address</label>
                    <p className="text-gray-800">{selectedClient.address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Project Selection */}
        {selectedClient && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Building className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Select Project</h2>
                </div>
                {selectedProject && (
                  <button
                    onClick={() => setShowChangeProject(!showChangeProject)}
                    className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Change
                  </button>
                )}
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <>
                  {!selectedProject || showChangeProject ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {projects.map(project => (
                        <div 
                          key={project._id}
                          onClick={() => handleProjectSelect(project)}
                          className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-400 hover:shadow-md transition-all bg-gradient-to-br from-white to-gray-50"
                        >
                          <h3 className="font-semibold text-gray-800 mb-2">{project.title}</h3>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              <span className="inline-block w-16 font-medium">Category:</span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                {project.category}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="inline-block w-16 font-medium">Location:</span>
                              {project.location}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="inline-block w-16 font-medium">Budget:</span>
                              <span className="font-semibold text-green-600">{project.budget}</span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Selected Project Display */
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                      <h3 className="font-semibold text-gray-800 mb-3">Selected Project</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</label>
                          <p className="text-gray-800 font-medium">{selectedProject.title}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Category</label>
                          <p className="text-purple-700 font-semibold">{selectedProject.category}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                          <p className="text-gray-800">{selectedProject.location}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</label>
                          <p className="text-green-600 font-semibold">{selectedProject.budget}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Category Display */}
        {selectedProject && !showChangeProject && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Project Category</h2>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold shadow-md">
                {selectedProject.category}
              </div>
            </div>
          </div>
        )}

        {/* Quotation Sections */}
        {selectedProject && !showChangeProject && sections.length > 0 && (
          <div className="mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-3 sm:space-y-0">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Calculator className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">Quotation Details</h2>
                </div>
                <button 
                  onClick={addSection}
                  className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md transform hover:scale-105"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Section
                </button>
              </div>

              <div className="space-y-6">
                {sections.map((section, sectionIndex) => (
                  <div key={section.id} className="p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                      <input
                        type="text"
                        placeholder="Section Name"
                        value={section.sectionName}
                        onChange={(e) => updateSection(section.id, 'sectionName', e.target.value)}
                        className="text-lg font-semibold bg-white border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none flex-1 sm:mr-4"
                      />
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600 bg-white px-3 py-2 rounded-lg shadow-sm">
                          Total: <span className="text-blue-600 font-bold">{getSectionTotal(section).toFixed(2)}</span>
                        </span>
                        <button 
                          onClick={() => removeSection(section.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <div className="min-w-full">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                          {/* Desktop Table Header */}
                          <div className="hidden md:grid md:grid-cols-6 bg-gray-100 border-b border-gray-200">
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700">Item Name</div>
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700">Height</div>
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700">Width</div>
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700">Calculation</div>
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700">Total</div>
                            <div className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Actions</div>
                          </div>

                          {/* Table Body */}
                          {section.items.map((item) => (
                            <div key={item.id} className="border-b border-gray-100 last:border-b-0">
                              {/* Desktop Layout */}
                              <div className="hidden md:grid md:grid-cols-6 items-center">
                                <div className="px-4 py-3">
                                  <input
                                    type="text"
                                    placeholder="Item name"
                                    value={item.itemName}
                                    onChange={(e) => updateItem(section.id, item.id, 'itemName', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                </div>
                                <div className="px-4 py-3">
                                  <input
                                    type="number"
                                    placeholder="Height"
                                    value={item.height}
                                    onChange={(e) => updateItem(section.id, item.id, 'height', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                </div>
                                <div className="px-4 py-3">
                                  <input
                                    type="number"
                                    placeholder="Width"
                                    value={item.width}
                                    onChange={(e) => updateItem(section.id, item.id, 'width', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                </div>
                                <div className="px-4 py-3 text-sm text-gray-600">
                                  {item.height && item.width ? `${item.height} × ${item.width}` : '-'}
                                </div>
                                <div className="px-4 py-3 font-semibold text-blue-600">
                                  {calculateItemTotal(item.height, item.width).toFixed(2)}
                                </div>
                                <div className="px-4 py-3 text-center">
                                  <button 
                                    onClick={() => removeItem(section.id, item.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Mobile Layout */}
                              <div className="md:hidden p-4 space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">Item Name</label>
                                  <input
                                    type="text"
                                    placeholder="Item name"
                                    value={item.itemName}
                                    onChange={(e) => updateItem(section.id, item.id, 'itemName', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Height</label>
                                    <input
                                      type="number"
                                      placeholder="Height"
                                      value={item.height}
                                      onChange={(e) => updateItem(section.id, item.id, 'height', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Width</label>
                                    <input
                                      type="number"
                                      placeholder="Width"
                                      value={item.width}
                                      onChange={(e) => updateItem(section.id, item.id, 'width', e.target.value)}
                                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-medium text-gray-600">Calculation: </span>
                                    <span className="text-sm text-gray-800">
                                      {item.height && item.width ? `${item.height} × ${item.width}` : '-'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-gray-600">Total: </span>
                                    <span className="font-semibold text-blue-600">
                                      {calculateItemTotal(item.height, item.width).toFixed(2)}
                                    </span>
                                  </div>
                                  <button 
                                    onClick={() => removeItem(section.id, item.id)}
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => addItem(section.id)}
                      className="mt-4 px-4 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    >
                      Add Item
                    </button>
                  </div>
                ))}
              </div>

              {/* Grand Total */}
              <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">Grand Total:</span>
                  <span className="text-2xl sm:text-3xl font-bold">₹ {getGrandTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleSubmit}
                  className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all font-semibold text-lg shadow-lg"
                >
                  Create Quotation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationComponent;
"use client"
import React, { useState } from 'react';
import { ChevronDown, Users, FolderOpen, Calculator, Package, Wrench, Settings, CheckCircle, FileText } from 'lucide-react';
import FinalQuotationUpload from './FinalQuotationUpload';
import ModularKitchenQuotation from './ModularKitchenQuotation';
import InplaceFurnitureQuotation from './InplaceFurnitureQuotation';

const QuotationUpload = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [category, setCategory] = useState('');
  const [showQuotationForm, setShowQuotationForm] = useState(false);
  const [showFinalQuotation, setShowFinalQuotation] = useState(false);
  const [savedQuotations, setSavedQuotations] = useState([]);

  // Sample data
  const clients = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com' },
    { id: 3, name: 'Amit Kumar', email: 'amit@example.com' }
  ];

  const projects = {
    1: [
      { id: 1, name: 'Living Room Design', category: 'inplace-furniture', status: 'Active' },
      { id: 2, name: 'Kitchen Renovation', category: 'modular-kitchen', status: 'Active' }
    ],
    2: [
      { id: 3, name: 'Bedroom Setup', category: 'inplace-furniture', status: 'Active' },
      { id: 4, name: 'Modern Kitchen', category: 'modular-kitchen', status: 'Active' }
    ],
    3: [
      { id: 5, name: 'Office Interior', category: 'inplace-furniture', status: 'Active' }
    ]
  };

  const handleProjectSelect = (projectId) => {
    const project = Object.values(projects).flat().find(p => p.id === parseInt(projectId));
    if (project) {
      setSelectedProject(projectId);
      setCategory(project.category);
    }
  };

  const handleProceed = () => {
    if (!selectedClient || !selectedProject) {
      alert('Please select both client and project');
      return;
    }
    setShowQuotationForm(true);
  };

  const handleBack = () => {
    setShowQuotationForm(false);
    setShowFinalQuotation(false);
  };

  const handleQuotationSaved = (quotationData) => {
    const newQuotation = {
      id: Date.now(),
      clientName: getSelectedClientName(),
      projectName: getSelectedProjectName(),
      projectId: selectedProject,
      category,
      data: quotationData,
      createdAt: new Date().toLocaleDateString(),
      status: 'Rough',
      type: 'rough'
    };
    setSavedQuotations([...savedQuotations, newQuotation]);
    setShowQuotationForm(false);
  };

  const handleCreateFinalQuotation = () => {
    setShowFinalQuotation(true);
  };

const handleFinalQuotationUploaded = (finalQuotationData) => {
  const newFinalQuotation = {
    id: Date.now(),
    clientName: getSelectedClientName(),
    projectName: getSelectedProjectName(),
    projectId: selectedProject,
    category,
    fileName: finalQuotationData.fileName,
    fileSize: finalQuotationData.fileSize,
    createdAt: new Date().toLocaleDateString(),
    status: 'Final',
    type: 'final'
  };
  setSavedQuotations([...savedQuotations, newFinalQuotation]);
  setShowFinalQuotation(false);

  // Force re-render to show updated table
  console.log('Final quotation uploaded:', newFinalQuotation);
};

  const getSelectedClientName = () => {
    const client = clients.find(c => c.id === parseInt(selectedClient));
    return client ? client.name : '';
  };

  const getSelectedProjectName = () => {
    const project = Object.values(projects).flat().find(p => p.id === parseInt(selectedProject));
    return project ? project.name : '';
  };

  // Check if rough quotation exists for selected project
  const hasRoughQuotationForProject = () => {
    if (!selectedClient || !selectedProject) return false;
    return savedQuotations.some(q =>
      q.clientName === getSelectedClientName() &&
      q.projectId === selectedProject &&
      q.type === 'rough'
    );
  };

  // Check if final quotation already exists for selected project
  const hasFinalQuotationForProject = () => {
    if (!selectedClient || !selectedProject) return false;
    return savedQuotations.some(q =>
      q.clientName === getSelectedClientName() &&
      q.projectId === selectedProject &&
      q.type === 'final'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg border-b rounded-b-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
                <Calculator className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Quotation Management System</h1>
                <p className="text-sm text-slate-600">Professional quotation creation and management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">Admin Dashboard</p>
                <p className="text-xs text-slate-500">Manage quotations efficiently</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center text-sm font-semibold rounded-xl shadow-lg">
                A
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Form - Only show when not in form or final quotation mode */}
      {!showQuotationForm && !showFinalQuotation && (
        <div className="bg-white shadow-lg border-b relative z-40 rounded-b-xl mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Client Selection */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white mr-3 rounded-lg">
                    <Users className="h-4 w-4" />
                  </div>
                  Select Client
                </label>
                <div className="relative">
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="w-full p-4 border-2 border-slate-200 focus:ring-4 focus:ring-blue-200 focus:border-blue-400 bg-white appearance-none text-slate-700 font-medium rounded-xl shadow-sm transition-all"
                  >
                    <option value="">Choose Client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* Project Selection */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 rounded-lg">
                    <FolderOpen className="h-4 w-4" />
                  </div>
                  Select Project
                </label>
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => handleProjectSelect(e.target.value)}
                    disabled={!selectedClient}
                    className="w-full p-4 border-2 border-slate-200 focus:ring-4 focus:ring-green-200 focus:border-green-400 bg-white appearance-none disabled:bg-slate-100 disabled:cursor-not-allowed text-slate-700 font-medium rounded-xl shadow-sm transition-all"
                  >
                    <option value="">Choose Project</option>
                    {selectedClient && projects[selectedClient]?.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
              </div>

              {/* Category Display */}
              <div className="space-y-3">
                <label className="flex items-center text-sm font-semibold text-slate-700">
                  <div className="p-2 bg-gradient-to-r from-purple-400 to-purple-500 text-white mr-3 rounded-lg">
                    <Settings className="h-4 w-4" />
                  </div>
                  Category
                </label>
                <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-2 border-slate-200 min-h-[56px] flex items-center rounded-xl">
                  {category ? (
                    <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg shadow-sm ${
                      category === 'modular-kitchen'
                        ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                        : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                    }`}>
                      {category === 'modular-kitchen' ? (
                        <>
                          <Wrench className="h-4 w-4 mr-2" />
                          Modular Kitchen
                        </>
                      ) : (
                        <>
                          <Package className="h-4 w-4 mr-2" />
                          Inplace Furniture
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400 text-sm font-medium">Select project first</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 block">Action</label>
                <button
                  onClick={handleProceed}
                  disabled={!selectedClient || !selectedProject}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-4 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 font-semibold rounded-xl shadow-lg transform hover:scale-105 disabled:hover:scale-100"
                >
                  <Calculator className="h-5 w-5" />
                  <span>Create Quotation</span>
                </button>
              </div>
            </div>

            {/* Selected Info Bar */}
            {(selectedClient || selectedProject) && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm">
                    {selectedClient && (
                      <div className="flex items-center text-blue-700 font-medium">
                        <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white mr-3 rounded-lg">
                          <Users className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">Client:</span>
                        <span className="ml-2">{getSelectedClientName()}</span>
                      </div>
                    )}
                    {selectedProject && (
                      <div className="flex items-center text-blue-700 font-medium">
                        <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white mr-3 rounded-lg">
                          <FolderOpen className="h-4 w-4" />
                        </div>
                        <span className="font-semibold">Project:</span>
                        <span className="ml-2">{getSelectedProjectName()}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {showFinalQuotation ? (
          <FinalQuotationUpload
            onBack={handleBack}
            onUpload={handleFinalQuotationUploaded}
            clientName={getSelectedClientName()}
            projectName={getSelectedProjectName()}
          />
        ) : showQuotationForm ? (
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-3 text-sm text-slate-600 font-medium bg-white p-4 rounded-xl shadow-sm border-2 border-slate-100">
              <span>Quotation Management</span>
              <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-400" />
              <span>Create Quotation</span>
              <ChevronDown className="h-4 w-4 rotate-[-90deg] text-slate-400" />
              <span className="text-blue-600 font-semibold">
                {category === 'modular-kitchen' ? 'Modular Kitchen' : 'Inplace Furniture'}
              </span>
            </div>

            {/* Quotation Form */}
            {category === 'modular-kitchen' ? (
              <ModularKitchenQuotation
                onBack={handleBack}
                onSave={handleQuotationSaved}
                clientName={getSelectedClientName()}
                projectName={getSelectedProjectName()}
              />
            ) : category === 'inplace-furniture' ? (
              <InplaceFurnitureQuotation
                onBack={handleBack}
                onSave={handleQuotationSaved}
                clientName={getSelectedClientName()}
                projectName={getSelectedProjectName()}
              />
            ) : null}
          </div>
        ) : (
          <div>
            {/* Saved Quotations List - Only show when client is selected */}
            {selectedClient && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">
                    Quotations for {getSelectedClientName()}
                  </h2>
                  {/* Final quotation button - only show if rough quotation exists and no final quotation yet */}
                  {hasRoughQuotationForProject() && !hasFinalQuotationForProject() && selectedProject && (
                    <button
                      onClick={handleCreateFinalQuotation}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 font-semibold rounded-xl shadow-lg transform hover:scale-105"
                    >
                      <FileText className="h-5 w-5" />
                      <span>Create Final Quotation</span>
                    </button>
                  )}
                  {hasFinalQuotationForProject() && selectedProject && (
                    <button
                      disabled
                      className="bg-slate-400 text-white px-6 py-3 cursor-not-allowed flex items-center space-x-2 font-semibold rounded-xl shadow-lg opacity-60"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Final Quotation Uploaded</span>
                    </button>
                  )}
                </div>

                {/* Filter quotations based on selected client */}
                {(() => {
                  const filteredQuotations = savedQuotations.filter(q => q.clientName === getSelectedClientName());

                  return filteredQuotations.length > 0 ? (
                    <div className="bg-white border-2 border-slate-200 overflow-hidden rounded-xl shadow-lg">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-200">
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Type</th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Project</th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Category</th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Status</th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Created Date</th>
                              <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredQuotations.map((quotation) => (
                              <tr key={quotation.id} className="border-b border-slate-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all">
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
                                    quotation.type === 'final'
                                      ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
                                      : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                  }`}>
                                    {quotation.type === 'final' ? 'Final' : 'Rough'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                  {quotation.projectName}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
                                    quotation.category === 'modular-kitchen'
                                      ? 'bg-gradient-to-r from-orange-400 to-orange-500 text-white'
                                      : 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                                  }`}>
                                    {quotation.category === 'modular-kitchen' ? (
                                      <>
                                        <Wrench className="h-3 w-3 mr-2" />
                                        Modular Kitchen
                                      </>
                                    ) : (
                                      <>
                                        <Package className="h-3 w-3 mr-2" />
                                        Inplace Furniture
                                      </>
                                    )}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg shadow-sm ${
                                    quotation.status === 'Final'
                                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                      : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                  }`}>
                                    {quotation.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {quotation.createdAt}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                  {quotation.type === 'final' ? (
                                    <div>
                                      <p className="font-medium text-slate-800">{quotation.fileName}</p>
                                      <p className="text-xs text-slate-500">{quotation.fileSize} MB</p>
                                    </div>
                                  ) : (
                                    <p className="font-bold text-green-600">
                                      ₹{quotation.data.grandTotal?.toFixed(2) || '0.00'}
                                    </p>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border-2 border-slate-200 p-10 text-center rounded-xl shadow-lg">
                      <div className="text-slate-500">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-xl font-medium">No quotations uploaded yet</p>
                        <p className="text-sm">
                          Create first rough quotation for {getSelectedClientName()}
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* Default Content - show when no client is selected */}
            {!selectedClient && (
              <div className="text-center py-20">
                <div className="p-8 bg-white border-2 border-slate-200 max-w-lg mx-auto rounded-xl shadow-lg">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white mx-auto w-fit mb-6 rounded-xl shadow-lg">
                    <Calculator className="h-16 w-16" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Create Quotation</h3>
                  <p className="text-slate-500 font-medium text-lg">
                    Select client from the form above to view and manage quotations
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationUpload;

// "use client";
// import React, { useState, useEffect } from "react";
// import {
//   getAllClientsEmail,
//   addQuotation,
//   getProjectsByClientEmail,
// } from "@/services/quotation.services";

// const AddQuotation = ({ userRole }) => {
//   const [clients, setClients] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [selectedClient, setSelectedClient] = useState(null);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [sections, setSections] = useState([]);
//   const [grandTotal, setGrandTotal] = useState(0);

//   // fetch clients on mount
//   useEffect(() => {
//     const fetchClients = async () => {
//       try {
//         const data = await getAllClientsEmail();
//         setClients(data);
//       } catch (err) {
//         console.error("Error fetching clients:", err);
//       }
//     };
//     fetchClients();
//   }, []);

//   // handle client select
//   const handleClientSelect = async (email) => {
//     setSelectedClient(clients.find((c) => c.email === email));
//     setSelectedProject(null);
//     setSections([]);
//     try {
//       const data = await getProjectsByClientEmail(email);
//       setProjects(data);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//     }
//   };

//   // handle project select and load sections dynamically
//   const handleProjectSelect = (projectId) => {
//     const project = projects.find((p) => p._id === projectId);
//     setSelectedProject(project);

//     if (project.category === "Modular Kitchen") {
//       setSections([
//         { sectionName: "Wooden Part", items: [{ itemName: "", height: "", width: "", price: "" }] },
//         { sectionName: "Hardware", items: [{ itemName: "", height: "", width: "", price: "" }] },
//         { sectionName: "Accessories", items: [{ itemName: "", height: "", width: "", price: "" }] },
//         { sectionName: "Labour", items: [{ itemName: "", height: "", width: "", price: "" }] },
//         { sectionName: "Other", customSectionName: "", items: [{ itemName: "", height: "", width: "", price: "" }] },
//       ]);
//     } else if (project.category === "InPlace Furniture") {
//       setSections([
//         { sectionName: "Furniture", items: [{ itemName: "", height: "", width: "", price: "" }] },
//       ]);
//     } else {
//       setSections([
//         { sectionName: "Other", customSectionName: "", items: [{ itemName: "", height: "", width: "", price: "" }] },
//       ]);
//     }
//   };

//   // handle item change
//   const handleItemChange = (sectionIndex, itemIndex, field, value) => {
//     const updated = [...sections];
//     updated[sectionIndex].items[itemIndex][field] = value;

//     // calculation & total handled only if role = admin
//     if (userRole === "admin") {
//       const h = Number(updated[sectionIndex].items[itemIndex].height || 0);
//       const w = Number(updated[sectionIndex].items[itemIndex].width || 0);
//       const price = Number(updated[sectionIndex].items[itemIndex].price || 0);

//       updated[sectionIndex].items[itemIndex].calculation = `${w} * ${h}`;
//       updated[sectionIndex].items[itemIndex].total = price * (h * w || 1);
//     }

//     setSections(updated);
//   };

//   // add new item in section
//   const addItem = (sectionIndex) => {
//     const updated = [...sections];
//     updated[sectionIndex].items.push({
//       itemName: "",
//       height: "",
//       width: "",
//       price: "",
//       calculation: "",
//       total: "",
//     });
//     setSections(updated);
//   };

//   // handle custom section name
//   const handleCustomSectionChange = (sectionIndex, value) => {
//     const updated = [...sections];
//     updated[sectionIndex].customSectionName = value;
//     setSections(updated);
//   };

//   // calculate grand total
//   const calculateGrandTotal = () => {
//     let total = 0;
//     sections.forEach((section) => {
//       section.items.forEach((item) => {
//         total += Number(item.total || 0);
//       });
//     });
//     setGrandTotal(total);
//   };

//   // submit quotation
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedClient || !selectedProject) {
//       alert("Please select client and project");
//       return;
//     }

//     try {
//       const payload = {
//         client: selectedClient._id,
//         project: selectedProject._id,
//         sections,
//         grandTotal,
//       };

//       const res = await addQuotation(payload);
//       alert("Quotation created successfully!");
//       console.log(res);
//     } catch (err) {
//       console.error("Error creating quotation:", err);
//       alert("Failed to create quotation");
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto bg-white shadow rounded-lg">
//       <h2 className="text-2xl font-bold mb-6">Create Quotation</h2>

//       {/* Client Select */}
//       <label className="block mb-2 font-semibold">Select Client:</label>
//       <select
//         onChange={(e) => handleClientSelect(e.target.value)}
//         className="border p-2 rounded w-full mb-4"
//       >
//         <option value="">-- Select Client --</option>
//         {clients.map((c) => (
//           <option key={c._id} value={c.email}>
//             {c.email}
//           </option>
//         ))}
//       </select>

//       {/* Client Details */}
//       {selectedClient && (
//         <div className="p-4 border rounded mb-6 bg-gray-50">
//           <h3 className="font-bold">Client Details</h3>
//           <p><b>Name:</b> {selectedClient.name}</p>
//           <p><b>Email:</b> {selectedClient.email}</p>
//           <p><b>Phone:</b> {selectedClient.phone}</p>
//         </div>
//       )}

//       {/* Project Select */}
//       {selectedClient && (
//         <>
//           <label className="block mb-2 font-semibold">Select Project:</label>
//           <select
//             onChange={(e) => handleProjectSelect(e.target.value)}
//             className="border p-2 rounded w-full mb-4"
//           >
//             <option value="">-- Select Project --</option>
//             {projects.map((p) => (
//               <option key={p._id} value={p._id}>
//                 {p.title}
//               </option>
//             ))}
//           </select>
//         </>
//       )}

//       {/* Project Details */}
//       {selectedProject && (
//         <div className="p-4 border rounded mb-6 bg-gray-50">
//           <h3 className="font-bold">Project Details</h3>
//           <p><b>Name:</b> {selectedProject.title}</p>
//           <p><b>Category:</b> {selectedProject.category}</p>
//           <p><b>Description:</b> {selectedProject.description}</p>
//         </div>
//       )}

//       {/* Sections */}
//       {sections.map((section, sIndex) => (
//         <div key={sIndex} className="border p-4 mb-6 rounded">
//           <h3 className="text-lg font-semibold mb-2">
//             Section: {section.sectionName}
//           </h3>

//           {section.sectionName === "Other" && (
//             <input
//               type="text"
//               placeholder="Custom Section Name"
//               value={section.customSectionName}
//               onChange={(e) => handleCustomSectionChange(sIndex, e.target.value)}
//               className="border p-2 rounded w-full mb-3"
//             />
//           )}

//           {/* Items */}
//           <div className="grid grid-cols-6 gap-2 font-bold mb-2">
//             <span>Item Name</span>
//             <span>Height</span>
//             <span>Width</span>
//             <span>Price</span>
//             <span>Calculation</span>
//             <span>Total</span>
//           </div>

//           {section.items.map((item, iIndex) => (
//             <div key={iIndex} className="grid grid-cols-6 gap-2 mb-2">
//               <input
//                 type="text"
//                 placeholder="Item Name"
//                 value={item.itemName}
//                 onChange={(e) =>
//                   handleItemChange(sIndex, iIndex, "itemName", e.target.value)
//                 }
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Height"
//                 value={item.height}
//                 onChange={(e) =>
//                   handleItemChange(sIndex, iIndex, "height", e.target.value)
//                 }
//                 className="border p-2 rounded"
//               />
//               <input
//                 type="number"
//                 placeholder="Width"
//                 value={item.width}
//                 onChange={(e) =>
//                   handleItemChange(sIndex, iIndex, "width", e.target.value)
//                 }
//                 className="border p-2 rounded"
//               />

//               {/* Price (enabled only for admin) */}
//               <input
//                 type="number"
//                 placeholder="Price"
//                 value={item.price}
//                 onChange={(e) =>
//                   handleItemChange(sIndex, iIndex, "price", e.target.value)
//                 }
//                 className="border p-2 rounded"
//                 disabled={userRole !== "admin"}
//               />

//               {/* Calculation (readonly, show to everyone, only admin fills) */}
//               <input
//                 type="text"
//                 value={item.calculation || ""}
//                 readOnly
//                 className="border p-2 rounded bg-gray-100"
//               />

//               {/* Total (readonly, show to everyone, only admin fills) */}
//               <input
//                 type="number"
//                 value={item.total || 0}
//                 readOnly
//                 className="border p-2 rounded bg-gray-100"
//               />
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={() => addItem(sIndex)}
//             className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
//           >
//             + Add Item
//           </button>
//         </div>
//       ))}

//       {/* Grand Total */}
//       {sections.length > 0 && (
//         <div className="flex flex-col gap-3 mt-4">
//           <button
//             onClick={calculateGrandTotal}
//             className="bg-green-600 text-white px-5 py-2 rounded"
//           >
//             Calculate Grand Total
//           </button>
//           {grandTotal > 0 && (
//             <div className="text-lg font-bold">
//               Grand Total: ₹{grandTotal}
//             </div>
//           )}

//           <button
//             onClick={handleSubmit}
//             className="bg-purple-600 text-white px-5 py-2 rounded"
//           >
//             Create Quotation
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddQuotation;


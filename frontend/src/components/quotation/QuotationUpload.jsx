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

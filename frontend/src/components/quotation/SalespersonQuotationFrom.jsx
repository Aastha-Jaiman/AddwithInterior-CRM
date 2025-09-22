
"use client";

import React, { useEffect, useState } from "react";
import {
  getProjectsByClientEmail,
  getDefaultSections,
  addQuotation,
} from "@/services/quotation.services";
import { getMyProjectClients } from "@/services/project.services";

const QuotationForm = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch clients on mount 
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await getMyProjectClients();
        console.log("Full API Response:", response);
        
        let clientsData = [];
        
        if (response && response.clients && Array.isArray(response.clients)) {
          const uniqueClients = new Map();
          
          response.clients.forEach(item => {
            if (item.client && item.client.email) {
              const clientKey = item.client.email;
              if (!uniqueClients.has(clientKey)) {
                uniqueClients.set(clientKey, {
                  _id: item.client._id || item.client.email,
                  email: item.client.email,
                  name: item.client.name,
                  phone: item.client.phone,
                });
              }
            }
          });
          
          clientsData = Array.from(uniqueClients.values());
        }
        
        console.log("Processed unique clients:", clientsData);
        setClients(clientsData);
        
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      }
    };
    fetchClients();
  }, []);

  // Debug clients state
  useEffect(() => {
    console.log("Current clients state:", clients);
    if (clients.length > 0) {
      console.log("First processed client:", clients[0]);
    }
  }, [clients]);

  const handleClientChange = async (email) => {
    console.log("Selected client email:", email);
    setSelectedClient(email);
    setSelectedProject(null);
    setSections([]);
    
    if (!email) return;
    
    try {
      const data = await getProjectsByClientEmail(email);
      console.log("Projects data for client:", data);
      
      // Handle projects data
      let projectsData = [];
      if (Array.isArray(data)) {
        projectsData = data;
      } else if (data && Array.isArray(data.projects)) {
        projectsData = data.projects;
      }
      
      setProjects(projectsData);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    }
  };

  const handleProjectChange = async (project) => {
    console.log("Selected project:", project);
    setSelectedProject(project);
    
    if (!project?._id) return;
    
    try {
      const data = await getDefaultSections(project._id);
      console.log("Sections data:", data);
      setSections(Array.isArray(data?.sections) ? data.sections : []);
    } catch (error) {
      console.error("Error fetching default sections:", error);
      setSections([]);
    }
  };

  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    const updatedSections = [...sections];
    const item = updatedSections[sectionIndex].items[itemIndex];

    item[field] = value;

    const width = parseFloat(item.width) || 0;
    const height = parseFloat(item.height) || 0;
    const price = parseFloat(item.price) || 0;

    item.calculation = width * height;
    item.total = item.calculation * price;

    setSections(updatedSections);
  };

  // const handleSubmit = async () => {
  //   if (!selectedClient || !selectedProject) {
  //     alert("Please select client and project first.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const quotationData = {
  //       client: selectedProject.client,
  //       project: selectedProject._id,
  //       sections,
  //     };
  //     const response = await addQuotation(quotationData);
  //     alert("Quotation created successfully!");
  //     console.log("Created:", response);
  //   } catch (error) {
  //     console.error("Error creating quotation:", error);
  //     alert("Error while creating quotation");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    if (!selectedClient || !selectedProject) {
      alert("Please select client and project first.");
      return;
    }
    setLoading(true);
    try {
      // Filter only filled items
      const filteredSections = sections
        .map((section) => ({
          ...section,
          items: section.items.filter(
            (item) =>
              item.width > 0 || item.height > 0 || item.price > 0
          ),
        }))
        .filter((section) => section.items.length > 0);
  
      const quotationData = {
        client: selectedProject.client,
        project: selectedProject._id,
        sections: filteredSections,
      };
  
      const response = await addQuotation(quotationData);
      alert("Quotation created successfully!");
      console.log("Created:", response);
    } catch (error) {
      const message = error?.response?.data?.message || "Error while creating quotation";
      alert(message);
    } finally {
      setLoading(false);
    }
  };
  
  const getTotalAmount = () => {
    return sections.reduce((total, section) => {
      return total + section.items.reduce((sectionTotal, item) => sectionTotal + (item.total || 0), 0);
    }, 0);
  };

  // Get selected client object
  const selectedClientObj = clients.find(c => c.email === selectedClient);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create New Quotation</h1>
          <p className="text-gray-600">Generate professional quotations for your clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Client Selection + Details */}
          <div>
            {/* Client Selection - FIXED */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Select Client</h2>
              <select
                value={selectedClient}
                onChange={(e) => handleClientChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                aria-label="Select client"
              >
                <option value="">Choose a client...</option>
                {Array.isArray(clients) && clients.map((client, index) => {
                  const uniqueKey = client._id || `client-${index}`;
                  
                  return (
                    <option key={uniqueKey} value={client.email}>
                      {client.name} ({client.email})
                    </option>
                  );
                })}
              </select>
              
              {/* Debug info */}
              <div className="mt-2 text-xs text-gray-500">
                Clients count: {clients.length} | Selected: {selectedClient}
                {clients.length > 0 && (
                  <div>Sample client fields: {Object.keys(clients[0] || {}).join(", ")}</div>
                )}
              </div>
            </div>

            {/* Client Details */}
            {selectedClient && selectedClientObj && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Client Details</h3>
                <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium text-gray-900">{selectedClientObj.name || "N/A"}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="font-medium text-gray-900">{selectedClient}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="font-medium text-gray-900">{selectedClientObj.phone || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Selection + Details */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4 border border-gray-200">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Select Project</h2>
              <select
                value={selectedProject?._id || ""}
                onChange={(e) => {
                  const project = projects.find((p) => p._id === e.target.value);
                  handleProjectChange(project);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                aria-label="Select project"
                disabled={!selectedClient || projects.length === 0}
              >
                <option value="">
                  {!selectedClient ? "Select a client first" : "Choose a project..."}
                </option>
                {Array.isArray(projects) && projects.map((project, index) => {
                  const uniqueKey = project._id || `project-${index}`;
                  const projectName = project.projectTitle || project.title || project.projectName;
                  
                  return (
                    <option key={uniqueKey} value={project._id}>
                      {projectName} ({project.category || 'No category'})
                    </option>
                  );
                })}
              </select>
              
              <div className="mt-2 text-xs text-gray-500">
                Projects count: {projects.length}
              </div>
            </div>

            {/* Project Details */}
            {selectedProject && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Project Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Project Name</p>
                    <p className="font-medium text-gray-900 truncate">
                      {selectedProject.projectTitle || selectedProject.title || "N/A"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium text-gray-900">{selectedProject.category || "N/A"}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm text-gray-600">Budget</p>
                    <p className="font-medium text-gray-900">
                      ₹{selectedProject.finalBudget || selectedProject.budget || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quotation Sections */}
        {sections.length > 0 && (
          <div className="space-y-6 mt-8">
            <div className="flex items-center justify-between my-4">
              <h2 className="text-lg font-medium text-gray-900">Quotation Items</h2>
              <div className="text-right">
                <p className="text-xs text-gray-600">Total Amount</p>
                <p className="text-xl font-bold text-blue-600">₹{getTotalAmount().toFixed(2)}</p>
              </div>
            </div>

            {sections.map((section, sIndex) => (
              <div key={`section-${sIndex}`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-base font-medium text-gray-900">{section.sectionName}</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Width</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Height</th>
                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                        {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th> */}
                        {/* <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Array.isArray(section.items) && section.items.map((item, iIndex) => (
                        <tr key={`item-${sIndex}-${iIndex}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <input
                              type="number"
                              value={item.width || ""}
                              onChange={(e) => handleItemChange(sIndex, iIndex, "width", e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <input
                              type="number"
                              value={item.height || ""}
                              onChange={(e) => handleItemChange(sIndex, iIndex, "height", e.target.value)}
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                              placeholder="0"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span className="text-sm font-medium text-gray-900">
                              {(item.calculation || 0).toFixed(2)}
                            </span>
                          </td>
                          {/* <td className="px-4 py-3 whitespace-nowrap text-center">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">₹</span>
                              <input
                                type="number"
                                value={item.price || ""}
                                onChange={(e) => handleItemChange(sIndex, iIndex, "price", e.target.value)}
                                className="w-20 pl-6 pr-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                placeholder="0.00"
                              />
                            </div>
                          </td> */}
                          {/* <td className="px-4 py-3 whitespace-nowrap text-center">
                            <span className="text-sm font-semibold text-green-600">
                              ₹{(item.total || 0).toFixed(2)}
                            </span>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Quotation"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationForm;

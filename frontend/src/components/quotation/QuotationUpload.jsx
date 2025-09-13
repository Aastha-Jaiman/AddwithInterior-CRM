"use client";

import React, { useEffect, useState } from "react";
import {
  getAllClientsEmail,
  getProjectsByClientEmail,
  getDefaultSections,
  addQuotation,
} from "@/services/quotation.services";

const QuotationForm = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch clients on mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await getAllClientsEmail();
        setClients(data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };
    fetchClients();
  }, []);

  // Fetch projects when client changes
  const handleClientChange = async (email) => {
    setSelectedClient(email);
    setSelectedProject(null);
    setSections([]);
    try {
      const data = await getProjectsByClientEmail(email);
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch default sections based on project
  const handleProjectChange = async (project) => {
    setSelectedProject(project);
    try {
      const data = await getDefaultSections(project._id);
      setSections(data.sections);
    } catch (error) {
      console.error("Error fetching default sections:", error);
    }
  };

  // Update item fields + auto calculate
  const handleItemChange = (sectionIndex, itemIndex, field, value) => {
    const updatedSections = [...sections];
    const item = updatedSections[sectionIndex].items[itemIndex];

    item[field] = value;

    // Auto-calc
    const width = parseFloat(item.width) || 0;
    const height = parseFloat(item.height) || 0;
    const price = parseFloat(item.price) || 0;

    item.calculation = width * height;
    item.total = item.calculation * price;

    setSections(updatedSections);
  };

  // Submit quotation
  const handleSubmit = async () => {
    if (!selectedClient || !selectedProject) {
      alert("Please select client and project first.");
      return;
    }
    setLoading(true);
    try {
      const quotationData = {
        client: selectedProject.client,
        project: selectedProject._id,
        sections,
      };
      const response = await addQuotation(quotationData);
      alert("Quotation created successfully!");
      console.log("Created:", response);
    } catch (error) {
      console.error("Error creating quotation:", error);
      alert("Error while creating quotation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Create Quotation</h2>

      {/* Client Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Select Client</label>
        <select
          value={selectedClient || ""}
          onChange={(e) => handleClientChange(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Choose Client --</option>
          {clients.map((client) => (
            <option key={client._id} value={client.email}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>
      </div>

      {/* Project Dropdown */}
      {projects.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">Select Project</label>
          <select
            value={selectedProject?._id || ""}
            onChange={(e) =>
              handleProjectChange(projects.find((p) => p._id === e.target.value))
            }
            className="border rounded p-2 w-full"
          >
            <option value="">-- Choose Project --</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.projectName} ({project.category})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Project Details */}
      {selectedProject && (
        <div className="p-4 border rounded bg-gray-50">
          <p>
            <strong>Project Name:</strong> {selectedProject.title}
          </p>
          <p>
            <strong>Category:</strong> {selectedProject.category}
          </p>
          <p>
            <strong>Final Budget:</strong> {selectedProject.finalBudget}
          </p>
        </div>
      )}

      {/* Quotation Sections */}
      {sections.length > 0 && (
        <div className="space-y-8">
          <h3 className="text-lg font-semibold">Quotation Sections</h3>

          {sections.map((section, sIndex) => (
            <div key={sIndex} className="border p-4 rounded bg-white shadow">
              <h4 className="font-medium text-lg mb-2">{section.sectionName}</h4>

              {/* TABLE */}
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Item Name</th>
                    <th className="border px-3 py-2 text-center">Width</th>
                    <th className="border px-3 py-2 text-center">Height</th>
                    <th className="border px-3 py-2 text-center">Calculation</th>
                    <th className="border px-3 py-2 text-center">Price</th>
                    <th className="border px-3 py-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, iIndex) => (
                    <tr key={iIndex}>
                      <td className="border px-3 py-2">{item.itemName}</td>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="number"
                          value={item.width || ""}
                          onChange={(e) =>
                            handleItemChange(sIndex, iIndex, "width", e.target.value)
                          }
                          className="w-20 border rounded p-1 text-center"
                        />
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="number"
                          value={item.height || ""}
                          onChange={(e) =>
                            handleItemChange(sIndex, iIndex, "height", e.target.value)
                          }
                          className="w-20 border rounded p-1 text-center"
                        />
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.calculation || 0}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        <input
                          type="number"
                          value={item.price || ""}
                          onChange={(e) =>
                            handleItemChange(sIndex, iIndex, "price", e.target.value)
                          }
                          className="w-24 border rounded p-1 text-center"
                        />
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.total || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save Quotation"}
          </button>
        </div>
      )}
    </div>
  );
};

export default QuotationForm;

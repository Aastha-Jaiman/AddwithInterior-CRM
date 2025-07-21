"use client";
import React, { useState } from "react";
import ProjectDetails from "./DesignPanelData";
import ClientDesignDetails from "../clientdesign/ClientPanelDesign";

// Sample projects data
const sampleProjects = [
  {
    id: 1,
    name: "Modern Villa Design",
    customer: {
      name: "Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh@email.com",
    },
    category: "Residential",
    estimatedBudget: "₹25,00,000",
    status: "Active",
    designStatus: "pending", // pending, uploaded, finalized
    designer: "Priya Sharma",
    salesperson: "Amit Singh",
    startingDate: "2024-01-15",
    location: "Jaipur, Rajasthan",
    projectType: "New Construction",
    description: "A modern villa with contemporary design elements",
    design: null,
    designHistory: [],
  },
  {
    id: 2,
    name: "Office Complex Renovation",
    customer: {
      name: "Tech Solutions Pvt Ltd",
      phone: "+91 9123456789",
      email: "contact@techsol.com",
    },
    category: "Commercial",
    estimatedBudget: "₹50,00,000",
    status: "In Progress",
    designStatus: "uploaded",
    designer: "Priya Sharma",
    salesperson: "Neha Gupta",
    startingDate: "2024-02-01",
    location: "Delhi, India",
    projectType: "Renovation",
    description: "Complete office renovation with modern amenities",
    design: {
      url: "/api/placeholder/300/200",
      name: "office_design_v2.pdf",
      uploadDate: "2024-02-15",
    },
    designHistory: [
      { version: 1, name: "office_design_v1.pdf", uploadDate: "2024-02-10" },
      { version: 2, name: "office_design_v2.pdf", uploadDate: "2024-02-15" },
    ],
  },
  {
    id: 3,
    name: "Luxury Apartment Interior",
    customer: {
      name: "Sunita Agarwal",
      phone: "+91 9987654321",
      email: "sunita@email.com",
    },
    category: "Interior",
    estimatedBudget: "₹15,00,000",
    status: "Completed",
    designStatus: "finalized",
    designer: "Priya Sharma",
    salesperson: "Rohit Mehta",
    startingDate: "2024-01-01",
    location: "Mumbai, Maharashtra",
    projectType: "Interior Design",
    description: "Luxury apartment interior with premium finishes",
    design: {
      url: "/api/placeholder/300/200",
      name: "luxury_apt_final.pdf",
      uploadDate: "2024-01-20",
    },
    designHistory: [
      { version: 1, name: "luxury_apt_v1.pdf", uploadDate: "2024-01-10" },
      { version: 2, name: "luxury_apt_final.pdf", uploadDate: "2024-01-20" },
    ],
  },
];

const DesignerPanel = () => {
  const [projects, setProjects] = useState(sampleProjects);
  const [selectedProject, setSelectedProject] = useState(null);

  // Get status colors
  const getStatusColor = (status) =>
    ({
      Active: "bg-emerald-500 text-white",
      "In Progress": "bg-amber-500 text-white",
      Completed: "bg-blue-500 text-white",
      "On Hold": "bg-gray-500 text-white",
    }[status] || "bg-gray-500 text-white");

  const getDesignStatusColor = (status) =>
    ({
      pending: "bg-gray-100 text-gray-800",
      uploaded: "bg-blue-100 text-blue-800",
      finalized: "bg-green-100 text-green-800",
    }[status] || "bg-gray-100 text-gray-800");

  const getDesignStatusText = (status) =>
    ({
      pending: "Design Pending",
      uploaded: "Design Uploaded",
      finalized: "Design Finalized",
    }[status] || "Design Pending");

  // Handle project selection
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  // Handle project updates from details component
  const handleProjectUpdate = (updatedProject) => {
    const updatedProjects = projects.map((project) =>
      project.id === updatedProject.id ? updatedProject : project
    );
    setProjects(updatedProjects);
    setSelectedProject(updatedProject);
  };

  // Handle back navigation
  const handleBackToProjects = () => {
    setSelectedProject(null);
  };

  // If a project is selected, show project details
  if (selectedProject) {
    return (
      <ProjectDetails
        project={selectedProject}
        onBack={handleBackToProjects}
        onProjectUpdate={handleProjectUpdate}
      />
      //         <ClientDesignDetails
      //     project={selectedProject}
      //     onBack={handleBackToProjects}
      //     onProjectUpdate={handleProjectUpdate}
      // />
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Designer Panel
        </h1>
        <p className="text-gray-600">
          Manage your assigned projects and upload designs
        </p>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Design Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={project.design?.url || "/api/placeholder/40/40"}
                        alt={project.name}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.customer.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.estimatedBudget}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getDesignStatusColor(
                        project.designStatus
                      )}`}
                    >
                      {getDesignStatusText(project.designStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {project.designer}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.salesperson}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.startingDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleProjectClick(project)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DesignerPanel;

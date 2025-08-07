"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Edit3, ChevronDown,
  FileText,
  PenTool,
  FileSignature
} from "lucide-react";

const ProjectsList = ({ projects, onView, onEdit, onCreateNew, onDownloadDocument }) => {
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  useEffect(() => {
    if (!Array.isArray(projects)) return;

    const filtered = projects.filter(project => {
      const matchesSearch =
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.salesperson?.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !categoryFilter || project.category === categoryFilter;
      const matchesStatus = !statusFilter || project.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, categoryFilter, statusFilter, projects]);

  const getStatusBadge = (status) => {
    if (!status || typeof status !== 'string') {
      return <span className="px-2 py-1 bg-gray-300 text-gray-700 rounded">Unknown</span>;
    }

    const formatted = status.charAt(0).toUpperCase() + status.slice(1);

    const statusColors = {
      "Pending": 'bg-green-100 text-green-800',
      "In-Process": 'bg-blue-100 text-blue-800',
      "Completed": 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-2 py-1 rounded ${statusColors[formatted] || 'bg-gray-100 text-gray-800'}`}>
        {formatted}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  Project Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your interior design projects efficiently
                </p>
              </div>
              <button
                onClick={onCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium">New Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none transition-colors"
                >
                  <option value="">All Categories</option>
                  <option value="modular_Kitchen">Modular Kitchen</option>
                  <option value="inPlace_Furniture">Inplace Furniture</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none transition-colors"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In-Process">In-Process</option>
                  <option value="Completed">Completed</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto w-full">
              <table className="min-w-[1200px] w-full ">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project Image
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Client Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Budget
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProjects.map((project) => (
                    <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              Array.isArray(project.projectImages)
                                ? project.projectImages[0]?.url
                                : project.projectImages?.url
                            }
                            alt={project.title || "Project"}
                            className="w-12 h-9 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />

                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {project.client?.name || "N/A"}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">{project.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{project.location}</div>
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {project.category}
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{!isNaN(Number(project.estimatedBudget)) ? Number(project.estimatedBudget).toLocaleString() : "N/A"}
                        </div>
                        {project.finalBudget && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Final: ₹{project.finalBudget.toLocaleString()}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="w-full">
                          {getStatusBadge(project.status)}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Rough Quotation */}
                          {project.documents?.roughQuotation?.url && (
                            <a
                              href={project.documents.roughQuotation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              title="Rough Quotation"
                              className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            >
                              <FileText className="w-4 h-4" />
                            </a>
                          )}

                          {/* Design PDF */}
                          {project.designs?.some((d) => d.pdfs?.length > 0) && (() => {
                            const firstPdf = project.designs.find((d) => d.pdfs?.length > 0)?.pdfs[0];
                            return firstPdf?.pdfUrl ? (
                              <a
                                href={firstPdf.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                title="Design"
                                className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                              >
                                <PenTool className="w-4 h-4" />
                              </a>
                            ) : null;
                          })()}

                          {/* Final Quotation */}
                          {project.documents?.finalQuotation?.url && (
                            <a
                              href={project.documents.finalQuotation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              download
                              title="Final Quotation"
                              className="p-1 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded transition-colors"
                            >
                              <FileSignature className="w-4 h-4" />
                            </a>
                          )}

                          {/* No Docs Fallback */}
                          {!project.documents?.roughQuotation &&
                            !project.documents?.finalQuotation &&
                            !project.designs?.some((d) => d.pdfs?.length > 0) && (
                              <span className="text-xs text-gray-400 dark:text-gray-500">No docs</span>
                            )}
                        </div>
                      </td>



                      <td className="px-4 py-4 text-sm text-gray-900 dark:text-white">
                        {project.startingDate ? new Date(project.startingDate).toLocaleDateString('en-IN') : "N/A"}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onView(project)}
                            className="p-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(project)}
                            className="p-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                            title="Edit Project"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create New Project
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;

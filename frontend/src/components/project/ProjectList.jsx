"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, Plus, Eye, Edit3, Calendar, ChevronDown, 
  FileText, Download 
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
    let filtered = projects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.customerName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || project.category === categoryFilter;
      const matchesStatus = !statusFilter || project.designStatus === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
    
    setFilteredProjects(filtered);
  }, [searchTerm, categoryFilter, statusFilter, projects]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      uploaded: "bg-blue-100 text-blue-800 border-blue-200",
      finalize: "bg-green-100 text-green-800 border-green-200"
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Inplace Furniture">Inplace Furniture</option>
                  <option value="Full Home Interior">Full Home Interior</option>
                  <option value="Office Interior">Office Interior</option>
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
                  <option value="pending">Pending</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="finalize">Finalize</option>
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
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Customer
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
                    <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-12 h-9 object-cover rounded border border-gray-200 dark:border-gray-600"
                          />
                          <div className="min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {project.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {project.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {project.customerName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {project.customerNumber}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          ₹{project.estimatedBudget?.toLocaleString()}
                        </div>
                        {project.finalBudget && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Final: ₹{project.finalBudget.toLocaleString()}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {getStatusBadge(project.designStatus)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {project.documents?.roughQuotation && (
                            <button
                              onClick={() => onDownloadDocument(
                                project.id, 
                                'roughQuotation', 
                                project.documents.roughQuotation.filename
                              )}
                              className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                              title="Download Rough Quotation"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {project.documents?.designPdf && (
                            <button
                              onClick={() => onDownloadDocument(
                                project.id, 
                                'designPdf', 
                                project.documents.designPdf.filename
                              )}
                              className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                              title="Download Design PDF"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {project.documents?.finalQuotation && (
                            <button
                              onClick={() => onDownloadDocument(
                                project.id, 
                                'finalQuotation', 
                                project.documents.finalQuotation.filename
                              )}
                              className="p-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                              title="Download Final Quotation"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          )}
                          {!project.documents?.roughQuotation && 
                           !project.documents?.designPdf && 
                           !project.documents?.finalQuotation && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              No docs
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(project.startingDate).toLocaleDateString('en-IN')}
                        </div>
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

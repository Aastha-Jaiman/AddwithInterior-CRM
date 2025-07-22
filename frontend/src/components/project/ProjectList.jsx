"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Calendar,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";

const ProjectsList = ({ projects, onView, onEdit, onCreateNew, onDownloadDocument }) => {
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  // Filter logic
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
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4 sm:p-6 lg:p-8">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Project Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your interior design projects efficiently
          </p>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl ring-1 ring-black/5 dark:ring-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search and filters */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
              {/* Search */}
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects or customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 w-full rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-44"
                >
                  <option value="">All Categories</option>
                  <option value="Modular Kitchen">Modular Kitchen</option>
                  <option value="Inplace Furniture">Inplace Furniture</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-36"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="uploaded">Uploaded</option>
                  <option value="finalize">Finalized</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Create New Button */}
            <button
              onClick={onCreateNew}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">New Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg rounded-2xl shadow-xl ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/80 dark:bg-slate-700/50">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={project.image}
                          alt={project.name}
                          className="h-12 w-16 rounded-lg object-cover shadow-sm"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {project.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {project.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {project.customerName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {project.customerNumber}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm">
                        <p className="text-gray-900 dark:text-gray-100">
                          ₹{project.estimatedBudget?.toLocaleString()}
                        </p>
                        {project.finalBudget && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            Final: ₹{project.finalBudget.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(project.designStatus)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {project.documents.roughQuotation && (
                          <button
                            onClick={() => onDownloadDocument(project.id, 'rough', project.documents.roughQuotation)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                            title="Download Rough Quotation"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {project.documents.designPdf && (
                          <button
                            onClick={() => onDownloadDocument(project.id, 'design', project.documents.designPdf)}
                            className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 transition-colors"
                            title="Download Design PDF"
                          >
                            <FileText className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {project.documents.finalQuotation && (
                          <button
                            onClick={() => onDownloadDocument(project.id, 'final', project.documents.finalQuotation)}
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 transition-colors"
                            title="Download Final Quotation"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {!project.documents.roughQuotation && !project.documents.designPdf && !project.documents.finalQuotation && (
                          <span className="text-xs text-gray-400 px-2 py-1 bg-gray-50 dark:bg-slate-700 rounded">No docs</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.startingDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onView(project)}
                          className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(project)}
                          className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-600 dark:text-purple-400 transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No projects found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;

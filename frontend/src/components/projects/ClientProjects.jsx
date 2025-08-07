"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Eye, FileSignature, FileText, PenTool, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getMyProjectsForClient } from "@/services/project.services";

const ProjectsList = () => {
  const router = useRouter();

  const [allProjects, setAllProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch Projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getMyProjectsForClient();
        const projects = response?.data?.projects || [];
        setAllProjects(projects);
        setFilteredProjects(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Filters
  useEffect(() => {
    const filtered = allProjects.filter((project) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch =
        project.projectTitle?.toLowerCase().includes(search) ||
        project.client?.name?.toLowerCase().includes(search);

      const matchesCategory =
        selectedCategory === "All" || project.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || project.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, allProjects]);

  // Get Unique Categories
  const uniqueCategories = useMemo(() => {
    const categories = allProjects.map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(categories)];
  }, [allProjects]);

  // Get Unique Statuses
  const uniqueStatuses = useMemo(() => {
    const statuses = allProjects.map((p) => p.status).filter(Boolean);
    return ["All", ...new Set(statuses)];
  }, [allProjects]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Project Management</h1>
          <p className="text-gray-600">Manage your interior design projects efficiently</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by client or title..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category */}
            <div className="min-w-[150px]">
              <select
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {uniqueCategories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div className="min-w-[150px]">
              <select
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {uniqueStatuses.map((status, idx) => (
                  <option key={idx} value={status}>
                    {status === "All" ? "All Statuses" : status}
                  </option>
                ))}
              </select>
            </div>

            {/* Count */}
            <div className="text-sm text-gray-500 ml-auto">
              {filteredProjects.length} project{filteredProjects.length !== 1 && "s"}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Project</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Documents</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProjects.map((project) => (
                  <tr key={project._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img
                        src={
                          Array.isArray(project.projectImages)
                            ? project.projectImages[0]?.url
                            : project.projectImages?.url
                        }
                        alt={project.title || "Project"}
                        className="w-12 h-9 object-cover rounded border border-gray-200"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        {project.client?.name || "N/A"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-500">{project.title}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{project.category}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{!isNaN(Number(project.estimatedBudget)) ? Number(project.estimatedBudget).toLocaleString() : "N/A"}
                      </div>
                      <div className="text-xs text-green-600">Final: ₹{project.finalBudget || "0"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded ${project.status === "In-Process"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-green-50 text-green-700"
                          }`}
                      >
                        {project.status}
                      </span>
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

                    <td className="px-4 py-3 text-sm text-gray-700">
                      {project.startingDate
                        ? new Date(project.startingDate).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className="text-gray-500 hover:text-blue-600 p-1 rounded"
                        onClick={() => router.push(`/client/projects/${project._id}`)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No matching projects found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsList;

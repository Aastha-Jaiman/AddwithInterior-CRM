"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { getProjectById } from "@/services/project.services";
import { useRouter } from "next/navigation";

const ClientProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        setProject(response.data.project); // updated based on data structure
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Project not found</p>
        </div>
      </div>
    );
  }

  const mainImage = project.projectImages?.[0]?.url || "https://via.placeholder.com/64";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase().replace(/[-_ ]/g, "")) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "inprocess":
      case "inprogress":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex items-center text-sm text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Back
              </button>
              <h1 className="text-2xl font-semibold text-gray-900">Project Details</h1>
            </div>
          </div>

          {/* Title Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={mainImage}
                alt="Project"
                className="w-20 h-20 rounded-lg border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{project.title}</h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                    {project.category?.replaceAll("_", " ") || "N/A"}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status?.replaceAll("_", " ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Budget & Client Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6 lg:col-span-2">
              {/* Budget Section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Estimated Budget</p>
                    <p className="text-gray-900 font-semibold">
                      ₹{!isNaN(Number(project.estimatedBudget)) ? Number(project.estimatedBudget).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Final Budget</p>
                    <p className="text-gray-900 font-semibold">
                      ₹{!isNaN(Number(project.finalBudget)) ? Number(project.finalBudget).toLocaleString() : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Starting Date</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {project.startingDate ? new Date(project.startingDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900 font-medium text-sm">{project.location || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                    <p className="text-gray-900 font-medium">{project.client?.name || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-gray-900 font-medium">{project.client?.phone || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{project.client?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-500" />
                Documents
              </h3>

              {project.designs?.length > 0 ? (
                <div className="space-y-4">
                  {project.designs.map((design, designIndex) => (
                    <div key={design._id || designIndex} className="space-y-3">
                      {design.pdfs?.map((pdf, pdfIndex) => (
                        <div key={pdf._id || pdfIndex} className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              Document {designIndex + 1}.{pdfIndex + 1}
                            </p>
                            <p className="text-sm text-gray-600">{pdf.message || "Untitled Design PDF"}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded: {new Date(pdf.uploadedAt).toLocaleString("en-IN")}
                            </p>
                            {pdf.uploadedBy && (
                              <p className="text-xs text-gray-400">
                                By: {pdf.uploadedBy.name} ({pdf.uploadedBy.email})
                              </p>
                            )}
                          </div>
                          <a
                            href={pdf.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            <Download />
                          </a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No documents uploaded yet</p>
                </div>
              )}
              
            </div>
          </div>

          {/* Team Info */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Team Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["salesperson", "designer", "carpenter"].map((role) => (
                <div key={role} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                  <p className="text-gray-900 font-medium">{project[role]?.name || "N/A"}</p>
                  <p className="text-gray-900 font-medium">{project[role]?.phone || "N/A"}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Project Images */}
          {project.projectImages?.length > 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Project Images</h3>
                <span className="text-sm text-gray-500">{project.projectImages.length} images</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {project.projectImages.map((img, index) => (
                  <img
                    key={index}
                    src={img.url || "https://via.placeholder.com/150"}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default ClientProjectDetails;

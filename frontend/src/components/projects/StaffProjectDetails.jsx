"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Upload, X, Send, Download, Trash2 } from "lucide-react";
import { getProjectById } from "@/services/project.services";
import { useRouter } from "next/navigation";
import { uploadDesign, deletePdfFromDesign } from "@/services/design.services";
import { useSelector } from "react-redux";

const StaffProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    message: "",
    pdf: null,
  });
  const [deletingPdf, setDeletingPdf] = useState(null);
  const [uploadingDesign, setUploadingDesign] = useState(false); // Track upload state
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        setProject(response.data.project);
        console.log("response", response);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProject();
  }, [id]);

  const handleUploadDesign = () => {
    setShowUploadForm(true);
    setTimeout(() => {
      document.getElementById("upload-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleCloseForm = () => {
    setShowUploadForm(false);
    setUploadData({ message: "", pdf: null });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setUploadData((prev) => ({ ...prev, pdf: file }));
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadData.pdf) {
      return;
    }

    setUploadingDesign(true); // Disable button during upload

    const formData = new FormData();
    formData.append("pdf", uploadData.pdf);
    formData.append("message", uploadData.message);

    try {
      await uploadDesign(id, formData);

      // Re-fetch the updated project data
      const response = await getProjectById(id);
      setProject(response.data.project);

      // Close the modal and reset form
      setUploadData({ message: "", pdf: null });
      handleCloseForm();
    } catch (error) {
      console.error("Error uploading design:", error);
    } finally {
      setUploadingDesign(false); // Re-enable button
    }
  };

  // Handle PDF deletion
  const handleDeletePdf = async (designId, pdfId) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) {
      return;
    }

    setDeletingPdf(pdfId);
    try {
      await deletePdfFromDesign(designId, pdfId);

      // Re-fetch the updated project data
      const response = await getProjectById(id);
      setProject(response.data.project);

      console.log("PDF deleted successfully");
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert("Failed to delete PDF. Please try again.");
    } finally {
      setDeletingPdf(null);
    }
  };

  // Check if user has permission to delete PDFs
  const canDeletePdf = (pdf) => {
    return (
      user?.permission?.includes("delete_design") ||
      pdf.uploadedBy?._id === user?._id
    );
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
      </div>
    );

  if (!project)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Project not found</p>
        </div>
      </div>
    );

  const mainImage =
    project.projectImages?.[0]?.url || "https://via.placeholder.com/64";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200";
      case "in_progress":
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
              <h1 className="text-2xl font-semibold text-gray-900">
                Project Details
              </h1>
            </div>
            <div className="flex gap-2">
              {user?.permission?.includes("upload_design") && (
                <button
                  onClick={handleUploadDesign}
                  disabled={showUploadForm || uploadingDesign}
                  className={`flex items-center text-sm text-white px-4 py-2 rounded-lg transition-colors ${showUploadForm || uploadingDesign
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingDesign ? "Uploading..." : "Upload Design"}
                </button>
              )}
              {user?.permission?.includes("upload_daily_updates") && (
                <button
                  onClick={handleUploadDesign}
                  className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Daily Updates
                </button>
              )}
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
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {project.title}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full border border-gray-200">
                    {project.category.replaceAll("_", " ")}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {project.status?.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Combined Section: Budget, Customer Info, and Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Budget & Timeline */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Estimated Budget</p>
                    <p className="text-gray-900 font-semibold">
                      ₹{!isNaN(Number(project.estimatedBudget))
                        ? Number(project.estimatedBudget).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Final Budget</p>
                    <p className="text-gray-900 font-semibold">
                      ₹{!isNaN(Number(project.finalBudget))
                        ? Number(project.finalBudget).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Starting Date</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {project.startingDate
                        ? new Date(project.startingDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900 font-medium text-sm">{project.location || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                    <p className="text-gray-900 font-medium">{project.client?.name || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-gray-900 font-medium">{project.client?.phone || "N/A"}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 sm:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{project.client?.email || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Info - Right Column */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
              <h3 className="font-semibold text-gray-900 mb-4">Team Information</h3>
              <div className="space-y-4">
                {[
                  { role: "salesperson", data: project.salesperson },
                  { role: "designer", data: project.designer },
                  { role: "carpenter", data: project.carpenter }
                ].map(({ role, data }) => (
                  <div
                    key={role}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col"
                  >
                    <span className="text-xs text-gray-500 mb-2">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-10 mb-1">
                      <span className="text-gray-900 font-medium">{data?.name || "N/A"}</span>
                      <span className="text-gray-900 font-medium">{data?.phone || "N/A"}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{data?.email || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Right Column: Documents */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Documents
            </h3>
            {project.designs?.length > 0 ? (
              <div className="space-y-4">
                {project.designs.map((design, designIndex) => (
                  <div key={design._id || designIndex} className="space-y-3">
                    {design.pdfs?.map((pdf, pdfIndex) => {
                      // Filter feedback for this specific PDF's version
                      const pdfFeedbackHistory = (design.approvalHistory || []).filter(
                        (h) => h.versionSelect === pdf.version
                      );

                      return (
                        <div key={pdf._id || pdfIndex} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-800 mb-1">
                                Document {designIndex + 1}.{pdfIndex + 1}
                              </p>
                              <p className="text-sm text-gray-600">
                                {pdf.message || "Untitled Design PDF"}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                Uploaded:{" "}
                                {new Date(pdf.uploadedAt).toLocaleString("en-IN")}
                              </p>
                              {pdf.uploadedBy && (
                                <p className="text-xs text-gray-400">
                                  By: {pdf.uploadedBy.name} (
                                  {pdf.uploadedBy.email})
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <a
                                href={pdf.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 p-1"
                                title="Download PDF"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                              {canDeletePdf(pdf) && (
                                <button
                                  onClick={() =>
                                    handleDeletePdf(design._id, pdf._id)
                                  }
                                  disabled={deletingPdf === pdf._id}
                                  className="text-red-600 hover:text-red-800 p-1 disabled:opacity-50"
                                  title="Delete PDF"
                                >
                                  {deletingPdf === pdf._id ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Feedback history for this specific PDF */}
                          {pdfFeedbackHistory.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-semibold mb-2 text-gray-700">Approval History</h4>
                              <ul className="space-y-2 text-gray-600 text-sm">
                                {pdfFeedbackHistory.map((h, hi) => (
                                  <li key={h._id || hi} className="border-b pb-1">
                                    <span className={`mr-2 font-bold ${h.isApproved ? "text-green-700" : "text-red-700"}`}>
                                      {h.isApproved ? "Approved" : "Rejected"}
                                    </span>
                                    (Document {designIndex + 1} Version {h.versionSelect}) - {h.feedbackMessage}
                                    <span className="ml-2 text-xs text-gray-400">
                                      {h.updatedAt ? new Date(h.updatedAt).toLocaleDateString("en-IN") : ""}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  No documents uploaded yet
                </p>
              </div>
            )}
          </div>


          {/* All Project Images */}
          {project.projectImages?.length > 1 && (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Project Images</h3>
                <span className="text-sm text-gray-500">
                  {project.projectImages.length} images
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {project.projectImages.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img.url || "https://via.placeholder.com/150"}
                      alt={`Project image ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Design Form */}
          {showUploadForm && (
            <div
              id="upload-form"
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-500" />
                  Upload Design
                </h3>
                <button
                  onClick={handleCloseForm}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploadingDesign}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={uploadData.message}
                    onChange={(e) =>
                      setUploadData((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Enter message for the document"
                    required
                    disabled={uploadingDesign}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload PDF
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    disabled={uploadingDesign}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded transition-colors ${uploadingDesign
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    disabled={uploadingDesign}
                  >
                    {uploadingDesign ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffProjectDetails;

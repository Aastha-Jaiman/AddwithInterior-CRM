"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Download, MessageCircle } from "lucide-react";
import { getProjectById } from "@/services/project.services";
import { addFeedbackToDesign } from "@/services/design.services";
import { useRouter } from "next/navigation";

const ClientProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Feedback state per design/pdf
  const [openFeedback, setOpenFeedback] = useState({ designId: null, pdfId: null });
  const [feedbackForms, setFeedbackForms] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState({});
  const [feedbackError, setFeedbackError] = useState({});

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(id);
        setProject(response.data.project);
      } catch (error) {
        console.error("Failed to fetch project:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProject();
  }, [id]);

  // Handle feedback input change
  const handleFeedbackChange = (designId, pdfId, field, value) => {
    setFeedbackForms(prev => ({
      ...prev,
      [`${designId}_${pdfId}`]: {
        ...prev[`${designId}_${pdfId}`],
        [field]: value,
      },
    }));
  };

  // Submit feedback
  const handleFeedbackSubmit = async (designId, pdfId) => {
    const form = feedbackForms[`${designId}_${pdfId}`] || {};
    setFeedbackLoading(prev => ({ ...prev, [`${designId}_${pdfId}`]: true }));
    setFeedbackError(prev => ({ ...prev, [`${designId}_${pdfId}`]: null }));

    if (
      form.isApproved === undefined ||
      form.isApproved === "" ||
      !form.feedbackMessage ||
      form.versionSelect === undefined ||
      form.versionSelect === "" ||
      isNaN(Number(form.versionSelect))
    ) {
      setFeedbackError(prev => ({
        ...prev,
        [`${designId}_${pdfId}`]: "All fields are required",
      }));
      setFeedbackLoading(prev => ({ ...prev, [`${designId}_${pdfId}`]: false }));
      return;
    }

    try {
      await addFeedbackToDesign(designId, {
        isApproved: form.isApproved === "true" || form.isApproved === true,
        feedbackMessage: form.feedbackMessage,
        versionSelect: Number(form.versionSelect),
      });
      setFeedbackForms(prev => ({ ...prev, [`${designId}_${pdfId}`]: {} }));
      setOpenFeedback({ designId: null, pdfId: null });

      const response = await getProjectById(id);
      setProject(response.data.project);
    } catch (error) {
      setFeedbackError(prev => ({
        ...prev,
        [`${designId}_${pdfId}`]:
          error?.response?.data?.error || "Error submitting feedback",
      }));
    } finally {
      setFeedbackLoading(prev => ({ ...prev, [`${designId}_${pdfId}`]: false }));
    }
  };

  const handleCloseForm = () => setOpenFeedback({ designId: null, pdfId: null });

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
              <h1 className="text-2xl font-semibold text-gray-900">
                Project Details
              </h1>
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
                    {project.category?.replaceAll("_", " ") || "N/A"}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(project.status)}`}
                  >
                    {project.status?.replaceAll("_", " ") || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Budget & Client Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN (Budget & Timeline + Customer) */}
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

              {/* Customer Information */}
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

            {/* TEAM INFORMATION RIGHT COLUMN */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
              <h3 className="font-semibold text-gray-900 mb-4">Team Information</h3>
              <div className="space-y-4">
                {["salesperson", "designer", "carpenter"].map((role) => (
                  <div
                    key={role}
                    className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col"
                  >
                    <span className="text-xs text-gray-500 mb-1">
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                    <div className="flex gap-3 justify-between">
                      <span className="text-gray-900 font-medium">{project[role]?.name || "N/A"}</span>
                      <span className="text-gray-900 font-medium">{project[role]?.phone || "N/A"}</span>
                    </div>
                    <span className="text-gray-900 font-medium">{project[role]?.email || "N/A"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Documents Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              Documents
            </h3>

            {/* Designs */}
            {project.designs?.length > 0 ? (
              <div className="space-y-8">
                {project.designs.map((design, designIndex) => (
                  <div key={design._id || designIndex}>
                    {/* PDFs list */}
                    <div className="space-y-3">
                      {design.pdfs?.map((pdf, pdfIndex) => {
                        const isFormOpen =
                          openFeedback.designId === design._id && openFeedback.pdfId === pdf._id;
                        const feedbackKey = `${design._id}_${pdf._id}`;

                        // Filter feedback for this pdf's version
                        const pdfFeedbackHistory = (design.approvalHistory || []).filter(
                          (h) => h.versionSelect === pdf.version
                        );

                        return (
                          <div key={pdf._id || pdfIndex} className="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 mb-2">
                            <div className="flex items-center justify-between">
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
                              <div className="flex items-center gap-2">
                                <a
                                  href={pdf.pdfUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 text-sm font-medium hover:underline"
                                >
                                  <Download />
                                </a>
                                <button
                                  type="button"
                                  className={`flex items-center gap-1 text-blue-600 hover:text-blue-800 ${isFormOpen ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  title="Give Feedback"
                                  disabled={isFormOpen}
                                  onClick={() =>
                                    !isFormOpen &&
                                    setOpenFeedback({ designId: design._id, pdfId: pdf._id })
                                  }
                                >
                                  <MessageCircle className="w-5 h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Feedback form */}
                            {isFormOpen && (
                              <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                <h4 className="text-base font-semibold mb-2 text-gray-800">
                                  Add Feedback For This Design
                                </h4>
                                <form
                                  onSubmit={e => {
                                    e.preventDefault();
                                    handleFeedbackSubmit(design._id, pdf._id);
                                  }}
                                  className="space-y-3"
                                >
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Is Approved?
                                    </label>
                                    <select
                                      value={feedbackForms[feedbackKey]?.isApproved ?? ""}
                                      onChange={e =>
                                        handleFeedbackChange(
                                          design._id,
                                          pdf._id,
                                          "isApproved",
                                          e.target.value
                                        )
                                      }
                                      required
                                      className="border rounded p-2 w-full"
                                    >
                                      <option value="">Select</option>
                                      <option value="true">Approved</option>
                                      <option value="false">Not Approved</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Feedback Message
                                    </label>
                                    <input
                                      type="text"
                                      value={feedbackForms[feedbackKey]?.feedbackMessage ?? ""}
                                      onChange={e =>
                                        handleFeedbackChange(
                                          design._id,
                                          pdf._id,
                                          "feedbackMessage",
                                          e.target.value
                                        )
                                      }
                                      className="border rounded p-2 w-full"
                                      required
                                      placeholder="Enter your feedback"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Version
                                    </label>
                                    <input
                                      type="number"
                                      value={feedbackForms[feedbackKey]?.versionSelect ?? ""}
                                      onChange={e =>
                                        handleFeedbackChange(
                                          design._id,
                                          pdf._id,
                                          "versionSelect",
                                          e.target.value
                                        )
                                      }
                                      className="border rounded p-2 w-full"
                                      required
                                      min={1}
                                      placeholder="Enter version number"
                                    />
                                  </div>
                                  {feedbackError[feedbackKey] && (
                                    <p className="text-xs text-red-600">
                                      {feedbackError[feedbackKey]}
                                    </p>
                                  )}
                                  <div className="flex gap-2">
                                    <button
                                      type="submit"
                                      className={`bg-blue-600 text-white px-4 py-1 rounded ${feedbackLoading[feedbackKey]
                                          ? "opacity-50 cursor-not-allowed"
                                          : ""
                                        }`}
                                      disabled={feedbackLoading[feedbackKey]}
                                    >
                                      {feedbackLoading[feedbackKey] ? "Submitting..." : "Submit Feedback"}
                                    </button>
                                    <button
                                      type="button"
                                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300"
                                      onClick={handleCloseForm}
                                    >
                                      Close
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* Feedback history for this specific PDF */}
                            {pdfFeedbackHistory.length > 0 && (
                              <div className="mt-3">
                                <h4 className="text-sm font-semibold mb-2 text-gray-700">Feedback History</h4>
                                <ul className="space-y-2 text-gray-600 text-sm">
                                  {pdfFeedbackHistory.map((h, hi) => (
                                    <li key={hi} className="border-b pb-1">
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



          {/* Project Images */}
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

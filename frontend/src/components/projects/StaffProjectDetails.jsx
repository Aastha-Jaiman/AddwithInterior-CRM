
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Upload, X, Download, Trash2 } from "lucide-react";
import { getProjectById } from "@/services/project.services";
import { useRouter } from "next/navigation";
import { uploadDesign, deletePdfFromDesign } from "@/services/design.services";
import { useSelector } from "react-redux";
import { uploadDailyUpdate, getAllDailyUpdates } from "@/services/dailyupdates.services";

const StaffProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({ message: "", pdf: null });
  const [deletingPdf, setDeletingPdf] = useState(null);
  const [uploadingDesign, setUploadingDesign] = useState(false);
  const user = useSelector((state) => state.auth.user);

  const [dailyUpdates, setDailyUpdates] = useState([]);
  const [showDailyUpdateForm, setShowDailyUpdateForm] = useState(false);
  const [dailyUpdateData, setDailyUpdateData] = useState({
    type: "",
    message: "",
    images: [],
  });
  const [uploadingDailyUpdate, setUploadingDailyUpdate] = useState(false);

  // Success messages & timer refs
  const [dailyUpdateSuccessMsg, setDailyUpdateSuccessMsg] = useState("");
  const [designSuccessMsg, setDesignSuccessMsg] = useState("");
  const dailyUpdateTimerRef = useRef(null);
  const designTimerRef = useRef(null);

  // Fetch project details
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

  // Fetch daily updates for project
  useEffect(() => {
    const fetchDailyUpdates = async () => {
      try {
        const response = await getAllDailyUpdates();
        const updates =
          Array.isArray(response.data?.updates)
            ? response.data.updates
            : Array.isArray(response.data)
              ? response.data
              : [];
        const projectUpdates = updates.filter((u) => u.project === id);
        setDailyUpdates(projectUpdates);
      } catch (error) {
        console.error("Failed to fetch daily updates:", error);
      }
    };
    if (id) fetchDailyUpdates();
  }, [id]);

  // Helper: success message with auto-hide
  const showSuccessMessage = (setter, timerRef, message) => {
    setter(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setter("");
      timerRef.current = null;
    }, 10000);
  };

  // Upload handlers
  const handleUploadDailyUpdate = () => {
    setShowDailyUpdateForm(true);
    setTimeout(() => {
      document.getElementById("daily-update-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  const handleCloseDailyUpdateForm = () => {
    setShowDailyUpdateForm(false);
    setDailyUpdateData({ type: "", message: "", images: [] });
  };

  const handleDailyUpdateImageChange = (e) => {
    setDailyUpdateData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmitDailyUpdate = async (e) => {
    e.preventDefault();
    if (!dailyUpdateData.type) return;
    setUploadingDailyUpdate(true);
    setDailyUpdateSuccessMsg("");

    const formData = new FormData();
    formData.append("type", dailyUpdateData.type);
    formData.append("message", dailyUpdateData.message);
    dailyUpdateData.images.forEach((image) => formData.append("images", image));

    try {
      await uploadDailyUpdate(id, formData);
      const response = await getAllDailyUpdates();
      const updates =
        Array.isArray(response.data?.updates)
          ? response.data.updates
          : Array.isArray(response.data)
            ? response.data
            : [];
      const projectUpdates = updates.filter((u) => u.project === id);
      setDailyUpdates(projectUpdates);

      setDailyUpdateData({ type: "", message: "", images: [] });
      handleCloseDailyUpdateForm();

      showSuccessMessage(
        setDailyUpdateSuccessMsg,
        dailyUpdateTimerRef,
        "Successfully uploaded daily update!"
      );
    } catch (error) {
      console.error("Error uploading daily update:", error);
    } finally {
      setUploadingDailyUpdate(false);
    }
  };

  // --- Design handlers ---
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
    if (!uploadData.pdf) return;
    setUploadingDesign(true);

    const formData = new FormData();
    formData.append("pdf", uploadData.pdf);
    formData.append("message", uploadData.message);

    try {
      await uploadDesign(id, formData);
      const response = await getProjectById(id);
      setProject(response.data.project);
      setUploadData({ message: "", pdf: null });
      handleCloseForm();

      showSuccessMessage(
        setDesignSuccessMsg,
        designTimerRef,
        "Successfully uploaded design!"
      );
    } catch (error) {
      console.error("Error uploading design:", error);
    } finally {
      setUploadingDesign(false);
    }
  };

  const handleDeletePdf = async (designId, pdfId) => {
    if (!window.confirm("Are you sure you want to delete this PDF?")) return;
    setDeletingPdf(pdfId);
    try {
      await deletePdfFromDesign(designId, pdfId);
      const response = await getProjectById(id);
      setProject(response.data.project);
    } catch (error) {
      console.error("Error deleting PDF:", error);
      alert("Failed to delete PDF. Please try again.");
    } finally {
      setDeletingPdf(null);
    }
  };

  const canDeletePdf = (pdf) =>
    user?.permission?.includes("delete_design") ||
    pdf.uploadedBy?._id === user?._id;

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

  const mainImage = project.projectImages?.[0]?.url || "https://via.placeholder.com/64";

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
                  onClick={handleUploadDailyUpdate}
                  disabled={showDailyUpdateForm || uploadingDailyUpdate}
                  className={`flex items-center text-sm text-white px-4 py-2 rounded-lg transition-colors ${showDailyUpdateForm || uploadingDailyUpdate
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingDailyUpdate ? "Uploading..." : "Upload Daily Update"}
                </button>
              )}
            </div>
          </div>

          {/* Success message for design upload */}
          {designSuccessMsg && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
              <span>{designSuccessMsg}</span>
              <button
                onClick={() => {
                  setDesignSuccessMsg("");
                  if (designTimerRef.current) {
                    clearTimeout(designTimerRef.current);
                    designTimerRef.current = null;
                  }
                }}
                className="text-green-700 font-bold px-2 py-1 hover:text-green-900"
              >
                Cancel
              </button>
            </div>
          )}

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

          {/* Documents */}
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
            <div id="upload-form" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
                {/* ...fields... */}
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

          {/* Daily update success message */}
          {dailyUpdateSuccessMsg && (
            <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-300 flex justify-between items-center">
              <span>{dailyUpdateSuccessMsg}</span>
              <button
                onClick={() => {
                  setDailyUpdateSuccessMsg("");
                  if (dailyUpdateTimerRef.current) {
                    clearTimeout(dailyUpdateTimerRef.current);
                    dailyUpdateTimerRef.current = null;
                  }
                }}
                className="text-green-700 font-bold px-2 py-1 hover:text-green-900"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Daily Update Form */}
          {showDailyUpdateForm && (
            <div id="daily-update-form" className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-gray-500" /> Upload Daily Update
                </h3>
                <button
                  onClick={handleCloseDailyUpdateForm}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploadingDailyUpdate}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSubmitDailyUpdate}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    className="w-full border border-gray-300 p-2 rounded"
                    value={dailyUpdateData.type}
                    onChange={(e) => setDailyUpdateData((prev) => ({ ...prev, type: e.target.value }))}
                    required
                    disabled={uploadingDailyUpdate}
                  >
                    <option value="">Select Type</option>
                    <option value="morning">Morning</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={dailyUpdateData.message}
                    onChange={(e) => setDailyUpdateData((prev) => ({ ...prev, message: e.target.value }))}
                    placeholder="Enter update message"
                    required
                    disabled={uploadingDailyUpdate}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleDailyUpdateImageChange}
                    disabled={uploadingDailyUpdate}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded transition-colors ${uploadingDailyUpdate ? "bg-gray-400 text-white cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    disabled={uploadingDailyUpdate}
                  >
                    {uploadingDailyUpdate ? "Uploading..." : "Upload"}
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

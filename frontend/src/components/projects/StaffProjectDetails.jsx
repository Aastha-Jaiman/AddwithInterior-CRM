"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Upload, X, Send, Download } from "lucide-react";
import { getProjectById } from "@/services/project.services";
import { useRouter } from "next/navigation";
import { uploadDesign } from "@/services/design.services";

const StaffProjectDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    message: "",
    pdf: null
  });

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
      document.getElementById('upload-form')?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
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
      setUploadData(prev => ({ ...prev, pdf: file }));
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uploadData.pdf) {
      return;
    }

    const formData = new FormData();
    formData.append("pdf", uploadData.pdf);

    // If your backend accepts a message as well, uncomment this:
    formData.append("message", uploadData.message); // optional

    try {
      await uploadDesign(id, formData); // `id` is your projectId

      // Re-fetch the updated project data
      const response = await getProjectById(id);
      setProject(response.data.project);

      // Close the modal and reset form
      setUploadData({ message: "", pdf: null });
      handleCloseForm();
    } catch (error) {
      console.error("Error uploading design:", error);
    }
  };



  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
    </div>
  );

  if (!project) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <p className="text-lg text-gray-600">Project not found</p>
      </div>
    </div>
  );

  const mainImage = project.projectImages?.[0]?.url || "https://via.placeholder.com/64";

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
            <button
              onClick={handleUploadDesign}
              className="flex items-center text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Design
            </button>
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
                    {project.category.replaceAll("_", " ")}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status?.replaceAll("_", " ")}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">{project.description}</p>
          </div>


          {/* Combined Section: Budget, Customer Info, and Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-2">
              {/* Budget & Timeline */}
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
                      ₹{Number(project.finalBudget).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Starting Date</p>
                    <p className="text-gray-900 font-medium text-sm">
                      {new Date(project.startingDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg text-center">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900 font-medium text-sm">{project.location}</p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Customer Name</p>
                    <p className="text-gray-900 font-medium">{project.client?.name}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Phone Number</p>
                    <p className="text-gray-900 font-medium">{project.client?.phone}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900 font-medium">{project.client?.email}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
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
                        <div
                          key={pdf._id || pdfIndex}
                          className="flex items-center justify-between border border-gray-100 rounded-lg p-4 hover:bg-gray-50"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800 mb-1">
                              Document {designIndex + 1}.{pdfIndex + 1}
                            </p>
                            <p className="text-sm text-gray-600">
                              {pdf.message || "Untitled Design PDF"}
                            </p>
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Salesperson</p>
                <p className="text-gray-900 font-medium">{project.salesperson?.name}</p>
                <p className="text-gray-900 font-medium">{project.salesperson?.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Designer</p>
                <p className="text-gray-900 font-medium">{project.designer?.name}</p>
                <p className="text-gray-900 font-medium">{project.designer?.phone}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Carpenter</p>
                <p className="text-gray-900 font-medium">{project.carpenter?.name}</p>
                <p className="text-gray-900 font-medium">{project.carpenter?.phone}</p>
              </div>
            </div>
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
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 p-2 rounded"
                    value={uploadData.message}
                    onChange={(e) =>
                      setUploadData((prev) => ({ ...prev, message: e.target.value }))
                    }
                    placeholder="Enter message for the document"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload PDF</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setUploadData((prev) => ({ ...prev, pdf: e.target.files[0] }))
                    }
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Upload
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

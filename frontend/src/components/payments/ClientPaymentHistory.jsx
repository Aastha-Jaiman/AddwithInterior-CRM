"use client";
import { getClientProfile } from "@/services/client.services";
import React, { useEffect, useMemo, useState } from "react";

const PaymentHistory = () => {
  const [clientData, setClientData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Safely read selected project using optional chaining on array index
  const selectedProjectObj = useMemo(
    () => clientData?.project?.[selectedProject],
    [clientData, selectedProject]
  );
  const selectedProjectId = selectedProjectObj?._id;

  // Compute selectedPaymentHistory only when all inputs exist
  const selectedPaymentHistory = useMemo(() => {
    if (!clientData?._id || !selectedProjectId) return [];
    const clientIdStr = clientData._id?.toString?.();
    if (!clientIdStr) return []; 
    return clientData?.paymentHistory?.filter((history) => {
      const hClient = history?.client?.toString?.();
      const hProject = history?.project?.toString?.();
      return hClient === clientIdStr && hProject === selectedProjectId?.toString?.();
    }) || [];
  }, [clientData, selectedProjectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await getClientProfile();
        setClientData(res?.client || null);
        setFilteredProjects(res?.client?.project || []);
        console.log("res", res);
      } catch (error) {
        setError("Failed to load client data. Please try again.");
        // console.error("Error fetching client profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (clientData?.project) {
      const filtered = clientData.project.filter((project) => {
        const title = project?.title?.toLowerCase?.() || "";
        const category = project?.category?.toLowerCase?.() || "";
        const q = searchTerm?.toLowerCase?.() || "";
        return title.includes(q) || category.includes(q);
      });
      setFilteredProjects(filtered);
    }
  }, [searchTerm, clientData]);

  const getStatusBadge = (status) => {
    const statusStyles = {
      active:
        "bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300",
      pending:
        "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-300",
      completed:
        "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300",
      cancelled:
        "bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-red-300",
    };
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold tracking-wide border ${
          statusStyles[status?.toLowerCase?.()] ||
          "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300"
        }`}
        role="status"
      >
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
      </span>
    );
  };

  const calculateProgress = (received, total) => {
    const r = Number(received) || 0;
    const t = Number(total) || 0;
    if (t <= 0) return 0;
    return Math.min((r / t) * 100, 100);
  };

  const handleProjectSelect = (projectIndex) => {
    setSelectedProject(projectIndex);
    setIsDropdownOpen(false);
    setSearchTerm("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute inset-0 border-t-4 border-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading your data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full transition-all duration-300">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              {/* icon */}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!clientData?.project || clientData.project.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center items-center">
        <div className="text-center transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            {/* icon */}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600">
            No project data found for {clientData?.name || "this client"}.
          </p>
          <p className="text-gray-600 mt-2">
            Contact support or add a project to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Project Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your projects and payment history for {clientData?.name || ""}
          </p>
        </div>

        {/* Project Selection Dropdown */}
        <div className="mb-6 relative">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* icon */}
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen((p) => !p)}
                className="flex items-center justify-between w-64 px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 truncate">
                    {clientData?.project?.[selectedProject]?.title ||
                      "Select Project"}
                  </span>
                  <span className="text-sm text-gray-500">
                    {clientData?.project?.[selectedProject]?.category || ""}
                  </span>
                </div>
                <svg
                  className={`ml-2 h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredProjects?.length > 0 ? (
                    filteredProjects.map((project, index) => {
                      const originalIndex = clientData?.project?.findIndex(
                        (p) => p?.title === project?.title
                      );
                      return (
                        <button
                          key={`${project?._id || project?.title || index}`}
                          onClick={() =>
                            handleProjectSelect(
                              originalIndex > -1 ? originalIndex : 0
                            )
                          }
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {project?.title || "Untitled"}
                            </span>
                            <span className="text-sm text-gray-500">
                              {project?.category || ""}
                            </span>
                            <span className="text-xs text-gray-400 mt-1">
                              Budget: ₹
                              {project?.finalBudget?.toLocaleString?.() || "0"}
                            </span>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      No projects found matching "{searchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Backdrop to close dropdown */}
        {isDropdownOpen && (
          <div
            className="fixed inset-0 z-5"
            onClick={() => setIsDropdownOpen(false)}
          />
        )}

        {/* Project Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 transition-all duration-300">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {clientData?.project?.[selectedProject]?.title || "N/A"}
              </h2>
              {getStatusBadge(clientData?.project?.[selectedProject]?.status)}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Budget</p>
                <p className="text-xl font-bold text-gray-900">
                  ₹
                  {clientData?.project?.[selectedProject]?.finalBudget?.toLocaleString?.() ||
                    "0"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md inline-block">
                  {clientData?.project?.[selectedProject]?.category || "N/A"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">
                  Description
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {clientData?.project?.[selectedProject]?.description ||
                    "No description available"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-gray-600">
                  {clientData?.project?.[selectedProject]?.startingDate
                    ? new Date(
                        clientData.project[selectedProject].startingDate
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Payment History
            </h2>
            <p className="text-blue-100 mt-2">
              Complete overview of all transactions
            </p>
          </div>
          <div className="p-6 space-y-8">
            {selectedPaymentHistory?.length > 0 ? (
              selectedPaymentHistory.map((history, index) => (
                <div
                  key={history?._id || index}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200 transition-all duration-300"
                >
                  <div className="grid gap-6 md:grid-cols-3 mb-6">
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Total Price
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{history?.totalPrice?.toLocaleString?.() || "0"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Total Received
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        ₹{history?.totalReceived?.toLocaleString?.() || "0"}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        Pending
                      </p>
                      <p className="text-2xl font-bold text-amber-600">
                        ₹{history?.pending?.toLocaleString?.() || "0"}
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Payment Progress
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {Math.round(
                          calculateProgress(
                            history?.totalReceived || 0,
                            history?.totalPrice || 1
                          )
                        )}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${calculateProgress(
                            history?.totalReceived || 0,
                            history?.totalPrice || 1
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        Transaction Details
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Date & Time
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Message
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Receipt
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {history?.payments?.length > 0 ? (
                            history.payments.map((payment) => (
                              <tr
                                key={payment?._id}
                                className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                              >
                                <td className="px-6 py-4">
                                  <span className="text-lg font-bold text-green-600">
                                    ₹{payment?.amount?.toLocaleString?.() || "0"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-900">
                                      {payment?.date
                                        ? new Date(payment.date).toLocaleDateString(
                                            "en-US",
                                            {
                                              month: "short",
                                              day: "numeric",
                                              year: "numeric",
                                            }
                                          )
                                        : "N/A"}
                                    </div>
                                    <div className="text-gray-500">
                                      {payment?.date
                                        ? new Date(payment.date).toLocaleTimeString(
                                            "en-US",
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            }
                                          )
                                        : "N/A"}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                                    {payment?.message || "No message"}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  {payment?.file ? (
                                    <a
                                      href={payment.file}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm font-medium text-blue-600 hover:text-blue-800 underline"
                                    >
                                      Download Receipt
                                    </a>
                                  ) : (
                                    <span className="text-sm text-gray-500 italic">
                                      No Receipt Available
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="px-6 py-4 text-center text-gray-600"
                              >
                                No payment history available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-6 text-gray-600">
                No payment history available for {clientData?.name}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

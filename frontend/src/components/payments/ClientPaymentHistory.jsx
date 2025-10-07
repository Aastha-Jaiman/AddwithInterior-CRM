"use client";
import { getMyProjectPaymentHistory } from "@/services/paymenthistory.services";
import React, { useEffect, useMemo, useState } from "react";


const PaymentHistory = () => {
  const [data, setData] = useState([]);
  const [overallTotals, setOverallTotals] = useState({ totalSpent: 0, pending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Data fetching
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await getMyProjectPaymentHistory();
        setData(res.data || []);
        setFilteredProjects(res.data || []);
        setOverallTotals(res.overallTotals || { totalSpent: 0, pending: 0 });
      } catch (error) {
        setError("Failed to load payment history.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Filter projects for dropdown search
  useEffect(() => {
    if (!data) return;
    const q = searchTerm.toLowerCase();
    setFilteredProjects(
      (data || []).filter((proj) => {
        const title = proj.projectTitle?.toLowerCase() || "";
        const category = proj.category?.toLowerCase() || "";
        return title.includes(q) || category.includes(q);
      })
    );
  }, [searchTerm, data]);

  const selectedProjectObj = useMemo(() => data?.[selectedProject] || {}, [data, selectedProject]);

  // UI helpers
  const calculateProgress = (received, total) => {
    if (!+total) return 0;
    return Math.min((+received / +total) * 100, 100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-xl border p-8 max-w-md w-full">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600">No project payment data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Client Payment History
          </h1>
          <p className="text-gray-600 mt-1">Track your projects and payment records</p>
        </div>

        {/* Overall Totals */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-sm text-gray-500 mb-1">Overall Spent</div>
            <div className="text-2xl font-bold text-green-700">
              ₹{overallTotals.totalSpent.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="text-sm text-gray-500 mb-1">Overall Pending</div>
            <div className="text-2xl font-bold text-amber-700">
              ₹{overallTotals.pending.toLocaleString("en-IN")}
            </div>
          </div>
        </div>

        {/* Project Dropdown */}
        <div className="mb-8 flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={e => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            />
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredProjects.length ? (
                  filteredProjects.map((proj, idx) => {
                    const index = data.findIndex(p => p.projectTitle === proj.projectTitle);
                    return (
                      <button
                        key={proj.projectId || proj.projectTitle || idx}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0"
                        onClick={() => {
                          setSelectedProject(index > -1 ? index : 0);
                          setIsDropdownOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        <div className="font-medium text-gray-900">{proj.projectTitle || "Untitled"}</div>
                        <div className="text-sm text-gray-500">{proj.category}</div>
                        <div className="text-xs text-gray-400 mt-1">Budget: ₹{proj.totalPrice.toLocaleString("en-IN")}</div>
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

        {/* Project Details */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedProjectObj.projectTitle || "N/A"}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold tracking-wide border bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-300">
                {selectedProjectObj.category || "N/A"}
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Budget</p>
                <p className="text-xl font-bold text-gray-900">₹{selectedProjectObj.totalPrice?.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-green-600">₹{selectedProjectObj.totalSpent?.toLocaleString("en-IN")}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-xl font-bold text-amber-600">₹{selectedProjectObj.pending?.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Payment History
            </h2>
            <p className="text-blue-100 mt-2">Complete overview of all transactions for selected project</p>
          </div>
          <div className="p-6">
            {selectedProjectObj?.payments?.length ? (
              <>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Payment Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(calculateProgress(selectedProjectObj.totalSpent, selectedProjectObj.totalPrice))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${calculateProgress(selectedProjectObj.totalSpent, selectedProjectObj.totalPrice)}%`
                      }}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedProjectObj.payments.map(payment => (
                        <tr key={payment._id}>
                          <td className="px-6 py-4 font-bold text-green-600">₹{payment.amount?.toLocaleString("en-IN")}</td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="font-medium text-gray-900">
                                {payment.date
                                  ? new Date(payment.date).toLocaleDateString("en-IN", {
                                    month: "short", day: "numeric", year: "numeric",
                                  })
                                  : "N/A"}
                              </div>
                              <div className="text-gray-500">
                                {payment.date
                                  ? new Date(payment.date).toLocaleTimeString("en-IN", {
                                    hour: "2-digit", minute: "2-digit"
                                  })
                                  : "N/A"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                              {payment.message || "No message"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="text-center p-6 text-gray-600">
                No payment history available for this project.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;

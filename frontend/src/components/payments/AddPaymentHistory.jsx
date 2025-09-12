"use client"
import React, { useEffect, useMemo, useState } from "react";
import { addPayment } from "@/services/paymenthistory.services";
import {
  getAllClientsEmail,
  getProjectsByClientEmail,
} from "@/services/quotation.services";

export default function AddPaymentPage() {
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [clientQuery, setClientQuery] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [clientDetails, setClientDetails] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(null);

  // Fetch all clients
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const clData = await getAllClientsEmail();
        setClients(clData || []);
      } catch (e) {
        setErr(e?.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Fetch projects when clientId changes
  useEffect(() => {
    if (!clientId) {
      setProjects([]);
      setClientDetails(null);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const selectedClient = clients.find((c) => c.email === clientId);
        setClientDetails(selectedClient || null);

        const prData = await getProjectsByClientEmail(clientId);
        setProjects(prData || []);
        console.log("prData", prData);
      } catch (e) {
        setErr(e?.message || "Failed to load projects for this client");
      } finally {
        setLoading(false);
      }
    })();
  }, [clientId, clients]);

  // Load project details when projectId changes
  useEffect(() => {
    if (!projectId) {
      setProjectDetails(null);
      return;
    }
    const pr = projects.find((p) => p._id === projectId);
    setProjectDetails(pr || null);
  }, [projectId, projects]);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setSuccess(null);

    if (Number(amount) > Number(projectDetails?.finalBudget || 0)) {
      setErr("Amount cannot be greater than final budget");
      setLoading(false);
      return;
    }

    try {
      await addPayment({
        clientId: clientDetails?._id,
        projectId,
        amount: Number(amount),
        message,
      });
      setSuccess("Payment added successfully!");

      // Reset form
      setAmount("");
      setMessage("");
      setClientId("");
      setProjectId("");
      setClientQuery("");
      setClientDetails(null);
      setProjectDetails(null);
    } catch (error) {
      setErr(error?.message || "Failed to save payment");
    } finally {
      setLoading(false);
    }
  };

  // Filtered clients for search
  const filteredClients = useMemo(() => {
    const q = clientQuery.trim().toLowerCase();
    return !q
      ? clients
      : clients.filter((c) =>
          `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q)
        );
  }, [clientQuery, clients]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Management
          </h1>
          <p className="text-gray-600">
            Record new payment transactions for your projects
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Add New Payment
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* --- Client Section (same as before) --- */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Client
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Client
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or phone"
                      value={clientQuery}
                      onChange={(e) => setClientQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                    <svg
                      className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Choose Client <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select a client...</option>
                    {filteredClients.length > 0 ? (
                      filteredClients.map((c) => (
                        <option key={c._id} value={c.email}>
                          {c.name} ({c.email})
                        </option>
                      ))
                    ) : (
                      <option disabled>No clients found</option>
                    )}
                  </select>
                </div>
              </div>

              {clientDetails && (
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Client Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">
                          Name:
                        </span>
                        <span className="text-gray-900">
                          {clientDetails.name}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">
                          Email:
                        </span>
                        <span className="text-gray-900">
                          {clientDetails.email}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">
                          Phone:
                        </span>
                        <span className="text-gray-900">
                          {clientDetails.phone || "Not provided"}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-20">
                          Aadhar:
                        </span>
                        <span className="text-gray-900">
                          {clientDetails.aadharCardNumber || "Not provided"}
                        </span>
                      </div>
                    </div>
                    {clientDetails.profile?.url && (
                      <div className="flex justify-center md:justify-end">
                        <img
                          src={clientDetails.profile.url}
                          alt="Client Profile"
                          className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Project Selection Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-sm">
                    2
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Select Project
                </h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose Project <span className="text-red-500">*</span>
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select a project...</option>
                  {projects.length > 0 ? (
                    projects.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title} ({p.category})
                      </option>
                    ))
                  ) : (
                    <option disabled>No projects found</option>
                  )}
                </select>
              </div>

              {projectDetails && (
                <div className="mt-6 p-6 bg-gradient-to-r from-gray-50 to-green-50 rounded-xl border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    Project Details
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Title:
                        </span>
                        <span className="text-gray-900">
                          {projectDetails.title}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Category:
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {projectDetails.category}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Status:
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          {projectDetails.status}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Location:
                        </span>
                        <span className="text-gray-900">
                          {projectDetails.location}
                        </span>
                      </div>
                      <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Budget:
                        </span>
                        <span className="text-gray-900 font-semibold text-lg">
                          ₹
                          {projectDetails.finalBudget?.toLocaleString() ||
                            "Not set"}
                        </span>
                      </div>
                      {/* <div className="flex items-start">
                        <span className="font-medium text-gray-600 w-24">
                          Client:
                        </span>
                        <span className="text-gray-900">
                          {projectDetails.client?.name} (
                          {projectDetails.client?.email})
                        </span>
                      </div> */}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">
                    3
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount Received <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  {projectDetails?.finalBudget && (
                    <p className="mt-2 text-sm text-gray-600">
                      Maximum allowed: ₹
                      {projectDetails.finalBudget.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Note
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Optional note about this payment..."
                  />
                </div>
              </div>
            </div>

            {/* Error and Success */}
            {err && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <svg
                  className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-600 mt-1">{err}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h3 className="text-green-800 font-medium">Success</h3>
                  <p className="text-green-600 mt-1">{success}</p>
                </div>
              </div>
            )}

            {/* Submit */}
           <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

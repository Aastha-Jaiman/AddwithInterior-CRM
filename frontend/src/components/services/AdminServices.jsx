"use client"
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Calendar, User, MapPin, Phone, Mail, Eye, CheckCircle, XCircle } from "lucide-react";
import { getAllServices } from "@/services/service.services";


const ServicesTable = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedVisits, setExpandedVisits] = useState({});
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const res = await getAllServices();

        // 👇 adjust based on actual API response shape
        const data = Array.isArray(res) ? res : res.data || [];

        setServices(data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError(err.message || "Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);


  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleVisitsExpansion = (id) => {
    setExpandedVisits((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === "estimatedBudget") return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(parseInt(amount));
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading services...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Services Management
        </h1>

        {/* Desktop Table */}
        <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Client</th>
                  <th className="px-6 py-4 text-left font-semibold">Project</th>
                  <th className="px-6 py-4 text-left font-semibold">Service Details</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <React.Fragment key={service._id}>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="font-medium">{service.client?.name}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {service.client?.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {service.client?.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <h3 className="font-medium text-gray-900">{service.project?.title}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-3 h-3 mr-1" />
                            {service.project?.location}
                          </div>
                          <div className="text-sm text-gray-600">
                            Category: {service.project?.category?.replace("_", " ")}
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            Budget: {formatCurrency(service.project?.finalBudget)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="font-medium">Duration:</span> {service.durationYears} years
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Visits:</span> {service.usedVisits}/{service.allowedVisits}
                          </div>
                          <div className="text-sm">
                            <span className="font-medium">Start Date:</span> {formatDate(service.startDate)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.project?.status === "In-Process"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                              }`}
                          >
                            {service.project?.status}
                          </span>
                          <div className="flex items-center">
                            {service.isExpired ? (
                              <XCircle className="w-4 h-4 text-red-500 mr-1" />
                            ) : (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                            )}
                            <span
                              className={`text-xs ${service.isExpired ? "text-red-600" : "text-green-600"}`}
                            >
                              {service.isExpired ? "Expired" : "Active"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleRowExpansion(service._id)}
                          className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {expandedRows[service._id] ? (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          ) : (
                            <ChevronRight className="w-4 h-4 mr-1" />
                          )}
                          View Details
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {expandedRows[service._id] && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            <h4 className="font-medium text-gray-900">Project Description</h4>
                            <p className="text-sm text-gray-600">{service.project?.description}</p>

                            <div className="flex items-center justify-between">
                              <h4 className="font-medium text-gray-900">
                                Visits ({service.visits?.length || 0})
                              </h4>
                              <button
                                onClick={() => toggleVisitsExpansion(service._id)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                {expandedVisits[service._id] ? "Hide Visits" : "Show All Visits"}
                              </button>
                            </div>

                            {expandedVisits[service._id] && (
                              <div className="grid gap-2 max-h-64 overflow-y-auto">
                                {service.visits?.map((visit, index) => (
                                  <div key={visit._id} className="bg-white p-3 rounded border">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="text-sm font-medium">Visit #{index + 1}</div>
                                        <div className="text-xs text-gray-500 flex items-center mt-1">
                                          <Calendar className="w-3 h-3 mr-1" />
                                          {formatDate(visit.visitDate)}
                                        </div>
                                      </div>
                                      <div className="text-xs text-gray-600 max-w-xs text-right">
                                        {visit.remarks}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesTable;

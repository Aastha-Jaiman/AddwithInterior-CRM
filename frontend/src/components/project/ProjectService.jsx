"use client";

import React from "react";
import {
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { createService, updateService } from "@/services/service.services";

export const ServiceActionButton = ({ selectedProject, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
    type="button"
  >
    <Edit3 className="w-4 h-4" />
    <span className="text-sm font-medium">
      {selectedProject.service ? "Update Service" : "Create Service"}
    </span>
  </button>
);

const ProjectService = ({ selectedProject, onClose }) => {
  const [panel, setPanel] = React.useState(selectedProject.service ? "update" : "create");

  // Create service form state
  const [serviceForm, setServiceForm] = React.useState({ durationYears: "", allowedVisits: "" });
  const [serviceLoading, setServiceLoading] = React.useState(false);
  const [serviceError, setServiceError] = React.useState("");

  // Update service form state
  const [updateForm, setUpdateForm] = React.useState({ remarks: "", visitDate: "" });
  const [updateLoading, setUpdateLoading] = React.useState(false);

  // Notice state for success/error messages
  const [serviceNotice, setServiceNotice] = React.useState({ show: false, type: "success", text: "" });

  React.useEffect(() => {
    if (!serviceNotice.show) return;
    const timeout = setTimeout(() => {
      setServiceNotice((prev) => ({ ...prev, show: false }));
    }, 2500);
    return () => clearTimeout(timeout);
  }, [serviceNotice.show]);

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setServiceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceError("");
    const duration = Number(serviceForm.durationYears);
    const visits = Number(serviceForm.allowedVisits);

    if (!Number.isFinite(duration) || duration <= 0) {
      const msg = "Duration must be a positive number";
      setServiceError(msg);
      setServiceNotice({ show: true, type: "error", text: msg });
      return;
    }
    if (!Number.isFinite(visits) || visits < 0) {
      const msg = "Allowed visits must be 0 or more";
      setServiceError(msg);
      setServiceNotice({ show: true, type: "error", text: msg });
      return;
    }

    try {
      setServiceLoading(true);
      await createService(selectedProject._id, {
        durationYears: duration,
        allowedVisits: visits,
      });
      setPanel(null);
      setServiceForm({ durationYears: "", allowedVisits: "" });
      setServiceNotice({ show: true, type: "success", text: "Service details saved successfully" });
      if (onClose) onClose();
    } catch (err) {
      const msg = typeof err === "string" ? err : err?.message || "Failed to save service";
      setServiceError(msg);
      setServiceNotice({ show: true, type: "error", text: msg });
    } finally {
      setServiceLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    if (!updateForm.remarks.trim()) {
      setServiceNotice({ show: true, type: "error", text: "Remarks are required" });
      return;
    }

    try {
      setUpdateLoading(true);
      const payload = { remarks: updateForm.remarks.trim() };
      if (updateForm.visitDate) payload.visitDate = updateForm.visitDate;

      await updateService(selectedProject.service._id, payload);
      setServiceNotice({ show: true, type: "success", text: "Service updated successfully" });
      setPanel(null);
      setUpdateForm({ remarks: "", visitDate: "" });
      if (onClose) onClose();
    } catch (err) {
      const msg = err?.message || err?.error || "Failed to update service";
      setServiceNotice({ show: true, type: "error", text: msg });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md max-w-lg">
      {/* Close button */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            setPanel(null);
            if (onClose) onClose();
          }}
          aria-label="Close service panel"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
          type="button"
        >
          ×
        </button>
      </div>

      {/* Create Service Form */}
      {panel === "create" && (
        <form onSubmit={handleServiceSubmit} className="mt-2 space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Create Service</h4>

          {serviceNotice.show && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                serviceNotice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}
            >
              {serviceNotice.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <div>{serviceNotice.text}</div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (years)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                name="durationYears"
                value={serviceForm.durationYears}
                onChange={handleServiceChange}
                required
                className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                placeholder="e.g. 2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Allowed Visits
              </label>
              <input
                type="number"
                min="0"
                step="1"
                name="allowedVisits"
                value={serviceForm.allowedVisits}
                onChange={handleServiceChange}
                required
                className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                placeholder="e.g. 4"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={serviceLoading}
              className={`flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none ${
                serviceLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {serviceLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Update Service Form */}
      {panel === "update" && (
        <form onSubmit={handleUpdateSubmit} className="mt-2 space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Update Service</h4>

          {serviceNotice.show && (
            <div
              role="alert"
              className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
                serviceNotice.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200"
                  : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200"
              }`}
            >
              {serviceNotice.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <XCircle className="h-5 w-5" />
              )}
              <div>{serviceNotice.text}</div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Remarks</label>
            <textarea
              name="remarks"
              value={updateForm.remarks}
              onChange={handleUpdateChange}
              required
              rows={3}
              className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
              placeholder="Add visit remarks..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visit Date (optional)</label>
            <input
              type="date"
              name="visitDate"
              value={updateForm.visitDate}
              onChange={handleUpdateChange}
              className="w-full rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={updateLoading}
              className={`flex-1 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none ${
                updateLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {updateLoading ? "Updating..." : "Update"}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Only admin or salesperson can add visits; service must be active and within allowed visits.
          </p>
        </form>
      )}
    </div>
  );
};

export default ProjectService;

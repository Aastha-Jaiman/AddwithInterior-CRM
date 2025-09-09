"use client";

import React from "react";
import {
  Edit3,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { createService, updateService } from "@/services/service.services";

export const ServiceActionButton = ({ selectedProject, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow hover:to-blue-700 transition-all w-fit"
    type="button"
  >
    <Edit3 className="w-4 h-4" />
    <span className="text-sm font-semibold tracking-wide">
      {selectedProject.service ? "Update Service" : "Create Service"}
    </span>
  </button>
);

const ProjectService = ({ selectedProject, onClose }) => {
  const [panel, setPanel] = React.useState(
    selectedProject.service ? "update" : "create"
  );

  // Create service form state
  const [serviceForm, setServiceForm] = React.useState({
    durationYears: "",
    allowedVisits: "",
  });
  const [serviceLoading, setServiceLoading] = React.useState(false);
  const [serviceError, setServiceError] = React.useState("");

  // Update service form state (added bill)
  const [updateForm, setUpdateForm] = React.useState({
    remarks: "",
    visitDate: "",
    bill: null,
  });
  const [updateLoading, setUpdateLoading] = React.useState(false);

  // Notice state for success/error messages
  const [serviceNotice, setServiceNotice] = React.useState({
    show: false,
    type: "success",
    text: "",
  });

  // Feedback message timer
  React.useEffect(() => {
    if (!serviceNotice.show) return;
    const timeout = setTimeout(() => {
      setServiceNotice((prev) => ({ ...prev, show: false }));
    }, 2000);
    return () => clearTimeout(timeout);
  }, [serviceNotice.show]);

  // Form field handlers
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
      setServiceForm({ durationYears: "", allowedVisits: "" });
      setServiceNotice({
        show: true,
        type: "success",
        text: "Service details saved successfully",
      });
      // Delay panel close for feedback visibility
      setTimeout(() => {
        setPanel(null);
        if (onClose) onClose();
      }, 1800);
    } catch (err) {
      const msg =
        typeof err === "string" ? err : err?.message || "Failed to save service";
      setServiceError(msg);
      setServiceNotice({ show: true, type: "error", text: msg });
    } finally {
      setServiceLoading(false);
    }
  };

  const handleUpdateChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "bill") {
      setUpdateForm((prev) => ({ ...prev, bill: files[0] }));
    } else {
      setUpdateForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!updateForm.remarks.trim()) {
      setServiceNotice({
        show: true,
        type: "error",
        text: "Remarks are required",
      });
      return;
    }
    try {
      setUpdateLoading(true);
      const payload = {
        remarks: updateForm.remarks.trim(),
        visitDate: updateForm.visitDate,
        bill: updateForm.bill,
      };
      await updateService(selectedProject.service._id, payload);
      setUpdateForm({ remarks: "", visitDate: "", bill: null });
      setServiceNotice({
        show: true,
        type: "success",
        text: "Service updated successfully",
      });
      // Delay panel close for feedback visibility
      setTimeout(() => {
        setPanel(null);
        if (onClose) onClose();
      }, 1800);
    } catch (err) {
      const msg = err?.message || err?.error || "Failed to update service";
      setServiceNotice({ show: true, type: "error", text: msg });
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <div className="my-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg max-w-full relative transition-shadow duration-300">
      <div className="flex justify-end">
        <button
          onClick={() => {
            setPanel(null);
            if (onClose) onClose();
          }}
          aria-label="Close service panel"
          className="text-gray-400 hover:text-rose-500 transition text-2xl font-bold"
          type="button"
        >
          ×
        </button>
      </div>

      {/* Feedback Message - always shown in panel */}
      {serviceNotice.show && (
        <div
          role="alert"
          className={`flex items-center gap-2 rounded-xl border p-3 text-sm font-medium shadow transition-all
            ${serviceNotice.type === "success"
              ? "border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900/30 dark:text-green-100"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900/30 dark:text-red-100"
            }`}
          style={{
            animation: "pop 0.35s cubic-bezier(.15,.91,.33,1.16)",
          }}
        >
          {serviceNotice.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0" />
          )}
          <div>{serviceNotice.text}</div>
        </div>
      )}

      {/* Animate feedback style */}
      <style>
        {`
          @keyframes pop {
            from { opacity: 0; transform: scale(0.90); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>

      {/* Update Service Form */}
      {panel === "update" && (
        <form
          onSubmit={handleUpdateSubmit}
          className="m-3 space-y-6"
        >
          <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3 tracking-wide">
            Update Service Details
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={updateForm.remarks}
              onChange={handleUpdateChange}
              required
              rows={3}
              className="
                w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                focus:outline-none focus:ring-2 focus:ring-blue-600 px-3 py-2
                transition-all duration-150
                shadow-sm"
              placeholder="Add visit remarks..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                Visit Date (optional)
              </label>
              <input
                type="date"
                name="visitDate"
                value={updateForm.visitDate}
                onChange={handleUpdateChange}
                className="
                  w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-600 px-3 py-2
                  shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">
                Upload Bill (optional)
              </label>
              <input
                type="file"
                name="bill"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleUpdateChange}
                className="
                  w-full text-sm rounded-xl border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800
                  file:text-blue-700 file:bg-blue-50 file:border-none file:px-4 file:py-2
                  file:rounded-xl file:shadow
                  "
              />
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={updateLoading}
              className={`
                flex-1 px-5 py-2 rounded-xl font-semibold text-lg tracking-wide
                bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition
                text-white shadow
                ${updateLoading ? "opacity-70 cursor-not-allowed" : ""}
              `}
            >
              {updateLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProjectService;

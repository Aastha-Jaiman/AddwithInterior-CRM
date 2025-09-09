"use client";

import { useState } from "react";
import { Download, ChevronDown, ChevronUp } from "lucide-react";

const VisitHistoryDropdown = ({ visits }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6 max-w-full">
      <button
        className="w-full flex justify-between items-center px-4 py-3 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="visit-history-list"
      >
        <span className="font-semibold text-gray-900">Visit History</span>
        <span className="text-gray-500">
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </span>
      </button>

      {isOpen && (
        <ul
          id="visit-history-list"
          className="mt-4 max-h-72 overflow-y-auto border border-gray-200 rounded-md bg-gray-50"
        >
          {visits && visits.length > 0 ? (
            visits.map((visit, idx) => (
              <li
                key={visit._id || idx}
                className="flex justify-between items-center border-b last:border-b-0 px-4 py-3 hover:bg-gray-100"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {new Date(visit.visitDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-xs text-gray-600">
                    <span className="font-semibold">Remarks: </span>
                    {visit.remarks || "No remarks"}
                  </span>
                  <span className="text-xs text-gray-600">
                    <span className="font-semibold">Invoice: </span>
                    {visit.bill || "No invoice"}
                  </span>
                </div>

                <button
                    onClick={() => {
                        if (visit.bill) {
                        window.open(visit.bill, "_blank", "noopener,noreferrer");
                        }
                    }}
                    disabled={!visit.bill}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${
                        visit.bill
                        ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    aria-label={visit.bill ? "Open invoice" : "Invoice not available"}
                    >
                    <Download className="w-4 h-4" />
                    Open
                </button>

              </li>
            ))
          ) : (
            <li className="px-4 py-3 text-gray-500 text-center">No visits recorded yet.</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default VisitHistoryDropdown;

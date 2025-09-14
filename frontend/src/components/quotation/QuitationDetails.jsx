"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  uploadFinalDocument,
  getFinalDocument,
  getQuotationById,
} from "@/services/quotation.services";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download } from "lucide-react";

// Utility classes for consistent styling
const card = "bg-white shadow-md border rounded-xl p-6";
const label = "text-gray-600 font-medium";
const heading = "text-xl md:text-2xl font-bold text-blue-700 mb-4 flex gap-2 items-center";
const btnBase =
  "flex items-center gap-2 px-4 py-2 rounded-md font-semibold transition";
const tableHeader =
  "bg-blue-50 text-blue-700 font-semibold uppercase text-xs";
const tableCell = "border p-3";

const QuotationDetails = () => {
  const { id } = useParams();
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchQuotation();
  }, [id]);

  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const data = await getQuotationById(id);
      setQuotation(data.data);
    } catch (error) {
      // error logging
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    try {
      const res = await uploadFinalDocument(id, file);
      alert(res.message);
      fetchQuotation();
    } catch (error) {
      // error logging
    }
  };

  const handleDownload = async () => {
    try {
      const response = await getFinalDocument(id);
      const fileUrl =
        response.finaldocument || response.data?.finaldocument;
      if (fileUrl) {
        const result = await fetch(fileUrl);
        const blob = await result.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "FinalQuotation.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      } else {
        alert("No document found");
      }
    } catch (error) {
      alert("Failed to download");
    }
  };

  const generatePDF = (quotation) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Quotation", 14, 20);
    doc.setFontSize(12);
    doc.text(`Client: ${quotation.client?.name || "N/A"}`, 14, 30);
    doc.text(`Email: ${quotation.client?.email || "N/A"}`, 14, 38);
    doc.text(`Project: ${quotation.project?.title || "N/A"}`, 14, 46);
    doc.text(`Category: ${quotation.project?.category || "N/A"}`, 14, 54);
    doc.text(
      `Date: ${new Date(quotation.createdAt).toLocaleDateString()}`,
      14,
      62
    );
    let currentY = 70;
    quotation.sections?.forEach((section, index) => {
      doc.setFontSize(14);
      doc.text(
        `Section: ${section.customSectionName || section.sectionName}`,
        14,
        currentY
      );
      const tableData = section.items.map((item, i) => [
        i + 1,
        item.itemName || "N/A",
        item.height || 0,
        item.width || 0,
        item.calculation || 0,
      ]);
      autoTable(doc, {
        head: [["#", "ItemName", "Height", "Width", "Calculation"]],
        body: tableData,
        startY: currentY + 5,
        theme: "grid",
        headStyles: { fillColor: [41, 128, 185] },
        styles: { fontSize: 10, cellPadding: 3 },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    });
    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${quotation.grandTotal || 0}`, 14, currentY + 5);
    doc.save(`quotation-${quotation._id}.pdf`);
  };

  if (loading)
    return (
      <div className="flex flex-col h-56 justify-center items-center">
        <div className="animate-spin text-blue-500">
          <Download className="w-8 h-8" />
        </div>
        <p className="mt-4 text-gray-500 font-medium">Loading...</p>
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">
      <div className={`${card} mb-6`}>
        <h2 className={heading}>Quotation Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          <div>
            <span className={label}>Client:</span>{" "}
            <span className="font-semibold text-gray-800">
              {quotation?.client?.name || "N/A"}
            </span>
          </div>
          <div>
            <span className={label}>Project:</span>{" "}
            <span className="font-semibold text-gray-800">
              {quotation?.project?.title || "N/A"}
            </span>
          </div>
          <div>
            <span className={label}>Category:</span>{" "}
            <span className="font-semibold text-gray-800">
              {quotation?.category || "N/A"}
            </span>
          </div>
          <div>
            <span className={label}>Grand Total:</span>{" "}
            <span className="font-semibold text-green-700 text-lg">
              ₹{quotation?.grandTotal || 0}
            </span>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => generatePDF(quotation)}
            className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}
          >
            <Download className="w-4 h-4" />
            Generate PDF
          </button>
          {quotation?.finaldocument && (
            <button
              onClick={handleDownload}
              className={`${btnBase} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              Download Final Quotation
            </button>
          )}
        </div>
        {!quotation?.finaldocument && (
          <form onSubmit={handleFileUpload} className="mt-6 rounded-lg bg-blue-50 p-4 max-w-lg space-y-3">
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files)}
              className="border border-gray-300 p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold w-full"
            >
              Upload Final Quotation
            </button>
          </form>
        )}
      </div>
      <div className={card}>
        <h3 className="text-lg font-bold text-blue-700 mb-4">
          Sections & Items
        </h3>
        {quotation?.sections?.length > 0 ? (
          quotation.sections.map((section, i) => (
            <div key={i} className="mb-6 rounded-lg border border-blue-100 p-4 shadow-sm bg-blue-50/40">
              <h4 className="font-bold text-blue-800 mb-2">
                {section.customSectionName || section.sectionName}
              </h4>
              <div className="overflow-x-auto">
                <table className="min-w-[800px] w-full border border-gray-300 rounded">
                  <thead>
                    <tr className={tableHeader}>
                      <th className={tableCell}>#</th>
                      <th className={tableCell}>Item Name</th>
                      <th className={tableCell}>Height</th>
                      <th className={tableCell}>Width</th>
                      <th className={tableCell}>Calculation</th>
                      <th className={tableCell}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {section.items.map((item, idx) => (
                      <tr key={idx} className="bg-white hover:bg-blue-100 transition">
                        <td className={tableCell}>{idx + 1}</td>
                        <td className={tableCell}>{item.itemName}</td>
                        <td className={tableCell}>{item.height}</td>
                        <td className={tableCell}>{item.width}</td>
                        <td className={tableCell}>{item.calculation}</td>
                        <td className={tableCell}>
                          ₹{item.total || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-400 text-base font-semibold">
            No sections found.
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationDetails;

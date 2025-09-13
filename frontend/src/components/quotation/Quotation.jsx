"use client";

import React, { useEffect, useState } from "react";
import { Download, FileText, Plus } from "lucide-react";
import { getAllQuotations } from "@/services/quotation.services";
import QuotationForm from "./QuotationUpload";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await getAllQuotations();
      console.log("API response:", response);
  
      if (Array.isArray(response)) {
        setQuotations(response);
      } else if (response && Array.isArray(response.data)) {
        // ✅ Your API actually sends quotations inside `data`
        setQuotations(response.data);
      } else if (response && Array.isArray(response.quotations)) {
        setQuotations(response.quotations);
      } else {
        setQuotations([]);
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };  

  // ✅ Generate PDF from fetched quotation
  const generatePDF = (quotation) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Quotation", 14, 20);

    // Client & Project Info
    doc.setFontSize(12);
    doc.text(`Client: ${quotation.client?.name || "N/A"}`, 14, 30);
    doc.text(`Email: ${quotation.client?.email || "N/A"}`, 14, 38);
    doc.text(`Project: ${quotation.project?.title || "N/A"}`, 14, 46);
    doc.text(`Category: ${quotation.project?.category || "N/A"}`, 14, 54);
    doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 14, 62);

    // Sections & Items Table
    quotation.sections?.forEach((section, index) => {
      doc.setFontSize(14);
      doc.text(`Section: ${section.customSectionName || section.sectionName}`, 14, 75 + index * 10);

      const tableData = section.items.map((item, i) => [
        i + 1,
        item.name || "N/A",
        item.quantity || 0,
        item.rate || 0,
        item.total || 0,
      ]);

      autoTable(doc, {
        head: [["#", "Item", "Qty", "Rate", "Total"]],
        body: tableData,
        startY: 80 + index * 40,
      });
    });

    // Grand Total
    doc.setFontSize(14);
    doc.text(`Grand Total: ₹${quotation.grandTotal}`, 14, doc.lastAutoTable.finalY + 10);

    // Save PDF
    doc.save(`quotation-${quotation._id}.pdf`);
  };

  if (loading) return <p className="text-center">Loading quotations...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <FileText className="w-5 h-5" /> All Quotations
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
        >
          <Plus className="w-4 h-4" /> Add Quotation
        </button>
      </div>

      {showForm && (
        <div className="mb-6 border p-4 rounded bg-gray-50">
          <QuotationForm />
        </div>
      )}

      {quotations.length === 0 ? (
        <p>No quotations found.</p>
      ) : (
        <table className="w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Project</th>
              <th className="p-2 border">Client</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => (
              <tr key={q._id} className="hover:bg-gray-50">
                <td className="p-2 border">{q.project?.title || "N/A"}</td>
                <td className="p-2 border">{q.client?.name || "N/A"}</td>
                <td className="p-2 border">
                  {new Date(q.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">{q.category || "N/A"}</td>
                <td className="p-2 border">{q.type || "N/A"}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={() => generatePDF(q)}
                    className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    <Download className="w-4 h-4" /> Generate PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default QuotationList;

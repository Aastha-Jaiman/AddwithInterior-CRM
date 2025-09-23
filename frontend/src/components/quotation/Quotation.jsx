"use client";

import React, { useEffect, useState } from "react";
import { Download, FileText, Plus, Eye } from "lucide-react";
import { getAllQuotations } from "@/services/quotation.services";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";


const QuotationList = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      setLoading(true);
      const response = await getAllQuotations();
      if (Array.isArray(response)) {
        setQuotations(response);
      } else if (response && Array.isArray(response.data)) {
        setQuotations(response.data);
      } else if (response && Array.isArray(response.quotations)) {
        setQuotations(response.quotations);
      } else {
        setQuotations([]);
      }
      console.log("first", response)
    } catch (error) {
      setQuotations([]);
    } finally {
      setLoading(false);
    }
  };

  // const generatePDF = (quotation) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(18);
  //   doc.text("Quotation", 14, 20);
  //   doc.setFontSize(12);
  //   doc.text(`Client: ${quotation.client?.name || "N/A"}`, 14, 30);
  //   doc.text(`Email: ${quotation.client?.email || "N/A"}`, 14, 38);
  //   doc.text(`Project: ${quotation.project?.title || "N/A"}`, 14, 46);
  //   doc.text(`Category: ${quotation.project?.category || "N/A"}`, 14, 54);
  //   doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 14, 62);
  //   let currentY = 70;
  //   quotation.sections?.forEach((section, index) => {
  //     doc.setFontSize(14);
  //     doc.text(
  //       `Section: ${section.customSectionName || section.sectionName}`,
  //       14,
  //       currentY
  //     );
  //     const tableData = section.items.map((item, i) => [
  //       i + 1,
  //       item.itemName || "N/A",
  //       item.height || 0,
  //       item.width || 0,
  //       item.calculation || 0,
  //     ]);
  //     autoTable(doc, {
  //       head: [["#", "ItemName", "Height", "Width", "Calculation"]],
  //       body: tableData,
  //       startY: currentY + 5,
  //       theme: "grid",
  //       headStyles: { fillColor: [41, 128, 185] },
  //       styles: { fontSize: 10, cellPadding: 3 },
  //     });
  //     currentY = doc.lastAutoTable.finalY + 10;
  //   });
  //   doc.setFontSize(14);
  //   doc.text(
  //     `Grand Total: ₹${quotation.grandTotal || 0}`,
  //     14,
  //     currentY + 5
  //   );
  //   doc.save(`quotation-${quotation._id}.pdf`);
  // };

  // NEW: Color palette
  
  const generatePDF = (quotation) => {
  const doc = new jsPDF();

  // --- Company Header ---
  doc.setFontSize(20);
  doc.setTextColor(41, 128, 185); // Blue
  doc.text("AddWith Interior", 105, 15, { align: "center" }); // Centered

  // --- Document Title ---
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Quotation", 105, 25, { align: "center" });

  // --- Client & Project Info Box ---
  const startY = 35;
  doc.setDrawColor(41, 128, 185);
  doc.setFillColor(230, 245, 255); // Light blue fill
  doc.rect(14, startY, 182, 35, "F"); // Filled rectangle

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Client Name: ${quotation.client?.name || "N/A"}`, 18, startY + 10);
  doc.text(`Client Email: ${quotation.client?.email || "N/A"}`, 18, startY + 18);
  doc.text(`Project Title: ${quotation.project?.title || "N/A"}`, 100, startY + 10);
  doc.text(`Category: ${quotation.project?.category || "N/A"}`, 100, startY + 18);
  doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString()}`, 100, startY + 26);

  let currentY = startY + 45;

  // --- Sections ---
  quotation.sections?.forEach((section, index) => {
    doc.setFontSize(14);
    doc.setTextColor(41, 128, 185);
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
      head: [["#", "Item Name", "Height", "Width", "Calculation"]],
      body: tableData,
      startY: currentY + 5,
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
      styles: { fontSize: 10, cellPadding: 3 },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  });

  // --- Grand Total Box ---
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setDrawColor(41, 128, 185);
  doc.setFillColor(230, 245, 255);
  doc.rect(14, currentY, 182, 10, "F");
  doc.text(`Grand Total: ₹${quotation.grandTotal || 0}`, 105, currentY + 7, { align: "center" });

  // --- Save PDF ---
  // doc.save(`quotation-${quotation._id}.pdf`);
  const clientName = quotation.client?.name?.replace(/\s+/g, "_") || "Client";
  const projectName = quotation.project?.title?.replace(/\s+/g, "_") || "Project";
  doc.save(`${clientName}_${projectName}.pdf`);
};

  
  const primary = "bg-gradient-to-br from-blue-50 via-white to-blue-100";
  const border = "border border-gray-300";
  const shadow = "shadow-lg shadow-blue-100/40";
  const btnBase =
    "flex items-center gap-1 px-3 py-2 rounded transition disabled:opacity-60 font-semibold";

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 text-blue-500">
          <FileText />
        </div>
        <p className="mt-3 text-gray-500 font-medium">Loading quotations...</p>
      </div>
    );

  return (
    <div className={`p-6 min-h-screen`}>
      {/* <div
        className={`flex justify-between items-center mb-8 ${shadow} rounded-lg px-6 py-3 `}
      >
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-700">
          <FileText className="w-6 h-6" />
          All Quotations
        </h2>
        <button
          onClick={() => router.push("/admin/quotation/add")}
          className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}
        >
          <Plus className="w-5 h-5" /> Add Quotation
        </button>
      </div> */}

      <div className={`flex justify-between items-center mb-8 ${shadow} rounded-lg px-6 py-3 `}>
        <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-700">
          <FileText className="w-6 h-6" />
          All Quotations
        </h2>
        {(user?.role === "admin" || user?.permission?.includes("upload_quotation")) && (
        <button
          onClick={() => {
            const storedUser = localStorage.getItem("crm_user");
            if (!storedUser) {
              alert("Please login first");
              return;
            }

            const parsedUser = JSON.parse(storedUser);
            const isAdmin = parsedUser.role === "admin";

            router.push(isAdmin ? "/admin/quotation/add" : "/quotation/add");
          }}
          className={`${btnBase} bg-green-600 hover:bg-green-700 text-white`}
        >
          <Plus className="w-5 h-5" /> Add Quotation
        </button>
        )}
      </div>
      


      {quotations.length === 0 ? (
        <div className="flex flex-col items-center py-16">
          <FileText className="w-10 h-10 text-gray-300 mb-4" />
          <p className="text-gray-400 text-lg">No quotations found.</p>
        </div>
      ) : (
        <div className={`overflow-x-auto ${shadow} rounded-lg bg-white`}>
          <table className={`w-full ${border} min-w-[900px]`}>
            <thead>
              <tr className="bg-blue-50 text-blue-800 uppercase text-xs rounded-t-lg">
                <th className="p-3 font-semibold border">Project</th>
                <th className="p-3 font-semibold border">Client</th>
                <th className="p-3 font-semibold border">Created At</th>
                <th className="p-3 font-semibold border">Category</th>
                <th className="p-3 font-semibold border">Rough Quotation</th>
                <th className="p-3 font-semibold border">Final Quotation</th>
                <th className="p-3 font-semibold border">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => (
                <tr
                  key={q._id}
                  className="bg-white hover:bg-blue-50/70 transition text-gray-800"
                >
                  <td className="p-3 border font-medium">{q.project?.title || "N/A"}</td>
                  <td className="p-3 border">{q.client?.name || "N/A"}</td>
                  <td className="p-3 border">
                    {new Date(q.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border text-center">{q.category || "N/A"}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => generatePDF(q)}
                      className={`${btnBase} text-green-600 underline hover:text-green-700 font-semibold`}
                    >
                      <Download className="w-4 h-4" /> Generate PDF
                    </button>
                  </td>
                  <td className="p-3 border text-center">
                    {q.finaldocument ? (
                      <button
                        onClick={async () => {
                          try {
                            const result = await fetch(q.finaldocument);
                            const blob = await result.blob();
                            const link = document.createElement("a");
                            link.href = window.URL.createObjectURL(blob);
                            link.download = "FinalQuotation.pdf";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            window.URL.revokeObjectURL(link.href);
                          } catch (error) {
                            alert("Failed to download file");
                          }
                        }}
                        className="text-green-600 underline hover:text-green-700 font-semibold"
                      >
                        Uploaded
                      </button>
                    ) : (
                      <span className="">
                        Not Uploaded
                      </span>
                    )}
                  </td>
                  <td className="p-3 border">
                    <div className="flex gap-2 justify-center">
                      <button
                        // onClick={() => router.push(`/admin/quotation/${q._id}`)}
                                  onClick={() => {
            const storedUser = localStorage.getItem("crm_user");
            if (!storedUser) {
              alert("Please login first");
              return;
            }

            const parsedUser = JSON.parse(storedUser);
            const isAdmin = parsedUser.role === "admin";

            router.push(isAdmin ? `/admin/quotation/${q._id}` : `/quotation/${q._id}`);
          }}
                        className={`${btnBase} bg-blue-500 hover:bg-blue-600 text-white`}
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default QuotationList;

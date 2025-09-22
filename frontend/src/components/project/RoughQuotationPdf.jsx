// RoughQuotationPDF.jsx
import React, { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RoughQuotationPDF = ({ quotation, triggerPDF, onComplete }) => {
  useEffect(() => {
    if (!triggerPDF || !quotation) return;

    const generatePDF = () => {
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
  doc.text(`Grand Total: Rs- ${quotation.grandTotal || 0}`, 105, currentY + 7, { align: "center" });

      // Save File
      // doc.save(
      //   `Rough_Quotation_${quotation?.client?.name || "Unknown"}.pdf`
      // );
        const clientName = quotation.client?.name?.replace(/\s+/g, "_") || "Client";
        const projectName = quotation.project?.title?.replace(/\s+/g, "_") || "Project";
        doc.save(`${clientName}_${projectName}.pdf`);

      if (onComplete) onComplete();
    };

    generatePDF();
  }, [triggerPDF, quotation, onComplete]);

  return null;
};

export default RoughQuotationPDF;

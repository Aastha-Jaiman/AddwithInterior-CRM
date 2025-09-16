// RoughQuotationPDF.jsx
import React, { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RoughQuotationPDF = ({ quotation, triggerPDF, onComplete }) => {
  useEffect(() => {
    if (!triggerPDF || !quotation) return;

    const generatePDF = () => {
      const doc = new jsPDF();

      // Title
      doc.setFontSize(18);
      doc.text("Rough Quotation", 14, 20);

      // Client / Project Info
      doc.setFontSize(12);
      doc.text(`Client: ${quotation.client?.name || "N/A"}`, 14, 30);
      doc.text(`Email: ${quotation.client?.email || "N/A"}`, 14, 38);
      doc.text(`Project: ${quotation.project?.title || "N/A"}`, 14, 46);
      doc.text(`Category: ${quotation.project?.category || "N/A"}`, 14, 54);
      doc.text(
        `Date: ${
          quotation?.createdAt
            ? new Date(quotation.createdAt).toLocaleDateString("en-IN")
            : "-"
        }`,
        14,
        62
      );

      let currentY = 70;

      quotation.sections
        ?.filter((section) => section.items && section.items.length > 0)
        .forEach((section, index) => {
          doc.setFontSize(14);
          doc.text(
            `Section: ${section.customSectionName || section.sectionName}`,
            14,
            currentY
          );

          // Table Data
          const tableData = section.items.map((item, i) => [
            i + 1,
            item.itemName || item.name || "N/A",
            item.height || 0,
            item.width || 0,
            item.calculation || "-",
          ]);

          autoTable(doc, {
            head: [["#", "Item Name", "Height", "Width", "Calculation"]],
            body: tableData,
            startY: currentY + 5,
            theme: "grid",
            headStyles: { fillColor: [41, 128, 185] },
            styles: { fontSize: 10, cellPadding: 3 },
          });

          currentY = doc.lastAutoTable.finalY + 10;
        });

      // Grand Total
      doc.setFontSize(14);
      doc.text(
        `Grand Total: ₹${quotation.grandTotal || 0}`,
        14,
        currentY + 5
      );

      // Save File
      doc.save(
        `Rough_Quotation_${quotation?.client?.name || "Unknown"}.pdf`
      );

      if (onComplete) onComplete();
    };

    generatePDF();
  }, [triggerPDF, quotation, onComplete]);

  return null;
};

export default RoughQuotationPDF;

// import React from "react";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

// const RoughQuotationPDF = ({ quotation }) => {
//   const generatePDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("Rough Quotation", 14, 22);

//     // Add client name, date, etc. as header
//     doc.setFontSize(12);
//     doc.text(`Client: ${quotation.client.name}`, 14, 32);
//     doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString("en-IN")}`, 14, 40);

//     // Loop through sections to create tables
//     quotation.sections.forEach((section, idx) => {
//       if (section.items.length === 0) return;

//       // Prepare table columns and rows from items
//       const columns = [
//         { header: "Item Name", dataKey: "itemName" },
//         { header: "Quantity", dataKey: "quantity" },
//         { header: "Rate", dataKey: "rate" },
//         { header: "Amount", dataKey: "amount" },
//       ];

//       const rows = section.items.map((item) => ({
//         itemName: item.name || "",
//         quantity: item.quantity || "",
//         rate: item.rate || "",
//         amount: item.amount || "",
//       }));

//       // Add section name before table
//       doc.setFontSize(14);
//       doc.text(section.sectionName || section.customSectionName || `Section ${idx + 1}`, 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 50);

//       // Add table for this section
//       autoTable(doc, {
//         startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 55,
//         columns,
//         body: rows,
//         theme: 'striped',
//         headStyles: { fillColor: [41, 128, 185] },
//         margin: { left: 14, right: 14 },
//         styles: { fontSize: 10 },
//       });
//     });

//     // Save PDF
//     doc.save(`Rough_Quotation_${quotation.client.name}.pdf`);
//   };

//   return (
//     <div>
//       <button
//         onClick={generatePDF}
//         className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//       >
//         Download Rough Quotation PDF
//       </button>
//     </div>
//   );
// };

// export default RoughQuotationPDF;

// RoughQuotationPDF.jsx (example)
import React, { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const RoughQuotationPDF = ({ quotation, triggerPDF, onComplete }) => {
  useEffect(() => {
    if (!triggerPDF) return;

    const generatePDF = () => {
        const doc = new jsPDF();
    
        doc.setFontSize(18);
        doc.text("Rough Quotation", 14, 22);
    
        // Add client name, date, etc. as header
        doc.setFontSize(12);
        doc.text(`Client: ${quotation.client.name}`, 14, 32);
        doc.text(`Date: ${new Date(quotation.createdAt).toLocaleDateString("en-IN")}`, 14, 40);
    
        // Loop through sections to create tables
        quotation.sections.forEach((section, idx) => {
          if (section.items.length === 0) return;
    
          // Prepare table columns and rows from items
          const columns = [
            { header: "Item Name", dataKey: "itemName" },
            { header: "Quantity", dataKey: "quantity" },
            { header: "Rate", dataKey: "rate" },
            { header: "Amount", dataKey: "amount" },
          ];
    
          const rows = section.items.map((item) => ({
            itemName: item.name || "",
            quantity: item.quantity || "",
            rate: item.rate || "",
            amount: item.amount || "",
          }));
    
          // Add section name before table
          doc.setFontSize(14);
          doc.text(section.sectionName || section.customSectionName || `Section ${idx + 1}`, 14, doc.lastAutoTable ? doc.lastAutoTable.finalY + 12 : 50);
    
          // Add table for this section
          autoTable(doc, {
            startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 18 : 55,
            columns,
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            margin: { left: 14, right: 14 },
            styles: { fontSize: 10 },
          });
        });
    
        // Save PDF
        doc.save(`Rough_Quotation_${quotation.client.name}.pdf`);
      if (onComplete) onComplete();
      };

    generatePDF();
  }, [triggerPDF, quotation, onComplete]);

  return null; // No visible UI
};

export default RoughQuotationPDF;


"use client"
import SidebarLayout from '@/components/sidebar/Sidebar'

import ProjectDetails from '@/components/projects/ClientProject';



// export default function page() {
//   return (
//     <div>
//       <SidebarLayout>
//         Projects
//       </SidebarLayout>
//     </div>
//   )
// }


// App.js or any parent component

// App.js or parent component
import React, { useState } from 'react';


const App = () => {
  const [projectData, setProjectData] = useState({
    id: 1,
    image: "https://media.istockphoto.com/id/2093684613/photo/virtual-design-of-elegant-living-room-with-nature-view.webp?a=1&b=1&s=612x612&w=0&k=20&c=dYxj9mAPAr9mDmLE99AqVihO5nH3487GwbO6jupqVsw=",
    name: "Modern Kitchen Design",
    category: "Modular Kitchen",
    customerName: "John Doe",
    customerNumber: "+91 9876543210",
    customerEmail: "john@example.com",
    customerAddress: "123 Main St, Mumbai, Maharashtra",
    estimatedBudget: 250000,
    finalBudget: 275000,
    designStatus: "pending",
    startingDate: "2024-01-15",
    designer: "Sarah Wilson",
    salesperson: "Mike Johnson",
    carpenter: ["David Brown", "Tom Wilson"],
    location: "Mumbai, Maharashtra",
    description: "Complete modular kitchen with modern appliances and storage solutions.",
    documents: {
      roughQuotation: {
        filename: "rough_quotation_001.pdf",
        uploadDate: "2024-01-15"
      },
      designPdf: {
        filename: "kitchen_design_001.pdf",
        uploadDate: "2024-01-20"
      },
      finalQuotation: {
        filename: "final_quotation_001.pdf",
        uploadDate: "2024-01-25"
      }
    }
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleDesignUpdate = async (projectId, newVersion) => {
    console.log('Design update requested:', projectId, newVersion);
    // API call to notify designer
    // await api.requestDesignUpdate(projectId, newVersion);
  };

  const handleDesignFinalize = async (projectId) => {
    console.log('Design finalized:', projectId);
    // API call to finalize design
    // await api.finalizeDesign(projectId);
  };

  const handleDocumentView = (docType, document) => {
    console.log('Viewing document:', docType, document);
    // Open document viewer or redirect to document URL
    // window.open(document.url, '_blank');
  };

  const handleDocumentDownload = (docType, document) => {
    console.log('Downloading document:', docType, document);
    // Trigger document download
    // downloadFile(document.url, document.filename);
  };

  return (
    <SidebarLayout>
      <div className="App">
        <ProjectDetails
          projectData={projectData}
          onDesignUpdate={handleDesignUpdate}
          onDesignFinalize={handleDesignFinalize}
          onDocumentView={handleDocumentView}
          onDocumentDownload={handleDocumentDownload}
          isLoading={isLoading}
        />
      </div>
    </SidebarLayout>

  );
};

export default App;

"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectsList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";
import ProjectForm from "./ProjectForm";


const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current view and ID from URL parameters
  const currentView = searchParams.get('view') || 'list'; // list, create, edit, details
  const currentId = searchParams.get('id');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock data with proper document structure
  const mockProjects = [
    {
      id: 1,
      image: "https://via.placeholder.com/80x60",
      name: "Modern Kitchen Design",
      category: "Modular Kitchen",
      customerName: "John Doe",
      customerNumber: "+91 9876543210",
      customerEmail: "john@example.com",
      customerAddress: "123 Main St, Mumbai, Maharashtra",
      estimatedBudget: 250000,
      finalBudget: 275000,
      designStatus: "finalize",
      startingDate: "2024-01-15",
      designer: "Sarah Wilson",
      salesperson: "Mike Johnson",
      carpenter: ["David Brown", "Tom Wilson"],
      location: "Mumbai, Maharashtra",
      description: "Complete modular kitchen with modern appliances",
      documents: {
        roughQuotation: "rough_quotation_001.pdf",
        designPdf: "kitchen_design_001.pdf", // Added design PDF
        finalQuotation: "final_quotation_001.pdf"
      }
    },
    {
      id: 2,
      image: "https://via.placeholder.com/80x60",
      name: "Bedroom Furniture Set",
      category: "Inplace Furniture",
      customerName: "Jane Smith",
      customerNumber: "+91 8765432109",
      customerEmail: "jane@example.com",
      customerAddress: "456 Oak Ave, Delhi",
      estimatedBudget: 150000,
      finalBudget: null,
      designStatus: "uploaded",
      startingDate: "2024-02-01",
      designer: "Alex Cooper",
      salesperson: "Lisa Anderson",
      carpenter: ["Robert Davis"],
      location: "Delhi, NCR",
      description: "Custom bedroom furniture with wardrobe",
      documents: {
        roughQuotation: "rough_quotation_002.pdf",
        designPdf: "bedroom_design_002.pdf", // Added design PDF
        finalQuotation: null
      }
    }
  ];

  // Load projects from localStorage or use mock data
  useEffect(() => {
    const savedProjects = localStorage.getItem('crm_projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      setProjects(mockProjects);
      localStorage.setItem('crm_projects', JSON.stringify(mockProjects));
    }
  }, []);

  useEffect(() => {
    if (currentView === 'details' || currentView === 'edit') {
      if (currentId) {
        const project = projects.find(p => p.id.toString() === currentId);
        setSelectedProject(project);
      }
    }
  }, [currentView, currentId, projects]);

  // Navigation functions
  const navigateToView = (view, id = null) => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (id) params.set('id', id);
    router.push(`?${params.toString()}`);
  };

  const navigateToList = () => {
    router.push(window.location.pathname);
  };

  const handleDownloadDocument = (projectId, docType, filename) => {
    console.log(`Downloading ${docType} for project ${projectId}: ${filename}`);
  };

  const handleProjectSave = (projectData) => {
    console.log("Saving project:", projectData);

    // Create new project with unique ID
    const newProject = {
      id: currentView === 'edit' && selectedProject ? selectedProject.id : Date.now(),
      image: projectData.projectImage ? URL.createObjectURL(projectData.projectImage) : "https://via.placeholder.com/80x60",
      name: projectData.name,
      category: projectData.category,
      customerName: projectData.customerName,
      customerNumber: projectData.customerNumber,
      customerEmail: projectData.customerEmail,
      customerAddress: projectData.customerAddress,
      estimatedBudget: parseInt(projectData.estimatedBudget),
      finalBudget: projectData.finalBudget ? parseInt(projectData.finalBudget) : null,
      designStatus: projectData.currentStatus || "pending",
      startingDate: projectData.startingDate,
      designer: projectData.designer,
      salesperson: projectData.salesperson,
      carpenter: projectData.carpenters.filter(c => c), // Remove empty entries
      location: projectData.location,
      description: projectData.description,
      documents: {
        roughQuotation: projectData.roughQuotation?.name || (selectedProject?.documents?.roughQuotation || null),
        designPdf: projectData.designPdf?.name || (selectedProject?.documents?.designPdf || null),
        finalQuotation: projectData.finalQuotation?.name || (selectedProject?.documents?.finalQuotation || null)
      }
    };

    let updatedProjects;

    if (currentView === 'edit' && selectedProject) {
      // Update existing project
      updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? newProject : p
      );
    } else {
      // Add new project to list
      updatedProjects = [...projects, newProject];
    }

    // Save to both state and localStorage
    setProjects(updatedProjects);
    localStorage.setItem('crm_projects', JSON.stringify(updatedProjects));

    navigateToList();
  };

  // Render different views based on currentView
  if (currentView === 'create' || currentView === 'edit') {
    return (
      <ProjectForm
        currentView={currentView}
        selectedProject={selectedProject}
        navigateToList={navigateToList}
        onSave={handleProjectSave}
      />
    );
  }

  if (currentView === 'details' && selectedProject) {
    return (
      <ProjectDetails
        selectedProject={selectedProject}
        navigateToList={navigateToList}
        navigateToEdit={() => navigateToView('edit', selectedProject.id)}
        handleDownloadDocument={handleDownloadDocument}
      />
    );
  }

  // Default list view
  return (
    <ProjectsList
      projects={projects}
      onView={(project) => navigateToView('details', project.id)}
      onEdit={(project) => navigateToView('edit', project.id)}
      onCreateNew={() => navigateToView('create')}
      onDownloadDocument={handleDownloadDocument}
    />
  );
};

export default ProjectsPage;

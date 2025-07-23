"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectsList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";
import ProjectForm from "./ProjectForm";

const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentView = searchParams.get('view') || 'list';
  const currentId = searchParams.get('id');
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  // Mock data - only for initial setup, will be removed after first real project
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
      },
      isDummy: true
    }
  ];

  // Load projects and remove dummy data if real projects exist
  useEffect(() => {
    const savedProjects = localStorage.getItem('crm_projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      const realProjects = parsedProjects.filter(p => !p.isDummy);
      
      if (realProjects.length > 0) {
        setProjects(realProjects);
        localStorage.setItem('crm_projects', JSON.stringify(realProjects));
      } else {
        setProjects(mockProjects);
      }
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
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Preserve existing documents when editing
    let existingDocs = {};
    if (currentView === 'edit' && selectedProject?.documents) {
      existingDocs = { ...selectedProject.documents };
    }

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
      carpenter: projectData.carpenters.filter(c => c),
      location: projectData.location,
      description: projectData.description,
      documents: {
        ...existingDocs,
        ...(projectData.roughQuotation && {
          roughQuotation: {
            filename: projectData.roughQuotation.name,
            uploadDate: currentDate
          }
        }),
        ...(projectData.finalQuotation && {
          finalQuotation: {
            filename: projectData.finalQuotation.name,
            uploadDate: currentDate
          }
        })
      },
      isDummy: false
    };

    let updatedProjects;
    if (currentView === 'edit' && selectedProject) {
      updatedProjects = projects.map(p =>
        p.id === selectedProject.id ? newProject : p
      );
    } else {
      // Remove dummy data when adding first real project
      const realProjects = projects.filter(p => !p.isDummy);
      updatedProjects = [...realProjects, newProject];
    }

    setProjects(updatedProjects);
    localStorage.setItem('crm_projects', JSON.stringify(updatedProjects));
    navigateToList();
  };

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

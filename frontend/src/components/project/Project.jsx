"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectsList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";
import ProjectForm from "./ProjectForm";
import { getAllProjects } from "@/services/project.services";

const ProjectsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentView = searchParams.get('view') || 'list';
  const currentId = searchParams.get('id');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // // ✅ Fetch projects from API
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getAllProjects();
  //       setProjects(response.data || []);
  //     } catch (err) {
  //       console.error("Error fetching projects:", err);
  //       setError("Failed to load projects.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProjects();
  // }, []);

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getAllProjects();

      console.log("res", response)


      // ✅ Extract the correct array
      const projectList = response.data.projects || [];
      setProjects(projectList);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, []);



  useEffect(() => {
    if ((currentView === 'details' || currentView === 'edit') && currentId) {
      const project = projects.find(p => p._id?.toString() === currentId);
      setSelectedProject(project);
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
    // Replace with real download logic
    console.log(`Downloading ${docType} for project ${projectId}: ${filename}`);
  };

  const handleProjectSave = (newProjectData) => {
    // You can integrate project creation/editing API here if needed.
    navigateToList();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-300">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if ((currentView === 'create' || currentView === 'edit')) {
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
        navigateToEdit={() => navigateToView('edit', selectedProject._id)}
        handleDownloadDocument={handleDownloadDocument}
      />
    );
  }

  return (
    <ProjectsList
      projects={projects}
      onView={(project) => navigateToView('details', project._id)}
      onEdit={(project) => navigateToView('edit', project._id)}
      onCreateNew={() => navigateToView('create')}
      onDownloadDocument={handleDownloadDocument}
    />
  );
};

export default ProjectsPage;

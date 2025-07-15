"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, X } from 'lucide-react';
import { ProjectDetail } from './adminProject/ProjectDetail';
import { ProjectList } from './adminProject/ProjectList';
import { ProjectForm } from './adminProject/ProjectForm';


const AdminProject = () => {
const [projects, setProjects] = useState([
  {
    id: 1,
    name: "Premium Modular Kitchen",
    category: "Modular Kitchen",
    estimatedBudget: "₹2,50,000",
    finalQuotation: "₹2,35,000",
    status: "Completed",
    designer: "Rajesh Kumar",
    salesperson: "Priya Sharma",
    projectType: "Residential",
    image: {
      name: "kitchen_image.jpg",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop"
    },
    description: "High-quality modular kitchen with premium fittings and modern design. Features include soft-close drawers, premium hardware, and contemporary styling.",
    startingDate: "2024-03-15",
    endDate: "2024-05-15",
    duration: "2 months",
    location: "Jaipur, RJ",
    budget: 250000,
    actualCost: 235000,
    paidAmount: 150000,
    remainingAmount: 85000,
    customer: {
      name: "Amit Verma",
      phone: "+91 98765 43210",
      email: "amit.verma@email.com",
      address: "123 Green Park, Malviya Nagar, Jaipur, Rajasthan - 302017"
    },
    client: {
      name: "Amit Verma",
      phone: "+91 98765 43210",
      email: "amit.verma@email.com",
      address: "123 Green Park, Malviya Nagar, Jaipur, Rajasthan - 302017"
    },
    projectManager: "Rajesh Kumar",
    architect: "Vikram Singh",
    contractor: "Deepak Builders",
    teamMembers: [
      { name: "Suresh Carpenter", role: "Lead Carpenter" },
      { name: "Ramesh Electrician", role: "Electrical Work" }
    ],
    roughQuotation: {
      name: "Kitchen_Rough_Quote.pdf",
      url: "https://example.com/kitchen_rough_quote.pdf"
    },
    designFile: {
      name: "Kitchen_Final_Design.pdf",
      url: "https://example.com/kitchen_final_design.pdf"
    },
    finalQuotationFile: {
      name: "Kitchen_Final_Quote.pdf",
      url: "https://example.com/kitchen_final_quote.pdf"
    },
    documents: [
      {
        name: "Kitchen_Design_Plan.pdf",
        url: "https://example.com/kitchen_design.pdf",
        type: "Design Plan"
      },
      {
        name: "Material_List.pdf",
        url: "https://example.com/material_list.pdf",
        type: "Material List"
      }
    ],
    specifications: {
      cabinetMaterial: "Marine Plywood",
      shutterFinish: "Laminate",
      hardware: "Hettich",
      countertop: "Granite",
      appliances: "Modular Hob, Chimney"
    },
    notes: "Client prefers white and grey color combination. Extra storage required for utensils. Electrical points to be modified as per design.",
    startDate: "2024-03-15"
  },
  {
    id: 2,
    name: "Luxury Bedroom Set",
    category: "Inplace Furniture",
    estimatedBudget: "₹1,80,000",
    finalQuotation: null,
    status: "In Progress",
    designer: "Neha Gupta",
    salesperson: "Suresh Patel",
    projectType: "Residential",
    image: {
      name: "bedroom_image.jpg",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=300&fit=crop"
    },
    description: "Complete bedroom furniture set with wardrobe, bed, and study table. Premium wood finish with modern design elements.",
    startingDate: "2024-04-20",
    endDate: "2024-06-20",
    duration: "2 months",
    location: "Delhi, DL",
    budget: 180000,
    actualCost: null,
    paidAmount: 50000,
    remainingAmount: 130000,
    customer: {
      name: "Kavita Singh",
      phone: "+91 87654 32109",
      email: "kavita.singh@email.com",
      address: "456 South Extension, Part 1, New Delhi - 110049"
    },
    client: {
      name: "Kavita Singh",
      phone: "+91 87654 32109",
      email: "kavita.singh@email.com",
      address: "456 South Extension, Part 1, New Delhi - 110049"
    },
    projectManager: "Neha Gupta",
    architect: "Ravi Sharma",
    contractor: "Modern Interiors",
    teamMembers: [
      { name: "Anil Kumar", role: "Furniture Specialist" },
      { name: "Mohan Polisher", role: "Finishing Expert" }
    ],
    roughQuotation: {
      name: "Bedroom_Rough_Quote.pdf",
      url: "https://example.com/bedroom_rough_quote.pdf"
    },
    designFile: null, // No design uploaded yet
    finalQuotationFile: null,
    documents: [
      {
        name: "Bedroom_Design.pdf",
        url: "https://example.com/bedroom_design.pdf",
        type: "Design Layout"
      }
    ],
    specifications: {
      bedSize: "King Size",
      wardrobeType: "6 Door Wardrobe",
      material: "Engineered Wood",
      finish: "Walnut Veneer",
      hardware: "Hafele"
    },
    notes: "Client wants matching bedside tables. Mirror finish required on wardrobe doors.",
    startDate: "2024-04-20"
  },
  {
    id: 3,
    name: "Office Conference Room",
    category: "Office Furniture",
    estimatedBudget: "₹3,50,000",
    finalQuotation: null,
    status: "Active",
    designer: "Mohit Agarwal",
    salesperson: "Ravi Kumar",
    projectType: "Commercial",
    image: {
      name: "conference_room.jpg",
      url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop"
    },
    description: "Modern conference room setup with executive table, chairs, and storage solutions. Professional design with contemporary elements.",
    startingDate: "2024-05-01",
    endDate: "2024-07-01",
    duration: "2 months",
    location: "Mumbai, MH",
    budget: 350000,
    actualCost: null,
    paidAmount: 100000,
    remainingAmount: 250000,
    customer: {
      name: "TechCorp Solutions",
      phone: "+91 99887 76543",
      email: "procurement@techcorp.com",
      address: "789 Business District, Andheri East, Mumbai - 400069"
    },
    client: {
      name: "TechCorp Solutions",
      phone: "+91 99887 76543",
      email: "procurement@techcorp.com",
      address: "789 Business District, Andheri East, Mumbai - 400069"
    },
    projectManager: "Mohit Agarwal",
    architect: "Sanjay Mehta",
    contractor: "Elite Interiors",
    teamMembers: [
      { name: "Dinesh Carpenter", role: "Lead Carpenter" },
      { name: "Rakesh Upholsterer", role: "Upholstery Work" }
    ],
    roughQuotation: {
      name: "Conference_Rough_Quote.pdf",
      url: "https://example.com/conference_rough_quote.pdf"
    },
    designFile: {
      name: "Conference_Final_Design.pdf",
      url: "https://example.com/conference_final_design.pdf"
    },
    finalQuotationFile: null, // Design available but final quotation not uploaded yet
    documents: [
      {
        name: "Conference_Layout.pdf",
        url: "https://example.com/conference_layout.pdf",
        type: "Layout Plan"
      }
    ],
    specifications: {
      tableSize: "12 Seater",
      chairType: "Executive Chairs",
      material: "Solid Wood",
      finish: "Mahogany",
      storage: "Built-in Cabinets"
    },
    notes: "Client requires AV equipment integration. Cable management to be hidden. Premium leather upholstery preferred.",
    startDate: "2024-05-01"
  }
]);
  const [designers] = useState(["Rajesh Kumar", "Neha Gupta", "Vikram Joshi", "Ritu Agarwal", "Deepak Sharma"]);
  const [salespersons] = useState(["Priya Sharma", "Suresh Patel", "Kavita Joshi", "Rahul Mehta", "Sonia Gupta"]);
  const [currentView, setCurrentView] = useState('list');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Modular Kitchen', 'Inplace Furniture'];
  const statuses = ['Active', 'In Progress', 'Completed', 'On Hold'];

  const [formData, setFormData] = useState({
    name: '', category: 'Modular Kitchen', estimatedBudget: '', finalQuotation: '', status: 'Active',
    designer: '', salesperson: '', projectType: 'Residential', description: '', startingDate: '', location: '',
    customer: { name: '', phone: '', email: '', address: '' }, image: null, roughQuotation: null, finalQuotationFile: null
  });

  // URL management for project details
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('projectId');
    
    if (projectId) {
      const project = projects.find(p => p.id === parseInt(projectId));
      if (project) {
        setSelectedProject(project);
        setCurrentView('detail');
        setShowForm(false);
      }
    }
  }, [projects]);

  const updateURL = (projectId = null) => {
    const url = new URL(window.location);
    if (projectId) {
      url.searchParams.set('projectId', projectId);
    } else {
      url.searchParams.delete('projectId');
    }
    window.history.pushState({}, '', url);
  };

  const filteredProjects = projects.filter(project =>
    (activeFilter === 'All' || project.category === activeFilter) &&
    (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.designer.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = () => {
    if (!formData.name || !formData.estimatedBudget || !formData.designer || !formData.salesperson ||
      !formData.startingDate || !formData.location || !formData.description ||
      !formData.customer.name || !formData.customer.phone || !formData.customer.email) {
      alert('Please fill all required fields');
      return;
    }
    
    const newProject = {
      ...formData,
      id: editingProject ? editingProject.id : Date.now(),
      budget: formData.estimatedBudget.replace(/[₹,]/g, ''),
      startDate: formData.startingDate,
      client: formData.customer,
      projectManager: formData.designer,
      architect: formData.designer,
      contractor: "TBD",
      teamMembers: [],
      documents: [],
      specifications: {},
      notes: "",
      actualCost: null,
      paidAmount: 0,
      remainingAmount: parseInt(formData.estimatedBudget.replace(/[₹,]/g, '')) || 0
    };
    
    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? newProject : p));
    } else {
      setProjects([...projects, newProject]);
    }
    resetForm();
    updateURL();
  };

  const resetForm = () => {
    setFormData({
      name: '', category: 'Modular Kitchen', estimatedBudget: '', finalQuotation: '', status: 'Active',
      designer: '', salesperson: '', projectType: 'Residential', description: '', startingDate: '', location: '',
      customer: { name: '', phone: '', email: '', address: '' }, image: null, roughQuotation: null, finalQuotationFile: null
    });
    setShowForm(false);
    setEditingProject(null);
    setCurrentView('list');
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      ...project,
      estimatedBudget: project.estimatedBudget || `₹${project.budget?.toLocaleString()}`,
      startingDate: project.startingDate || project.startDate
    });
    setShowForm(true);
    setCurrentView('detail');
    updateURL(project.id);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProject?.id === id) {
        setCurrentView('list');
        setSelectedProject(null);
        updateURL();
      }
    }
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setCurrentView('detail');
    setShowForm(false);
    updateURL(project.id);
  };

  const handleDownload = (file) => {
    if (file?.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('No file available for download');
    }
  };

  const showAddForm = () => {
    setEditingProject(null);
    resetForm();
    setShowForm(true);
    setCurrentView('form');
    updateURL();
  };

  const backToList = () => {
    setCurrentView('list');
    setShowForm(false);
    setEditingProject(null);
    setSelectedProject(null);
    resetForm();
    updateURL();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Projects</h1>
            <p className="text-gray-600 mt-1">Manage all projects updates & client Projects</p>
          </div>
          {currentView === 'list' && (
            <button
              onClick={showAddForm}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              <Plus size={20} /> New Project
            </button>
          )}
          {currentView !== 'list' && (
            <button
              onClick={backToList}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X size={20} /> Back to Projects
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar - Only show in list view */}
      {currentView === 'list' && (
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg">
                <Filter size={18} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700">Filter by:</span>
            </div>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${activeFilter === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-md hover:shadow-lg'
                }`}
              >
                {category}
              </button>
            ))}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {currentView === 'detail' && selectedProject ? (
          <>
            {showForm ? (
              <ProjectForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                designers={designers}
                salespersons={salespersons}
                statuses={statuses}
                isEdit={true}
              />
            ) : (
              <ProjectDetail
                selectedProject={selectedProject}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleDownload={handleDownload}
              />
            )}
          </>
        ) : currentView === 'form' && showForm ? (
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            resetForm={resetForm}
            designers={designers}
            salespersons={salespersons}
            statuses={statuses}
            isEdit={false}
          />
        ) : (
          <ProjectList
            projects={projects}
            filteredProjects={filteredProjects}
            handleView={handleView}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleDownload={handleDownload}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </div>
  );
};

export default AdminProject;





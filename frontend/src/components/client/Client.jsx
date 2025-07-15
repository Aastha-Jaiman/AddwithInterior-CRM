"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { ClientForm } from './clientdetails/ClientForm';
import { ClientDetails } from './clientdetails/ClientDetails';
import ClientTable from './clientdetails/ClientTable';


const ClientManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list', 'form', 'details'
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

  const [clientList, setClientList] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      projectName: "Website Redesign",
      joinDate: "2023-01-15",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c647?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      projectName: "Mobile App Development",
      joinDate: "2022-11-20",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine Rd, Chicago, IL 60601",
      projectName: "Brand Identity Design",
      joinDate: "2023-03-10",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      phone: "+1 (555) 321-9876",
      address: "321 Elm St, Houston, TX 77001",
      projectName: "E-commerce Platform",
      joinDate: "2022-08-15",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    projectName: '',
    joinDate: '',
    avatar: ''
  });

  // URL management for client details
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const clientId = params.get('clientId');
    
    if (clientId) {
      const client = clientList.find(c => c.id === parseInt(clientId));
      if (client) {
        setSelectedClient(client);
        setCurrentView('details');
      }
    }
  }, [clientList]);

  const updateURL = (clientId = null) => {
    const url = new URL(window.location);
    if (clientId) {
      url.searchParams.set('clientId', clientId);
    } else {
      url.searchParams.delete('clientId');
    }
    window.history.pushState({}, '', url);
  };

  const filteredClient = clientList.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, avatar: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.projectName || !formData.joinDate) {
      alert('Please fill in all required fields');
      return;
    }

    const newClient = {
      id: Date.now(),
      ...formData,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };
    setClientList([...clientList, newClient]);
    resetForm();
    setCurrentView('list');
    updateURL(); // Clear URL params
  };

  const handleDelete = (id) => {
    setClientList(clientList.filter(client => client.id !== id));
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setFormData(client);
    setCurrentView('form');
    updateURL(); // Clear URL params
  };

  const handleUpdate = () => {
    setClientList(clientList.map(client =>
      client.id === editingId ? { ...formData, id: editingId } : client
    ));
    setEditingId(null);
    resetForm();
    setCurrentView('list');
    updateURL(); // Clear URL params
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      projectName: '',
      joinDate: '',
      avatar: ''
    });
  };

  const showClientDetails = (client) => {
    setSelectedClient(client);
    setCurrentView('details');
    updateURL(client.id); // Add client ID to URL
  };

  const showAddForm = () => {
    setEditingId(null);
    resetForm();
    setCurrentView('form');
    updateURL(); // Clear URL params
  };

  const backToList = () => {
    setCurrentView('list');
    setEditingId(null);
    setSelectedClient(null);
    resetForm();
    updateURL(); // Clear URL params
  };

  // Client List View
  if (currentView === 'list') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60 px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Client Management
              </h1>
              <p className="text-slate-600 mt-1">Manage your clients and their project details</p>
            </div>
            <button
              onClick={showAddForm}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
              Add New Client
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/60 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or project..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Client Table Component */}
        <ClientTable 
          filteredClient={filteredClient}
          showClientDetails={showClientDetails}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    );
  }

  // Client Details View
  if (currentView === 'details' && selectedClient) {
    return (
      <ClientDetails
        selectedClient={selectedClient}
        backToList={backToList}
        handleEdit={handleEdit}
      />
    );
  }

  // Add/Edit Form View
  if (currentView === 'form') {
    return (
      <ClientForm 
        formData={formData}
        setFormData={setFormData}
        editingId={editingId}
        backToList={backToList}
        handleSubmit={handleSubmit}
        handleUpdate={handleUpdate}
        handleImageUpload={handleImageUpload}
      />
    );
  }

  return null;
};

export default ClientManagement;
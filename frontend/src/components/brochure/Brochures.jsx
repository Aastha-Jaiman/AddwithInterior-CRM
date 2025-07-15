"use client"

import React, { useState } from 'react';
import DashboardView from './DashboardView';
import UploadView from './UploadView';
import PreviewView from './PreviewView';

const Brochures = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [brochures, setBrochures] = useState([
    {
      id: 1,
      name: 'Modern Living Room Collection 2024',
      type: 'PDF',
      size: '3.2 MB',
      uploadDate: '2024-01-15',
      thumbnail: '/api/placeholder/300/400',
      url: '#',
      category: 'Living Room',
      status: 'active',
      downloads: 324,
      starred: true,
      tags: ['modern', 'living room', 'contemporary', 'minimalist'],
      description: 'Explore our latest modern living room designs featuring contemporary furniture, minimalist aesthetics, and innovative space solutions.',
      designer: 'Sarah Johnson',
      projectLocation: 'Mumbai, India',
      projectYear: '2024',
      clientType: 'Residential',
      budget: '₹8-12 Lakhs',
      area: '1200 sq ft'
    },
    {
      id: 2,
      name: 'Luxury Bedroom Interiors',
      type: 'PDF',
      size: '4.1 MB',
      uploadDate: '2024-01-12',
      thumbnail: '/api/placeholder/300/400',
      url: '#',
      category: 'Bedroom',
      status: 'active',
      downloads: 267,
      starred: false,
      tags: ['luxury', 'bedroom', 'elegant', 'comfort'],
      description: 'Discover luxurious bedroom designs that combine comfort with sophistication, featuring premium materials and elegant furnishings.',
      designer: 'Raj Patel',
      projectLocation: 'Delhi, India',
      projectYear: '2024',
      clientType: 'Residential',
      budget: '₹10-15 Lakhs',
      area: '800 sq ft'
    }
  ]);

  const [selectedBrochure, setSelectedBrochure] = useState(null);
  
  // Role-based access control
  const [user, setUser] = useState({
    id: 'user123', // Change this to 'admin' for admin access
    role: 'admin', // 'admin' or 'user'
    name: 'John Doe'
  });

  const isAdmin = user.role === 'admin';

  const deleteBrochure = (id) => {
    if (!isAdmin) {
      alert('Only admin can delete brochures');
      return;
    }
    setBrochures(prev => prev.filter(b => b.id !== id));
    if (selectedBrochure?.id === id) {
      setSelectedBrochure(null);
      setCurrentView('dashboard');
    }
  };

  const handleDownload = (brochure) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = brochure.url;
    const fileExtension = brochure.type ? brochure.type.toLowerCase() : 'pdf';
    link.download = `${brochure.name}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Update download count
    setBrochures(prev => prev.map(b =>
      b.id === brochure.id ? { ...b, downloads: b.downloads + 1 } : b
    ));
  };

  const toggleStar = (id) => {
    setBrochures(prev => prev.map(b =>
      b.id === id ? { ...b, starred: !b.starred } : b
    ));
  };

  const props = {
    brochures,
    setBrochures,
    selectedBrochure,
    setSelectedBrochure,
    currentView,
    setCurrentView,
    deleteBrochure,
    handleDownload,
    toggleStar,
    isAdmin,
    user
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40 min-h-screen">
      {currentView === 'dashboard' && <DashboardView {...props} />}
      {currentView === 'upload' && isAdmin && <UploadView {...props} />}
      {currentView === 'preview' && <PreviewView {...props} />}
    </div>
  );
};

export default Brochures;
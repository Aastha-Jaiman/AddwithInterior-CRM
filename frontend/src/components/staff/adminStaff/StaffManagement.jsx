


"use client";
import React, { createContext, useContext, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import {
  Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera,
  Briefcase, ArrowLeft
} from 'lucide-react';
import { StaffList } from "./StaffList";
import { StaffForm } from "./StaffForm";

// StaffManagement Component
export const StaffManagement = () => {
//   const { projects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [staffList, setStaffList] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main St, New York, NY 10001",
      category: "Designer",
      joinDate: "2023-01-15",
      salary: "$65,000",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b332c647?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael.chen@company.com",
      phone: "+1 (555) 987-6543",
      address: "456 Oak Ave, Los Angeles, CA 90210",
      category: "Salesperson",
      joinDate: "2022-11-20",
      salary: "$55,000",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      email: "emily.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      address: "789 Pine Rd, Chicago, IL 60601",
      category: "Designer",
      joinDate: "2023-03-10",
      salary: "$70,000",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Robert Wilson",
      email: "robert.wilson@company.com",
      phone: "+1 (555) 321-9876",
      address: "321 Elm St, Houston, TX 77001",
      category: "Carpenter",
      joinDate: "2022-08-15",
      salary: "$58,000",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: 'Designer',
    joinDate: '',
    salary: '',
    avatar: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.joinDate || !formData.salary) {
      alert('Please fill in all required fields');
      return;
    }
    const newStaff = {
      id: Date.now(),
      ...formData,
      avatar: formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
    };
    setStaffList([...staffList, newStaff]);
    resetForm();
  };

  const handleUpdate = () => {
    setStaffList(staffList.map(staff =>
      staff.id === editingId ? { ...formData, id: editingId } : staff
    ));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      category: 'Designer',
      joinDate: '',
      salary: '',
      avatar: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setFormData(staff);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/60 px-6 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Staff Management
            </h1>
            <p className="text-slate-600 mt-1">Manage your team members and their details</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} className="transition-transform duration-300 group-hover:rotate-90" />
            Add New Staff
          </button>
        </div>
      </div>
      <StaffList
        staffList={staffList}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
      {(showForm || editingId) && (
        <StaffForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={editingId ? handleUpdate : handleSubmit}
          resetForm={resetForm}
          isEditing={!!editingId}
        />
      )}
    </div>
  );
};

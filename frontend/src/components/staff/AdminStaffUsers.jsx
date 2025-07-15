
"use client"
import React, { useState } from 'react';
import { Plus, Search, Filter, User, Mail, Phone, MapPin, Calendar, Edit, Trash2, X, Save, Upload, Camera } from 'lucide-react';

const StaffManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
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

  const categories = ['All', 'Designer', 'Salesperson', 'Carpenter'];

  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || staff.category === filterCategory;
    return matchesSearch && matchesCategory;
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
  };

  const handleDelete = (id) => {
    setStaffList(staffList.filter(staff => staff.id !== id));
  };

  const handleEdit = (staff) => {
    setEditingId(staff.id);
    setFormData(staff);
  };

  const handleUpdate = () => {
    setStaffList(staffList.map(staff =>
      staff.id === editingId ? { ...formData, id: editingId } : staff
    ));
    setEditingId(null);
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
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Designer': return 'bg-purple-100 text-purple-700';
      case 'Salesperson': return 'bg-green-100 text-green-700';
      case 'Carpenter': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Designer': return '🎨';
      case 'Salesperson': return '💼';
      case 'Carpenter': return '🔨';
      default: return '👤';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
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

      {/* Filters */}
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
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${filterCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/80 hover:bg-white text-slate-700 shadow-md hover:shadow-lg'
                }`}
            >
              {category}
            </button>
          ))}

          <div className="flex items-center gap-2 ml-4">
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
      </div>

      {/* Staff Grid */}
      <div className="px-6 py-6">
        <div className="overflow-auto bg-white shadow-md rounded-xl">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Avatar</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Phone</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Address</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Category</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Join Date</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-700">Salary</th>
                <th className="px-4 py-3 text-center font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map(staff => (
                <tr key={staff.id} className="hover:bg-slate-50 transition">
                  <td className="px-4 py-3">
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-800">{staff.name}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.email}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.phone}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.address}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(staff.category)}`}>
                      {staff.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{staff.joinDate}</td>
                  <td className="px-4 py-3 text-slate-600">{staff.salary}</td>
                  <td className="px-4 py-3 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs rounded-md"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(staff.id)}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-xs rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>


      {/* Add/Edit Staff Modal */}
      {(showForm || editingId) && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-white via-white/95 to-blue-50/80 rounded-3xl w-full max-w-2xl shadow-2xl backdrop-blur-sm border border-white/20 transform animate-slideUp max-h-[90vh] flex flex-col">

            {/* Header */}
            <div className="relative px-8 py-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-t-3xl">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90 rounded-t-3xl"></div>
              <div className="relative flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {editingId ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {editingId ? 'Update the staff member details' : 'Fill in the details to add a new team member'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
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
                  }}
                  className="p-3 hover:bg-white/20 rounded-full transition-all duration-300 text-white hover:scale-110"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">

              {/* Avatar Upload Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1 shadow-lg">
                    <img
                      src={formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'User')}&background=random`}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover bg-white"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Camera size={16} className="text-white" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg">
                    <Upload size={16} />
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatar: '' })}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number *</label>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Job Category *</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md appearance-none"
                    >
                      <option value="Designer">{getCategoryIcon('Designer')} Designer</option>
                      <option value="Salesperson">{getCategoryIcon('Salesperson')} Salesperson</option>
                      <option value="Carpenter">{getCategoryIcon('Carpenter')} Carpenter</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Join Date *</label>
                  <div className="relative">
                    <Calendar size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      type="text"
                      required
                      placeholder="60,000"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Complete Address *</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
                      placeholder="Enter complete address"
                      rows="3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Picture URL (Alternative)</label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                      placeholder="https://example.com/profile.jpg (optional)"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-b-3xl border-t border-slate-200/50">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
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
                  }}
                  className="flex-1 px-6 py-3 bg-white/80 hover:bg-white text-slate-700 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg border border-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={editingId ? handleUpdate : handleSubmit}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  <Save size={20} />
                  {editingId ? 'Update Staff Member' : 'Add Staff Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StaffManagement;

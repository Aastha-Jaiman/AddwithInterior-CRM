// components/DailyUpdates.js
"use client"
import { useState, useMemo } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon, FilterIcon, UserIcon, BriefcaseIcon, ClockIcon, ImageIcon } from 'lucide-react';

const dummyUpdates = [
  {
    id: 1,
    date: '2025-07-23',
    day: 'Today',
    text: 'Kitchen cabinet installation completed. All hinges and handles fitted. Ready for final inspection.',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
      'https://images.unsplash.com/photo-1556909110-a5db9c2b9502?w=400'
    ],
    uploadedBy: 'Ram Kumar',
    role: 'Carpenter',
    time: '6:30 PM',
    status: 'completed'
  },
  {
    id: 2,
    date: '2025-07-22',
    day: 'Yesterday',
    text: 'Living room flooring work started. Wood plank cutting 60% complete. Weather conditions favorable.',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
    ],
    uploadedBy: 'Suresh Sharma',
    role: 'Carpenter',
    time: '5:45 PM',
    status: 'in-progress'
  },
  {
    id: 3,
    date: '2025-07-21',
    day: '2 days ago',
    text: 'Material order placed. Premium wood quotation received and sent to client for approval.',
    images: [],
    uploadedBy: 'Amit Singh',
    role: 'Salesperson',
    time: '4:20 PM',
    status: 'pending'
  }
];

export default function DailyUpdates() {
  const [expandedCards, setExpandedCards] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const toggleExpand = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredUpdates = useMemo(() => {
    return dummyUpdates.filter(update => {
      const dateMatch = !selectedDate || update.date === selectedDate;
      const roleMatch = !selectedRole || update.role === selectedRole;
      return dateMatch && roleMatch;
    });
  }, [selectedDate, selectedRole]);

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedRole('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* CRM Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BriefcaseIcon className="w-6 h-6 text-white" />
                </div>
                Daily Updates
              </h1>
              <p className="text-gray-600 mt-1">Project Progress Tracker</p>
            </div>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg">
                <div className="text-lg font-bold">4</div>
                <div className="text-xs opacity-90">Updates Today</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg">
                <div className="text-lg font-bold">2</div>
                <div className="text-xs opacity-90">Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 py-6">
        {/* Enhanced Filter Panel */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <FilterIcon className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Filter by Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Filter by Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors"
                >
                  <option value="">All Roles</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Salesperson">Salesperson</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 opacity-0">Actions</label>
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                >
                  Clear Filters
                </button>
              </div>

              {/* Results Info */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Results</label>
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                  <div className="text-sm font-semibold text-blue-800">
                    {filteredUpdates.length} of {dummyUpdates.length} updates
                  </div>
                  <div className="text-xs text-blue-600">
                    {(selectedDate || selectedRole) && 'Filters active'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Updates Grid */}
        {filteredUpdates.length > 0 ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredUpdates.map((update) => (
              <div
                key={update.id}
                className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Card Header with Status */}
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                      <h3 className="font-bold text-gray-900 text-lg">{update.day}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(update.status)}`}>
                      {update.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border">
                      {update.date}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      update.role === 'Carpenter'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      <UserIcon className="w-3 h-3 inline mr-1" />
                      {update.role}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <p className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {update.text}
                  </p>

                  {/* Image Toggle */}
                  {update.images && update.images.length > 0 && (
                    <div className="mb-4">
                      <button
                        onClick={() => toggleExpand(update.id)}
                        className="flex items-center gap-2 w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                      >
                        <ImageIcon className="w-4 h-4" />
                        <span>View {update.images.length} Photo{update.images.length > 1 ? 's' : ''}</span>
                        {expandedCards[update.id] ? (
                          <ChevronUpIcon className="w-4 h-4 ml-auto" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4 ml-auto" />
                        )}
                      </button>
                    </div>
                  )}

                  {/* Reporter Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {update.uploadedBy}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      {update.time}
                    </div>
                  </div>
                </div>

                {/* Expandable Images */}
                {expandedCards[update.id] && update.images && update.images.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <div className={`grid gap-4 ${
                        update.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                      }`}>
                        {update.images.map((image, index) => (
                          <div
                            key={index}
                            className="relative overflow-hidden rounded-xl bg-gray-100 group cursor-pointer"
                          >
                            <img
                              src={image}
                              alt={`Update image ${index + 1}`}
                              className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          }
          </div>
        ) : (
          // No Results State
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">No Updates Found</h3>
            <p className="text-gray-600 mb-6">No updates match your current filter criteria.</p>
            <button
              onClick={clearFilters}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Section */}
        {filteredUpdates.length > 0 && (
          <div className="text-center mt-12">
            <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Load More Updates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

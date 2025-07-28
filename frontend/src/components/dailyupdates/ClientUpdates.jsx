"use client"
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronDownIcon, ChevronUpIcon, CalendarIcon, FilterIcon, UserIcon, BriefcaseIcon, ClockIcon, ImageIcon, EyeIcon, ArrowLeftIcon, ShareIcon } from 'lucide-react';

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
  },
  {
    id: 4,
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
    id: 5,
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
    id: 6,
    date: '2025-07-21',
    day: '2 days ago',
    text: 'Material order placed. Premium wood quotation received and sent to client for approval.',
    images: [],
    uploadedBy: 'Amit Singh',
    role: 'Salesperson',
    time: '4:20 PM',
    status: 'pending'
  },
  {
    id: 7,
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
    id: 8,
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
];

export default function DailyUpdates() {
  const searchParams = useSearchParams();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [currentView, setCurrentView] = useState('table');
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [visibleCount, setVisibleCount] = useState(6);

  // New state to track if we're showing all items
  const [showingAll, setShowingAll] = useState(false);

  const handleLoadMore = () => {
    if (showingAll) {
      setVisibleCount(6);
      setShowingAll(false);
    } else {
      if (visibleCount + 6 >= filteredUpdates.length) {
        setVisibleCount(filteredUpdates.length);
        setShowingAll(true);
      } else {
        setVisibleCount(prev => prev + 6);
      }
    }
  };

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(6);
    setShowingAll(false);
  }, [selectedDate, selectedRole]);

  // URL - project ID read 
  useEffect(() => {
    const projectId = searchParams.get('id');
    if (projectId) {
      const update = dummyUpdates.find(u => u.id === parseInt(projectId));
      if (update) {
        setSelectedUpdate(update);
        setCurrentView('detail');
      }
    } else {
      setCurrentView('table');
      setSelectedUpdate(null);
    }
  }, [searchParams]);

  const filteredUpdates = useMemo(() => {
    return dummyUpdates.filter(update => {
      const dateMatch = !selectedDate || update.date === selectedDate;
      const roleMatch = !selectedRole || update.role === selectedRole;
      return dateMatch && roleMatch;
    });
  }, [selectedDate, selectedRole]);

  // derive only the first `visibleCount` items
  const updatesToDisplay = filteredUpdates.slice(0, visibleCount);

  const clearFilters = () => {
    setSelectedDate('');
    setSelectedRole('');
  };

  const handleViewDetails = (update) => {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('id', update.id.toString());
    // URL Update without page reload
    window.history.pushState({}, '', currentUrl.toString());

    setSelectedUpdate(update);
    setCurrentView('detail');
  };

  const handleBackToTable = () => {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('id');

    // Remove id from URL
    window.history.pushState({}, '', currentUrl.toString());

    setSelectedUpdate(null);
    setCurrentView('table');
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('Link copied to clipboard!');
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleColor = (role) => {
    return role === 'Carpenter'
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  // Detail Page View
  if (currentView === 'detail' && selectedUpdate) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Detail Page Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="w-full px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToTable}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200"
                >
                  <ArrowLeftIcon className="w-4 h-4" />
                  Back to Updates
                </button>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Update Details - ID: #{selectedUpdate.id}
                  </h1>
                  <p className="text-gray-600 mt-1">{selectedUpdate.day} - {selectedUpdate.date}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 text-blue-700 font-semibold rounded-xl transition-all duration-200"
                >
                  <ShareIcon className="w-4 h-4" />
                  Share Link
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full px-6 py-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">
                    Update Status - Project ID: {selectedUpdate.id}
                  </h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border ${getStatusColor(selectedUpdate.status)}`}>
                    {selectedUpdate.status.replace('-', ' ')}
                  </span>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Date</h3>
                  <p className="text-gray-600">{selectedUpdate.date}</p>
                  <p className="text-sm text-gray-500">{selectedUpdate.day}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Reporter</h3>
                  <p className="text-gray-600">{selectedUpdate.uploadedBy}</p>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(selectedUpdate.role)}`}>
                    {selectedUpdate.role}
                  </span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Time</h3>
                  <p className="text-gray-600">{selectedUpdate.time}</p>
                  <p className="text-sm text-gray-500">Local Time</p>
                </div>
              </div>
            </div>

            {/* Update Description */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                  Update Description
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed text-lg">
                    {selectedUpdate.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Images Section */}
            {selectedUpdate.images && selectedUpdate.images.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-blue-600" />
                    Attached Images ({selectedUpdate.images.length})
                  </h2>
                </div>
                <div className="p-6">
                  <div className={`grid gap-6 ${selectedUpdate.images.length === 1
                    ? 'grid-cols-1 max-w-2xl mx-auto'
                    : selectedUpdate.images.length === 2
                      ? 'grid-cols-1 lg:grid-cols-2'
                      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    }`}>
                    {selectedUpdate.images.map((image, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-xl bg-white border border-gray-200 group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                        onClick={() => setSelectedImage({ url: image, index })}
                      >
                        <img
                          src={image}
                          alt={`Update image ${index + 1}`}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-sm font-semibold text-gray-900">Image {index + 1}</p>
                          <p className="text-xs text-gray-600">Click to view full size</p>
                        </div>
                        <div className="absolute top-4 right-4 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center p-4">
            <div className="relative max-w-5xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
              >
                ×
              </button>
              <img
                src={selectedImage.url}
                alt={`Update image ${selectedImage.index + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                <p className="text-sm">Image {selectedImage.index + 1} of {selectedUpdate.images.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Table View (Default)
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

        {/* Table Format */}
        {filteredUpdates.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Updates Table</h2>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Update Summary
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Reporter
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Images
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {updatesToDisplay.map((update) => (
                    <>
                      {/* Main Table Row */}
                      <tr
                        key={update.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-600">
                            #{update.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{update.day}</div>
                            <div className="text-xs text-gray-500">{update.date}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(update.status)}`}>
                            {update.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {update.text}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                              <UserIcon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {update.uploadedBy}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(update.role)}`}>
                            {update.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <ClockIcon className="w-4 h-4" />
                            {update.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {update.images && update.images.length > 0 ? (
                            <div className="flex items-center gap-1 text-sm text-blue-600">
                              <ImageIcon className="w-4 h-4" />
                              {update.images.length} photo{update.images.length > 1 ? 's' : ''}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">No images</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewDetails(update)}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                            >
                              <EyeIcon className="w-4 h-4" />
                              View Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
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

        {/* Load More/Collapse Toggle Section */}
        {filteredUpdates.length > 6 && (
          <div className='text-center mt-8'>
            <button
              onClick={handleLoadMore}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {showingAll ? (
                <>
                  <ChevronUpIcon className="w-5 h-5" />
                  Collapse Updates
                </>
              ) : (
                <>
                  <ChevronDownIcon className="w-5 h-5" />
                  Load More Updates
                </>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2">
              Showing {visibleCount} of {filteredUpdates.length} updates
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

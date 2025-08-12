
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Calendar,
  User,
  Hammer,
  Image as ImageIcon,
  FileText,
  ArrowLeft,
  Clock,
  Camera,
  MessageSquare,
  ChevronRight,
  Home,
  Filter,
  Search,
  X,
  ZoomIn,
  Download
} from 'lucide-react';
import { deleteDailyUpdate, getAllDailyUpdates, getDailyUpdateById } from '@/services/dailyupdates.services';

// Image Gallery Page Component
const ImageGalleryPage = ({ update, dailyUpdate, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dailyUpdate.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + dailyUpdate.images.length) % dailyUpdate.images.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="group flex items-center px-6 py-3 text-blue-600 hover:text-white bg-white hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            <span className="font-medium">Back to Updates</span>
          </button>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-slate-600 bg-white px-4 py-2 rounded-lg shadow-md">
              <Camera className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Image Gallery</span>
            </div>
            <div className="h-6 w-px bg-slate-300"></div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Daily Progress Images
            </h1>
          </div>
        </div>

        {/* Project & Date Info */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">{update.projectName}</h2>
                <div className="flex items-center space-x-4 text-slate-600 mt-1">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="font-medium">{update.carpenterName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-emerald-600" />
                    <span>{new Date(dailyUpdate.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-amber-600" />
                    <span>{dailyUpdate.time}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4">
                <div className="text-center bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium">Total Images</div>
                  <div className="text-lg font-bold text-blue-700">{dailyUpdate.images.length}</div>
                </div>
                <div className="text-center bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                  <div className="text-sm text-emerald-600 font-medium">Current</div>
                  <div className="text-lg font-bold text-emerald-700">{currentImageIndex + 1}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Description */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Work Progress Description</h3>
              <p className="text-slate-700 leading-relaxed">{dailyUpdate.text}</p>
            </div>
          </div>
        </div>

        {/* Main Image Display */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Progress Images</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">
                  Image {currentImageIndex + 1} of {dailyUpdate.images.length}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevImage}
                    disabled={dailyUpdate.images.length <= 1}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextImage}
                    disabled={dailyUpdate.images.length <= 1}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-video bg-slate-100">
              <img
                src={dailyUpdate.images[currentImageIndex]?.url}
                alt={dailyUpdate.images[currentImageIndex]?.caption}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Navigation Overlay Buttons */}
            {dailyUpdate.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
                >
                  <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-slate-700" />
                </button>
              </>
            )}
          </div>

          {/* Image Caption */}
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-800 mb-1">
                  {dailyUpdate.images[currentImageIndex]?.caption}
                </h4>
                <p className="text-sm text-slate-600">
                  Work progress captured on {new Date(dailyUpdate.date).toLocaleDateString('en-IN')} at {dailyUpdate.time}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  View Full Size
                </button>
                <button className="flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-sm font-medium">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Thumbnails */}
        {dailyUpdate.images.length > 1 && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">All Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {dailyUpdate.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                >
                  <img
                    src={image.url}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                  />
                  {index === currentImageIndex && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <Camera className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function AdminDailyUpdates() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [updates, setUpdates] = useState([]);
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [selectedDailyUpdate, setSelectedDailyUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [projects, setProjects] = useState([]);

  // Get URL params
  const updateId = searchParams.get('id');
  const dateParam = searchParams.get('date');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const data = await getAllDailyUpdates();
        console.log("All Daily Updates:", data); // Log for debugging
        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
      }
    };

    fetchUpdates();
  }, []);
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getMyProjects();
        // Assuming backend sends array of projects
        setProjects(res.data || []);
      } catch (error) {
        console.error("Error fetching project names:", error);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchUpdateDetails = async () => {
      if (updateId) {
        try {
          const updateData = await getDailyUpdateById(updateId);
          console.log("Single Update Data:", updateData);
          setSelectedUpdate(updateData);

          if (dateParam && updateData) {
            const dailyUpdate = updateData.dailyUpdates.find(
              du => du.date === dateParam
            );
            setSelectedDailyUpdate(dailyUpdate);
          } else {
            setSelectedDailyUpdate(null);
          }
        } catch (error) {
          console.error("Error fetching update by ID:", error);
        }
      } else {
        setSelectedUpdate(null);
        setSelectedDailyUpdate(null);
      }
    };

    fetchUpdateDetails();
  }, [updateId, dateParam]);


  const handleDeleteDailyUpdate = async (updateId, dailyUpdateId) => {
    try {
      const res = await deleteDailyUpdate(updateId, dailyUpdateId);
      console.log("Deleted Daily Update:", res);
      // Refresh data
      const data = await getAllDailyUpdates();
      setUpdates(data);
    } catch (error) {
      console.error("Error deleting daily update:", error);
    }
  };


  const handleUpdateClick = (update) => {
    router.push(`?id=${update.id}`);
  };

  const handleBackClick = () => {
    router.push(window.location.pathname);
  };

  const handleBackToProject = () => {
    router.push(`?id=${selectedUpdate.id}`);
  };

  const handleViewImages = (dailyUpdate) => {
    console.log("Viewing Daily Update:", dailyUpdate);

    router.push(`?id=${selectedUpdate.id}&date=${dailyUpdate.date}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'On Hold':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.carpenterName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || update.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Show Image Gallery Page
  if (selectedUpdate && selectedDailyUpdate) {
    return (
      <ImageGalleryPage
        update={selectedUpdate}
        dailyUpdate={selectedDailyUpdate}
        onBack={handleBackToProject}
      />
    );
  }

  // Show Project Details Page
  if (selectedUpdate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackClick}
              className="group flex items-center px-6 py-3 text-blue-600 hover:text-white bg-white hover:bg-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Updates</span>
            </button>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-slate-600 bg-white px-4 py-2 rounded-lg shadow-md">
                <Home className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Carpenter Updates</span>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Daily Progress Details
              </h1>
            </div>
          </div>

          {/* Project Info Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Hammer className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedUpdate.projectName}</h2>
                  <div className="flex items-center space-x-4 text-slate-600 mb-3">
                    <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg">
                      <User className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="font-medium">{selectedUpdate.carpenterName}</span>
                    </div>
                    <div className="flex items-center bg-slate-50 px-3 py-2 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-600" />
                      <span>Last Update: {formatDate(selectedUpdate.lastUpdateDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <span className="bg-blue-50 px-3 py-1 rounded-lg">📍 {selectedUpdate.location}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUpdate.status)}`}>
                      {selectedUpdate.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center bg-blue-50 p-4 rounded-xl border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium">Total Updates</div>
                    <div className="text-xl font-bold text-blue-700">{selectedUpdate.totalUpdates}</div>
                  </div>
                  <div className="text-center bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <div className="text-sm text-emerald-600 font-medium">Images</div>
                    <div className="text-xl font-bold text-emerald-700">{selectedUpdate.totalImages}</div>
                  </div>
                  <div className="text-center bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <div className="text-sm text-amber-600 font-medium">Text Updates</div>
                    <div className="text-xl font-bold text-amber-700">{selectedUpdate.totalTexts}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Updates Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800">Daily Progress Updates</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Progress Description</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Images</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedUpdate.dailyUpdates.map((update) => (
                    <tr key={update.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800">{formatDate(update.date)}</div>
                            <div className="text-sm text-slate-500 flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {update.time}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <div className="flex items-start space-x-2">
                            <MessageSquare className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                            <p className="text-slate-700 leading-relaxed">{update.text}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="flex items-center bg-blue-50 px-3 py-1 rounded-lg">
                            <Camera className="w-4 h-4 mr-1 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">{update.images.length}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleViewImages(update)}
                          className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <ImageIcon className="w-4 h-4 mr-2" />
                          View Images
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-3 bg-white p-6">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 text-slate-600 bg-white px-4 py-2 rounded-lg shadow-md">
            <Hammer className="w-6 h-6 text-blue-600" />
            <span className="font-medium text-lg">Carpenter Daily Updates</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search projects or carpenters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-80 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">

        {/* Updates Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-800">Project Updates</h2>
              <div className="text-sm text-slate-500">
                Showing {filteredUpdates.length} of {updates.length} projects
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Project Details</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Carpenter</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Last Update</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Progress Stats</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUpdates.map((update) => (
                  <tr key={update.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                          <Hammer className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{update.projectName}</div>
                          <div className="text-sm text-slate-500">📍 {update.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-800">{update.carpenterName}</div>
                          <div className="text-sm text-slate-500">Carpenter</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700">{formatDate(update.lastUpdateDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-blue-700">{update.totalUpdates}</div>
                          <div className="text-xs text-slate-500">Updates</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-emerald-700">{update.totalImages}</div>
                          <div className="text-xs text-slate-500">Images</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-amber-700">{update.totalTexts}</div>
                          <div className="text-xs text-slate-500">Texts</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(update.status)}`}>
                        {update.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleUpdateClick(update)}
                        className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Details
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
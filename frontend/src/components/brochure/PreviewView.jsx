"use client"
import React, { useState } from 'react';
import { 
  ArrowLeft, Download, Star, Share2, Eye, Calendar, MapPin, 
  User, DollarSign, Home, FileText, Tag, Maximize2, 
  ChevronLeft, ChevronRight, Palette, Heart, Bookmark
} from 'lucide-react';

const PreviewView = ({ 
  selectedBrochure, 
  setCurrentView, 
  handleDownload, 
  toggleStar, 
  brochures,
  setSelectedBrochure 
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!selectedBrochure) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Design Selected</h2>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentIndex = brochures.findIndex(b => b.id === selectedBrochure.id);
  const previousBrochure = currentIndex > 0 ? brochures[currentIndex - 1] : null;
  const nextBrochure = currentIndex < brochures.length - 1 ? brochures[currentIndex + 1] : null;

  const navigateToDesign = (brochure) => {
    setSelectedBrochure(brochure);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareDesign = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedBrochure.name,
          text: selectedBrochure.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Design Preview</h1>
                <p className="text-sm text-gray-500">Detailed view of interior design</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => toggleStar(selectedBrochure.id)}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  selectedBrochure.starred 
                    ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                    : 'text-gray-400 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <Star className="w-5 h-5" />
              </button>
              <button
                onClick={shareDesign}
                className="p-3 rounded-xl text-gray-600 bg-gray-50 hover:bg-gray-100 transition-all duration-200"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDownload(selectedBrochure)}
                className="bg-gradient-to-r from-blue-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-700 transition-all duration-300 flex items-center space-x-2 font-medium"
              >
                <Download className="w-5 h-5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm overflow-hidden">
              <div className="relative group">
                <img
                  src={selectedBrochure.thumbnail}
                  alt={selectedBrochure.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setIsImageExpanded(true)}
                    className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:bg-white transition-all duration-200"
                  >
                    <Maximize2 className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  {selectedBrochure.type}
                </div>
              </div>
            </div>

            {/* Additional Images Gallery */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Gallery</h3>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-all duration-200">
                    <img
                      src={`/api/placeholder/200/200`}
                      alt={`Gallery ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Main Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedBrochure.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{selectedBrochure.downloads} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(selectedBrochure.uploadDate)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <Bookmark className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedBrochure.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Designer</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.designer}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Category</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.category}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.projectLocation}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Year</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.projectYear}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Home className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Space Type</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.spaceType || 'Residential'}</p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Budget Range</span>
                    </div>
                    <p className="text-gray-900 font-semibold">{selectedBrochure.budgetRange || 'Premium'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Specifications */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Specifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Area Coverage</span>
                  <span className="text-gray-900 font-medium">{selectedBrochure.areaCoverage || '2,500 sq ft'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Completion Time</span>
                  <span className="text-gray-900 font-medium">{selectedBrochure.completionTime || '6 months'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Style</span>
                  <span className="text-gray-900 font-medium">{selectedBrochure.style || 'Modern Contemporary'}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Features</span>
                  <span className="text-gray-900 font-medium">{selectedBrochure.features || 'Smart Home Integration'}</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {(selectedBrochure.tags || ['Modern', 'Luxury', 'Residential', 'Premium', 'Contemporary']).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200/50">
          <div className="flex items-center space-x-4">
            {previousBrochure && (
              <button
                onClick={() => navigateToDesign(previousBrochure)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
                <div className="text-left">
                  <div className="text-sm text-gray-500">Previous</div>
                  <div className="font-medium">{previousBrochure.name}</div>
                </div>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {nextBrochure && (
              <button
                onClick={() => navigateToDesign(nextBrochure)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <div className="text-right">
                  <div className="text-sm text-gray-500">Next</div>
                  <div className="font-medium">{nextBrochure.name}</div>
                </div>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Image Modal */}
      {isImageExpanded && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="max-w-6xl max-h-full">
            <div className="relative">
              <button
                onClick={() => setIsImageExpanded(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors duration-200 z-10"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedBrochure.thumbnail}
                alt={selectedBrochure.name}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewView;
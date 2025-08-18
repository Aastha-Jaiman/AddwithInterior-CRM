"use client";

import React from "react";
import {
  ArrowLeft, Edit3, Calendar, MapPin, DollarSign,
  User, Phone, Mail, FileText, Users, Download, Camera,
  Calendar1,
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

const ProjectDetails = ({ selectedProject, navigateToList, navigateToEdit, handleDownloadDocument }) => {
  const [expandedRows, setExpandedRows] = React.useState({});
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [expandedDesigns, setExpandedDesigns] = React.useState({});

  // Get filtered daily updates based on selected date (5 days from selected date)
  const getFilteredUpdates = () => {
    if (!selectedProject.dailyUpdates?.length) return [];

    const endDate = new Date(selectedDate);
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 4); // 5 days total (including selected date)

    return selectedProject.dailyUpdates
      .flatMap(updateGroup =>
        updateGroup.dailyUpdates.map(update => ({
          ...update,
          date: new Date(update.createdAt)
        }))
      )
      .filter(update => {
        const updateDate = new Date(update.date.toDateString());
        const start = new Date(startDate.toDateString());
        const end = new Date(endDate.toDateString());
        return updateDate >= start && updateDate <= end;
      })
      .sort((a, b) => b.date - a.date); // Sort by newest first
  };

  // Calendar Dropdown Component
  const CalendarDropdown = () => {
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = selectedDate.toDateString() === date.toDateString();
      const isToday = today.toDateString() === date.toDateString();

      // Check if there are updates on this date
      const hasUpdates = selectedProject.dailyUpdates?.some(updateGroup =>
        updateGroup.dailyUpdates.some(update => {
          const updateDate = new Date(update.createdAt);
          return updateDate.toDateString() === date.toDateString();
        })
      );

      days.push(
        <button
          key={day}
          onClick={() => {
            setSelectedDate(date);
            setIsCalendarOpen(false); // Close dropdown after selection
          }}
          className={`
            h-8 w-8 rounded-full text-sm font-medium transition-colors
            ${isSelected
              ? 'bg-blue-600 text-white'
              : isToday
                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                : hasUpdates
                  ? 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="relative">
        {/* Dropdown Trigger */}
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <Calendar className="w-4 h-4" />
          <span className="text-sm font-medium">
            {selectedDate.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Calendar */}
        {isCalendarOpen && (
          <div className="absolute top-full left-0 mt-2 z-50 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {monthNames[month]} {year}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentMonth(new Date(year, month - 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date(year, month + 1))}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days}
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 dark:bg-green-900/30 rounded-full"></div>
                  <span>Has updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 dark:bg-blue-900/30 rounded-full"></div>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-800 dark:text-yellow-300",
        border: "border-yellow-200 dark:border-yellow-800",
      },
      uploaded: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-800 dark:text-blue-300",
        border: "border-blue-200 dark:border-blue-800",
      },
      finalize: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-300",
        border: "border-green-200 dark:border-green-800",
      },
    };

    const config = statusConfig[status?.toLowerCase()];

    if (!config) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600">
          {status || "Unknown"}
        </span>
      );
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const InfoCard = ({ icon, title, children, className = "" }) => (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );

  const InfoItem = ({ label, value, icon }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 sm:mb-0">
        {icon && icon}
        {label}
      </div>
      <div className="text-sm sm:text-right text-gray-900 dark:text-white font-medium">
        {value}
      </div>
    </div>
  );

  const filteredUpdates = getFilteredUpdates();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={navigateToList}
            className="pt-4 pl-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Projects</span>
          </button>
          <div className="p-4 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      Array.isArray(selectedProject.projectImages)
                        ? selectedProject.projectImages[0]?.url
                        : selectedProject.projectImages?.url
                    }
                    alt={selectedProject.title}
                    className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedProject.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedProject.category}
                      </span>
                      {selectedProject.designStatus && getStatusBadge(selectedProject.designStatus)}
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={navigateToEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-fit"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Project</span>
              </button>
            </div>

            {selectedProject.description && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {selectedProject.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Side - Project Information */}
          <div className="xl:col-span-2 space-y-6">
            {/* Budget & Timeline */}
            <InfoCard icon={<DollarSign className="w-5 h-5" />} title="Budget & Timeline">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Estimated Budget
                  </div>
                  <div className="text-lg font-bold text-blue-900 dark:text-blue-200">
                    ₹{selectedProject.estimatedBudget?.toLocaleString()}
                  </div>
                </div>

                {selectedProject.finalBudget && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                    <div className="text-sm font-medium text-green-800 dark:text-green-300 mb-1">
                      Final Budget
                    </div>
                    <div className="text-lg font-bold text-green-900 dark:text-green-200">
                      ₹{selectedProject.finalBudget.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 space-y-2">
                <InfoItem
                  label="Starting Date"
                  value={new Date(selectedProject.startingDate).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <InfoItem
                  label="Location"
                  value={selectedProject.location}
                  icon={<MapPin className="w-4 h-4" />}
                />
                <InfoItem
                  label="Category"
                  value={selectedProject.category}
                  icon={<FileText className="w-4 h-4" />}
                />
              </div>
            </InfoCard>

            {/* Customer Information */}
            <InfoCard icon={<User className="w-5 h-5" />} title="Customer Information">
              <div className="space-y-2">
                <InfoItem
                  label="Customer Name"
                  value={selectedProject.client?.name}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Phone Number"
                  value={selectedProject.client?.phone}
                  icon={<Phone className="w-4 h-4" />}
                />
                {selectedProject.customerEmail && (
                  <InfoItem
                    label="Email"
                    value={selectedProject.client?.email}
                    icon={<Mail className="w-4 h-4" />}
                  />
                )}
                {selectedProject.customerAddress && (
                  <InfoItem
                    label="Address"
                    value={selectedProject.client?.address}
                    icon={<MapPin className="w-4 h-4" />}
                  />
                )}
              </div>
            </InfoCard>

            {/* Team Information */}
            <InfoCard icon={<Users className="w-5 h-5" />} title="Team Information">
              <div className="space-y-2">
                <InfoItem
                  label="Salesperson"
                  value={selectedProject.salesperson?.name}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Designer"
                  value={selectedProject.designer?.name}
                  icon={<User className="w-4 h-4" />}
                />
                <InfoItem
                  label="Carpenter"
                  value={selectedProject.carpenter?.name}
                  icon={<Users className="w-4 h-4" />}
                />
              </div>
            </InfoCard>
          </div>

          {/* Right Side - Documents and Designs */}
          <div className="xl:col-span-2 space-y-6">
            {/* Documents Section */}
            <InfoCard icon={<FileText className="w-5 h-5" />} title="Documents">
              <div className="space-y-3">
                {/* Rough Quotation */}
                {selectedProject.documents?.roughQuotation && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Rough Quotation
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedProject._id,
                          'roughQuotation',
                          selectedProject.documents.roughQuotation.filename
                        )}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.documents.roughQuotation.filename}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {selectedProject.documents.roughQuotation.uploadDate}
                    </div>
                  </div>
                )}

                {/* Final Quotation */}
                {selectedProject.documents?.finalQuotation && (
                  <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Final Quotation
                        </span>
                      </div>
                      <button
                        onClick={() => handleDownloadDocument(
                          selectedProject._id,
                          'finalQuotation',
                          selectedProject.documents.finalQuotation.filename
                        )}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedProject.documents.finalQuotation.filename}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Uploaded: {selectedProject.documents.finalQuotation.uploadDate}
                    </div>
                  </div>
                )}

                {/* Show message if no documents */}
                {!selectedProject.documents?.roughQuotation &&
                  !selectedProject.documents?.finalQuotation && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No documents uploaded yet</p>
                    </div>
                  )}
              </div>
            </InfoCard>

            {/* Designs Section */}
            <InfoCard icon={<FileText className="w-5 h-5" />} title="Design Files & Approval History">
              <div className="space-y-8">
                {selectedProject.designs?.length > 0 ? (
                  selectedProject.designs.map((design, designIndex) => (
                    <div key={design._id || designIndex} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                              Design #{designIndex + 1}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Created: {design.createdAt ? new Date(design.createdAt).toLocaleDateString('en-IN') : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-4">
                        {/* PDFs Section */}
                        {design.pdfs?.length > 0 ? (
                          <div className="space-y-6">
                            {design.pdfs.map((pdf, pdfIndex) => {
                              const pdfFeedbackHistory = (design.approvalHistory || []).filter(
                                (h) => h.versionSelect === pdf.version
                              );
                              return (
                                <div
                                  key={pdf._id || pdfIndex}
                                  className="border border-gray-100 dark:border-gray-700 rounded p-3 mb-4"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-gray-900 dark:text-white">
                                        Document {designIndex + 1}.{pdfIndex + 1}: {pdf.message || "Untitled Design PDF"}
                                      </div>
                                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-1">
                                        <div>
                                          <strong>Version:</strong> {pdf.version}
                                        </div>
                                        <div>
                                          <strong>Uploaded:</strong> {new Date(pdf.uploadedAt).toLocaleString("en-IN")}
                                        </div>
                                        <div>
                                          <strong>By:</strong> {pdf.uploadedBy?.name} ({pdf.uploadedBy?.email})
                                        </div>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => window.open(pdf.pdfUrl, "_blank")}
                                      className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                      title="Download"
                                    >
                                      <Download className="w-4 h-4" />
                                    </button>
                                  </div>
                                  {/* FEEDBACK history directly below this PDF */}
                                  {pdfFeedbackHistory.length > 0 && (
                                    <div className="mt-3">
                                      <h5 className="text-sm font-semibold mb-2 text-gray-700 dark:text-white flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Feedback History
                                      </h5>
                                      <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                                        {pdfFeedbackHistory.map((h, hi) => (
                                          <li key={h._id || hi} className="border-b border-gray-100 dark:border-gray-700 pb-1">
                                            <span className={`mr-2 font-bold ${h.isApproved ? "text-green-700" : "text-red-700"}`}>
                                              {h.isApproved ? "Approved" : "Rejected"}
                                            </span>
                                            (Document {designIndex + 1} Version {h.versionSelect}) - {h.feedbackMessage}
                                            <span className="ml-2 text-xs text-gray-400">
                                              {h.updatedAt ? new Date(h.updatedAt).toLocaleDateString("en-IN") : ""}
                                            </span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                            <FileText className="w-5 h-5 mx-auto mb-1 opacity-50" />
                            <span>No design files uploaded yet</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No design files uploaded yet</p>
                  </div>
                )}
              </div>
            </InfoCard>

          </div>
        </div>

        {/* Daily Updates with Calendar Dropdown */}
        {selectedProject.dailyUpdates?.length > 0 && (
          <div className="mt-12">
            <InfoCard
              icon={<Calendar1 className="w-5 h-5" />}
              title="Daily Updates"
            >
              {/* Calendar Dropdown and Info */}
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CalendarDropdown />
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Showing updates from last 5 days (including selected date)
                  </div>
                </div>

                {/* Date Range Display */}
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Date Range:</strong> {
                      (() => {
                        const endDate = new Date(selectedDate);
                        const startDate = new Date(selectedDate);
                        startDate.setDate(startDate.getDate() - 4);
                        return `${startDate.toLocaleDateString('en-IN')} to ${endDate.toLocaleDateString('en-IN')}`;
                      })()
                    }
                  </div>
                </div>
              </div>

              {/* Updates Table */}
              {filteredUpdates.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-700 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <th className="px-4 py-2">Date</th>
                        <th className="px-4 py-2">Time of Day</th>
                        <th className="px-4 py-2">Uploaded By</th>
                        <th className="px-4 py-2">Role</th>
                        <th className="px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                      {filteredUpdates.map((update) => (
                        <React.Fragment key={update._id}>
                          <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <td className="px-4 py-2">
                              {update.date.toLocaleDateString('en-IN')}
                            </td>
                            <td className="px-4 py-2 capitalize">{update.type}</td>
                            <td className="px-4 py-2">{update.uploadedBy?.name}</td>
                            <td className="px-4 py-2">{update.uploadedBy?.role}</td>
                            <td className="px-4 py-2">
                              <button
                                onClick={() =>
                                  setExpandedRows((prev) => ({
                                    ...prev,
                                    [update._id]: !prev[update._id],
                                  }))
                                }
                                className="text-blue-600 hover:text-blue-800 transition"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                            </td>
                          </tr>

                          {expandedRows[update._id] && (
                            <tr className="bg-gray-50 dark:bg-gray-700">
                              <td colSpan={5} className="px-4 py-4">
                                <div className="text-sm text-gray-800 dark:text-gray-200 mb-2">
                                  <strong>Message:</strong> {update.message}
                                </div>
                                {update.images?.length > 0 && (
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                                    {update.images.map((img, i) => (
                                      <img
                                        key={img._id || i}
                                        src={img.url}
                                        alt={`Update Image ${i + 1}`}
                                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => window.open(img.url, '_blank')}
                                      />
                                    ))}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar1 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No updates found for the selected date range</p>
                </div>
              )}
            </InfoCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;

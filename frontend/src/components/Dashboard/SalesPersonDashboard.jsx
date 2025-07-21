"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Users,
  User,
  FolderOpen,
  Clock,
  BarChart3,
  Calendar,
  UserPlus,
  UserCheck,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  TrendingUp,
  CheckCircle,
  Home,
  ChevronDown,
  Activity,
  Star,
  Eye,
  Download,
  Plus,
  Briefcase,
  Send,
} from "lucide-react";

const SalesPersonDashboard = () => {
  const statsCards = [
    {
      title: "Total Sales",
      value: "$245,000",
      change: "+$15,000 this month",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Active Leads",
      value: "62",
      change: "+8 today",
      trend: "up",
      icon: UserPlus,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Quotations Sent",
      value: "35",
      change: "+5 this week",
      trend: "up",
      icon: Send,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Projects Handled",
      value: "22",
      change: "+2 this month",
      trend: "up",
      icon: Briefcase,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "Quotation sent",
      user: "TechCorp",
      time: "9:00 AM",
      type: "quotation",
      icon: Send,
    },
    {
      id: 2,
      action: "Lead converted",
      user: "Jane Smith",
      time: "11:30 AM",
      type: "lead",
      icon: UserCheck,
    },
    {
      id: 3,
      action: "Project assigned",
      user: "Office Furniture",
      time: "2:00 PM",
      type: "project",
      icon: Briefcase,
    },
    {
      id: 4,
      action: "Client meeting scheduled",
      user: "ABC Corp",
      time: "4:00 PM",
      type: "meeting",
      icon: Calendar,
    },
    {
      id: 5,
      action: "Daily update logged",
      user: "Sales Report",
      time: "6:00 PM",
      type: "update",
      icon: FileText,
    },
  ];

  const dailyUpdates = [
    {
      id: 1,
      date: "July 21, 2025",
      update:
        "Closed deal with TechCorp ($25,000), followed up with 3 leads, sent 2 quotations",
      status: "On Track",
    },
    {
      id: 2,
      date: "July 20, 2025",
      update:
        "Met with ABC Corp, prepared quotation for Office Furniture, updated CRM",
      status: "Completed",
    },
    {
      id: 3,
      date: "July 19, 2025",
      update:
        "Followed up with 5 leads, scheduled meeting with XYZ Industries, logged sales report",
      status: "On Track",
    },
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      quotation: Send,
      lead: UserCheck,
      project: Briefcase,
      meeting: Calendar,
      update: FileText,
    };
    return iconMap[type] || Activity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-blue-50/40 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Salesperson Dashboard
                </h1>
                <p className="text-sm text-gray-500 font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative sm:flex hidden">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search clients or projects..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm transition-all w-64"
                  />
                </div>
                <button className="relative p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  <Bell size={20} className="text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    6
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <div className="space-y-8">
            <div className="relative mb-10 lg:hidden md:hidden w-full">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search clients or projects..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-300 shadow-sm transition-all w-64"
              />
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 via-blue-600 to-blue-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                  Good morning, Salesperson!
                </h1>
                <p className="text-blue-100 text-lg">
                  Here's an overview of your sales activities today.
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-lg transition-all duration-300 p-6 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-7 h-7 text-white" />
                    </div>
                    <div
                      className={`flex items-center space-x-1 ${stat.textColor} text-sm font-medium`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activities and Daily Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Recent Activities
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      <span className="text-sm text-gray-500">Live</span>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    {recentActivities.map((activity) => {
                      const IconComponent = getActivityIcon(activity.type);
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150"
                        >
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.user}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                            {activity.time}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Daily Updates */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Daily Updates
                    </h3>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>View All</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {dailyUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {update.date}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              update.status === "On Track"
                                ? "bg-green-100 text-green-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {update.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>{update.update}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    label: "Log Daily Update",
                    icon: FileText,
                    color: "from-blue-500 to-blue-600",
                  },
                  {
                    label: "Generate Quotation",
                    icon: Send,
                    color: "from-yellow-500 to-yellow-600",
                  },
                  {
                    label: "Add New Project",
                    icon: Briefcase,
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    label: "Add New Lead",
                    icon: UserPlus,
                    color: "from-green-500 to-green-600",
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">
                      {action.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SalesPersonDashboard;

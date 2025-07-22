"use client";
import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Palette,
  Users,
  User,
  FolderOpen,
  CreditCard,
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
  DollarSign,
  Clock,
  CheckCircle,
  Home,
  ChevronDown,
  Activity,
  Star,
  Eye,
  Download,
  Plus,
} from "lucide-react";

const DesignerDashboard = () => {
  const statsCards = [
    {
      title: "Total Designs Uploaded",
      value: "245",
      change: "+15 this month",
      trend: "up",
      icon: Palette,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "from-indigo-50 to-indigo-100",
      textColor: "text-indigo-600",
    },
    {
      title: "Designs Pending",
      value: "32",
      change: "+5 today",
      trend: "up",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "from-yellow-50 to-yellow-100",
      textColor: "text-yellow-600",
    },
    {
      title: "Designs Finalized",
      value: "189",
      change: "+12 this month",
      trend: "up",
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Active Clients",
      value: "45",
      change: "+2 this week",
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New design uploaded",
      user: "Project Beta",
      time: "10 minutes ago",
      type: "design",
      icon: Palette,
    },
    {
      id: 2,
      action: "Client feedback received",
      user: "TechCorp",
      time: "1 hour ago",
      type: "feedback",
      icon: UserCheck,
    },
    {
      id: 3,
      action: "Design finalized",
      user: "BrandX Logo",
      time: "3 hours ago",
      type: "finalized",
      icon: CheckCircle,
    },
    {
      id: 4,
      action: "Revision requested",
      user: "ABC Corp",
      time: "5 hours ago",
      type: "revision",
      icon: FileText,
    },
    {
      id: 5,
      action: "New client assigned",
      user: "XYZ Designs",
      time: "8 hours ago",
      type: "client",
      icon: UserPlus,
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Review client feedback for Logo V2",
      time: "11:00 AM",
      priority: "high",
      category: "Feedback",
    },
    {
      id: 2,
      task: "Complete wireframe for Website Redesign",
      time: "3:00 PM",
      priority: "medium",
      category: "Design",
    },
    {
      id: 3,
      task: "Submit final assets to BrandX",
      time: "5:00 PM",
      priority: "high",
      category: "Delivery",
    },
    {
      id: 4,
      task: "Team design sync meeting",
      time: "9:30 AM Tomorrow",
      priority: "medium",
      category: "Meeting",
    },
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      design: Palette,
      feedback: UserCheck,
      finalized: CheckCircle,
      revision: FileText,
      client: UserPlus,
    };
    return iconMap[type] || Activity;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-indigo-50/40 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-40 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Designer Dashboard
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
                    placeholder="Search designs..."
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 shadow-sm transition-all w-64"
                  />
                </div>
                <button className="relative p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  <Bell size={20} className="text-gray-600" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    4
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
                placeholder="Search designs..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-300 shadow-sm transition-all w-64"
              />
            </div>

            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">
                  Good morning, Designer!
                </h1>
                <p className="text-indigo-100 text-lg">
                  Here's an overview of your design projects today.
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

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Recent Activities
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-indigo-500" />
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
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-indigo-100 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-indigo-600" />
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

              {/* Upcoming Tasks */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-sm">
                <div className="p-6 border-b border-gray-200/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Upcoming Tasks
                    </h3>
                    <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors duration-150 group"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-4 h-4 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-500 shadow-lg shadow-red-200"
                                : task.priority === "medium"
                                ? "bg-yellow-500 shadow-lg shadow-yellow-200"
                                : "bg-green-500 shadow-lg shadow-green-200"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {task.task}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {task.time}
                              </span>
                              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {task.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <CheckCircle
                          size={20}
                          className="text-gray-300 hover:text-green-500 cursor-pointer group-hover:scale-110 transition-all duration-200"
                        />
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
                    label: "Upload Design",
                    icon: Palette,
                    color: "from-indigo-500 to-indigo-600",
                  },
                  {
                    label: "Review Feedback",
                    icon: UserCheck,
                    color: "from-purple-500 to-purple-600",
                  },
                  {
                    label: "Start New Project",
                    icon: FolderOpen,
                    color: "from-emerald-500 to-emerald-600",
                  },
                  {
                    label: "Export Assets",
                    icon: Download,
                    color: "from-orange-500 to-orange-600",
                  },
                ].map((action, index) => (
                  <button
                    key={index}
                    className="p-4 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 group"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
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

export default DesignerDashboard;

import React, { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Users,
  UsersRound,
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
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "brochure", label: "Brochure", icon: FileText },
    { id: "quotation", label: "Quotation", icon: Calculator },
    { id: "staff-users", label: "Staff & Users", icon: Users },
    { id: "clients", label: "Clients", icon: UsersRound },
    { id: "projects", label: "Projects", icon: FolderOpen },
    { id: "payment-history", label: "Payment History", icon: CreditCard },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "daily-updates", label: "Daily Updates", icon: Calendar },
    { id: "register-staff", label: "Register Staff", icon: UserPlus },
    { id: "register-client", label: "Register Client", icon: UserCheck },
    { id: "services", label: "Services", icon: Settings },
  ];

  const statsCards = [
    {
      title: "Total Revenue",
      value: "$124,500",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Active Projects",
      value: "28",
      change: "+3",
      icon: FolderOpen,
      color: "text-blue-600",
    },
    {
      title: "Total Clients",
      value: "156",
      change: "+8",
      icon: UsersRound,
      color: "text-purple-600",
    },
    {
      title: "Pending Tasks",
      value: "12",
      change: "-2",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New client registered",
      user: "John Doe",
      time: "2 minutes ago",
    },
    {
      id: 2,
      action: "Project milestone completed",
      user: "Project Alpha",
      time: "15 minutes ago",
    },
    { id: 3, action: "Payment received", user: "ABC Corp", time: "1 hour ago" },
    {
      id: 4,
      action: "Staff member added",
      user: "Sarah Wilson",
      time: "3 hours ago",
    },
    {
      id: 5,
      action: "Quotation sent",
      user: "XYZ Industries",
      time: "5 hours ago",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      task: "Client meeting with TechCorp",
      time: "10:00 AM",
      priority: "high",
    },
    {
      id: 2,
      task: "Project review - Website Redesign",
      time: "2:00 PM",
      priority: "medium",
    },
    { id: 3, task: "Send monthly report", time: "4:30 PM", priority: "low" },
    {
      id: 4,
      task: "Team standup meeting",
      time: "9:00 AM Tomorrow",
      priority: "medium",
    },
  ];

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm border p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm mt-1 ${stat.color}`}>
                        {stat.change}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-full bg-gray-50 ${stat.color}`}
                    >
                      <stat.icon size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts and Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-500">
                            {activity.user}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Upcoming Tasks
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-500"
                                : task.priority === "medium"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {task.task}
                            </p>
                            <p className="text-xs text-gray-500">{task.time}</p>
                          </div>
                        </div>
                        <CheckCircle
                          size={16}
                          className="text-gray-400 hover:text-green-500 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <div className="mb-4">
              {sidebarItems.find((item) => item.id === activeTab)?.icon &&
                React.createElement(
                  sidebarItems.find((item) => item.id === activeTab)?.icon,
                  {
                    size: 48,
                    className: "mx-auto text-gray-400",
                  }
                )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {sidebarItems.find((item) => item.id === activeTab)?.label}
            </h2>
            <p className="text-gray-600">
              This section is under development. Content for{" "}
              {sidebarItems.find((item) => item.id === activeTab)?.label} will
              be displayed here.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <main className="flex-1 p-6">{renderDashboardContent()}</main>
      </div>
    </div>
  );
};

export default AdminDashboard;

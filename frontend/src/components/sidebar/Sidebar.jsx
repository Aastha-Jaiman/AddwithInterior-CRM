"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  MessageSquareQuote,
  FileText,
  ChevronRight,
  ChevronLeft,
  User2,
  Users,
  ReceiptIndianRupee,
  NotebookPen,
  MessageSquareText,
  Wrench,
  LogOut,
  FileQuestion,
} from "lucide-react";

import { routePermissionMap } from "../ProtectedRoute/routePermissions";
import { logout } from "../../store/authSlice";
import { logoutService } from "@/services/admin.services";
import { logoutClient } from "@/services/client.services";
import { useSelector, useDispatch } from "react-redux";

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [collapsed, setCollapsed] = useState(false);
  // const [userRole, setUserRole] = useState(null);
  // const [userName, setUserName] = useState("");
  // // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const userRole = user?.role || null;
  const userName = user?.name || user?.email || "User";

    useEffect(() => {
    // Handle responsive sidebar behavior
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
        setCollapsed(false);
      } else if (window.innerWidth < 1024) {
        setCollapsed(true);
        setSidebarOpen(true);
      } else {
        setCollapsed(false);
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const checkPermission = (routePath) => {
    const required = routePermissionMap[routePath];
    console.log(required);

    // Admin bypass
    if (user?.role === "admin") return true;

    // No requirement at all (brochure)
    if (!required) return true;

    // If single permission (string)
    if (typeof required === "string") {
      return user?.permission?.includes(required);
    }

    if (Array.isArray(required)) {
      return required.some((perm) => user?.permission?.includes(perm));
    }

    return false;
  };

  const handleNavigation = (href) => {
    router.push(href);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = async () => {
  setLoading(true);
  try {
    if (userRole === "client") {
      await logoutClient();
    } else {
      await logoutService();
    }
  } catch (err) {
    console.error("Logout API failed, proceeding with local logout", err);
  } finally {
    setLoading(false);
    dispatch(logout());
    router.push("/login"); 
  }
};

  const dashboardRouteByRole = {
    admin: "/admin-dashboard",
    salesperson: "/salesperson-dashboard",
    client: "/client-dashboard",
    designer: "/designer-dashboard",
    carpenter: "/carpenter-dashboard",
  };

  const navigationItems = [
    {
      name: "Dashboard",
      href: dashboardRouteByRole[userRole] || "/dashboard",
      icon: LayoutDashboard,
      alwaysVisible: true,
    },

    { name: "Quotation", href: "/quotation", icon: ClipboardList },
    // { name: "Design", href: "/design", icon: NotebookPen },
    // { name: "Daily Updates", href: "/daily-updates", icon: ClipboardList },
    { name: "Project", href: "/projects", icon: LayoutDashboard },
    // { name: "Manage Users", href: "/users", icon: User2 },
    { name: "Manage Brochures", href: "/brochures", icon: FileText },
    // { name: "Payments", href: "/payments", icon: ReceiptIndianRupee },
    // { name: "Generate Invoice", href: "/generate-invoice", icon: FileText },
    { name: "Profile", href: "/profile", icon: NotebookPen },

  ];

  const adminNavigationItems = [
    { name: "Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
    { name: "Quotation", href: "/admin/quotation", icon: FileText },
    { name: "Brochure", href: "/admin/brochure", icon: ReceiptIndianRupee },
    {
      name: "registerstaff",
      href: "/admin/registerstaff",
      icon: MessageSquareText,
    },
    {
      name: "registerclient",
      href: "/admin/registerclient",
      icon: MessageSquareText,
    },
    { name: "Staff-Users", href: "/admin/staffusers", icon: FileQuestion },
    { name: "Clients", href: "/admin/clients", icon: NotebookPen },
    { name: "Projects", href: "/admin/projects", icon: ClipboardList },
    { name: "Payment History", href: "/admin/paymenthistory", icon: User2 },
    { name: "Services", href: "/admin/services", icon: User2 },
    {
      name: "Daily Updates",
      href: "/admin/daily-updates",
      icon: MessageSquareText,
    },
    { name: "Profile", href: "/profile", icon: NotebookPen },
  ];

  const clientNavigationItems = [
    { name: "Dashboard", href: "/client-dashboard", icon: ClipboardList },
    { name: "My Projects", href: "/client/projects", icon: ClipboardList },
    { name: "Payments", href: "/client/payments", icon: ReceiptIndianRupee },
    // { name: "Quotations", href: "/client/quotation", icon: FileText },
    // {
    //   name: "Daily Updates",
    //   href: "/client/daily-updates",
    //   icon: MessageSquareText,
    // },
    { name: "Profile", href: "/client/profile", icon: NotebookPen },
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 flex flex-col h-full transition-all duration-300 ease-in-out bg-white shadow-lg
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${collapsed ? "w-16 md:w-20" : "w-64 md:w-72"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          {!collapsed ? (
            <div className="flex items-center space-x-3">AddWith Interior</div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md">
                <LayoutDashboard size={20} className="text-white" />
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center p-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
              {collapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>

            <button
              className="flex md:hidden items-center justify-center p-1 text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-grow px-3 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          <div className="space-y-1.5">
            {(userRole === "admin"
              ? adminNavigationItems
              : userRole === "client"
              ? clientNavigationItems
              : navigationItems.filter(
                  (item) => item.alwaysVisible || checkPermission(item.href)
                )
            ).map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              // if (!checkPermission(item.href)) return null;

              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full text-left flex items-center ${
                    collapsed ? "justify-center" : ""
                  } px-3 py-2.5 rounded-xl group transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md"
                        : "bg-slate-200 text-slate-600 group-hover:bg-slate-300"
                    } transition-all duration-200`}
                  >
                    <Icon size={18} />
                  </div>
                  {!collapsed && (
                    <div className="ml-3 flex-grow">
                      <span
                        className={`font-medium text-sm ${
                          isActive ? "text-indigo-800" : "text-slate-700"
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                  )}
                  {!collapsed && isActive && (
                    <ChevronRight size={16} className="text-indigo-500" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-slate-100 mt-auto sticky bottom-0 bg-white z-10">
          <div
            className={`flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            } text-slate-600`}
          >
            {!collapsed && (
              <div
                className="flex flex-col text-left cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => {
                  if (userRole === "client") {
                    router.push("/client/profile");
                  } else {
                    router.push("/profile");
                  }
                }}
              >
                <span className="text-sm font-medium capitalize">
                  {userRole || ""}
                </span>
                <span className="text-xs text-slate-500 truncate max-w-[160px]">
                  {userName}
                </span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-red-100 text-red-600 transition-colors duration-200"
              title="Logout"
            >
              {loading ? (
                "logging out..."
              ) : (
                <LogOut size={collapsed ? 20 : 18} />
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

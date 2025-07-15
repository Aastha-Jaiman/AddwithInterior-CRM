'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  FileQuestion,
  NotebookPen,
  MessageSquareText,
  Wrench,
  LogOut
} from 'lucide-react';
import Navbar from '../navbar/Navbar';

const navigationItemsByRole = {
  admin: [
    { name: 'Dashboard', href: '/admin/', icon: LayoutDashboard },
    { name: 'Quotation', href: '/admin/quotation', icon: FileText },
    { name: 'Brochure', href: '/admin/brochure', icon: ReceiptIndianRupee },
    { name: 'Staff-Users', href: '/admin/staffusers', icon: FileQuestion },
    { name: 'Clients', href: '/admin/clients', icon: NotebookPen },
    { name: 'Projects', href: '/admin/projects', icon: ClipboardList },
    { name: 'Payment History', href: '/admin/paymenthistory', icon: User2 },
    { name: 'Reports', href: '/admin/reports', icon: Users },
    { name: 'Daily Updates', href: '/admin/daily-updates', icon: MessageSquareText },
    { name: 'Register Staff', href: '/admin/registerstaff', icon: User2 },
    { name: 'Services', href: '/admin/services', icon: MessageSquareQuote },
  ],
  salesperson: [
    { name: 'Dashboard', href: '/salesperson', icon: LayoutDashboard },
    { name: 'Quotation', href: '/salesperson/quotation', icon: FileText },
    { name: 'Brochure', href: '/salesperson/brochure', icon: ReceiptIndianRupee },
    { name: 'Projects', href: '/salesperson/projects', icon: ClipboardList },
    { name: 'Clients', href: '/salesperson/clients', icon: NotebookPen },
    { name: 'Payment History', href: '/salesperson/paymenthistory', icon: User2 },
    { name: 'Daily Updates', href: '/salesperson/daily-updates', icon: MessageSquareText },
    { name: 'Services', href: '/salesperson/services', icon: MessageSquareQuote },
  ],
  client: [
    { name: 'Dashboard', href: '/client', icon: LayoutDashboard },
    { name: 'Quotation', href: '/client/quotation', icon: FileText },
    { name: 'Brochure', href: '/client/brochure', icon: ReceiptIndianRupee },
    { name: 'Projects', href: '/client/projects', icon: ClipboardList },
    { name: 'Payment History', href: '/client/payment-history', icon: User2 },
    { name: 'Daily Updates', href: '/client/daily-updates', icon: MessageSquareText },
    { name: 'Services', href: '/client/services', icon: MessageSquareQuote },
  ],
  designer: [
    { name: 'Dashboard', href: '/designer', icon: LayoutDashboard },
    { name: 'Brochure', href: '/designer/brochure', icon: ReceiptIndianRupee },
    { name: 'Projects & Design', href: '/designer/projects&design', icon: ReceiptIndianRupee },
    // { name: 'Projects', href: '/designer/Projects', icon: ClipboardList },
    // { name: 'Daily Updates', href: '/designer/daily-updates', icon: MessageSquareText },
  ],
  carpenter: [
    { name: 'Daily Updates', href: '/carpenter/daily-updates', icon: MessageSquareText },
    { name: 'Services', href: '/carpenter/services', icon: MessageSquareQuote },
  ],
};

export default function SidebarLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserRole(parsed.role);
      setUserName(parsed.name || parsed.email || 'User');
    }
  }, []);

  const navigationItems = navigationItemsByRole[userRole] || [];

  const handleNavigation = (href) => {
    router.push(href);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('crm_user');
    router.push('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 flex flex-col h-full
        ${collapsed ? 'w-20' : 'w-72'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        transition-all duration-300 ease-in-out bg-white shadow-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              {/* <img
                src="https://dilbahars.com/wp-content/uploads/2024/09/Dilbahars-e1726221534608.png"
                className="w-24"
                alt="logo"
              /> */}
              AddWith Interior
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md">
                <LayoutDashboard size={20} className="text-white" />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center p-1 rounded-md text-slate-500 hover:bg-slate-100"
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>

            <button
              className="flex md:hidden items-center justify-center p-1 text-slate-500 hover:text-slate-700"
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-grow px-3 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
          <div className="space-y-1.5">
            {navigationItems.map(({ name, href, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <button
                  key={name}
                  onClick={() => handleNavigation(href)}
                  className={`w-full text-left flex items-center ${collapsed ? 'justify-center' : ''
                    } px-3 py-2.5 rounded-xl group transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-blue-50 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <div
                    className={`flex items-center justify-center min-w-10 h-10 rounded-lg ${isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-md'
                      : 'bg-slate-200 text-slate-600 group-hover:bg-slate-300'
                      } transition-all duration-200`}
                  >
                    <Icon size={18} />
                  </div>
                  {!collapsed && (
                    <div className="ml-3 flex-grow">
                      <span
                        className={`font-medium text-sm ${isActive ? 'text-indigo-800' : 'text-slate-700'
                          }`}
                      >
                        {name}
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

        {/* User Info & Logout */}
        <div className="px-3 py-4 border-t border-slate-100 mt-auto">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} text-slate-600`}>
            {!collapsed && (
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium capitalize">{userRole || ''}</span>
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
              <LogOut size={collapsed ? 20 : 18} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        {/* Navbar removed as per previous context */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
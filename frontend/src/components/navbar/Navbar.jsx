'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Settings, Bell } from 'lucide-react';

export default function Navbar({ onMenuClick, hasSidebar = true }) {
  const [role, setRole] = useState('');
  const [userName, setUserName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('crm_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setRole(parsed.role);
      setUserName(parsed.name || parsed.email || 'User');
    }

    // Check sidebar state only if sidebar exists
    if (hasSidebar) {
      const checkSidebarState = () => {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
          setSidebarCollapsed(sidebar.classList.contains('w-20'));
        }
      };

      checkSidebarState();
      const interval = setInterval(checkSidebarState, 100);
      return () => clearInterval(interval);
    }
  }, [hasSidebar]);

  const handleLogout = () => {
    localStorage.removeItem('crm_user');
    router.push('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className={`fixed top-0 right-0 h-16 flex items-center justify-between px-6 bg-white shadow-lg border-b border-slate-700 z-40 transition-all duration-300 ease-in-out
      ${hasSidebar 
        ? (sidebarCollapsed ? 'left-20' : 'left-0 md:left-72')
        : 'left-0'
      }`}>
      
      {/* Mobile Menu Button - Only show if sidebar exists */}
      {hasSidebar && (
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors duration-200 hover:bg-slate-700 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Logo/Brand Section - Show on mobile when no sidebar, hidden on desktop when sidebar exists */}
      <div className={`flex items-center space-x-3 ${hasSidebar ? 'hidden md:flex' : ''}`}>
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          CRM Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 text-slate-400 hover:text-white transition-colors duration-200 hover:bg-slate-700 rounded-lg">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">3</span>
          </span>
        </button>

        {/* Settings */}
        <button className="p-2 text-slate-400 hover:text-white transition-colors duration-200 hover:bg-slate-700 rounded-lg">
          <Settings size={20} />
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors duration-200 border border-slate-600"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">{userName}</p>
              <p className="text-xs text-slate-400 capitalize">{role || 'Guest'}</p>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-3 border-b border-slate-200">
                <p className="text-sm font-medium text-slate-900">{userName}</p>
                <p className="text-xs text-slate-500 capitalize">{role || 'Guest'}</p>
              </div>
              
              <div className="py-1">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                  <User size={16} />
                  <span>Profile Settings</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2">
                  <Settings size={16} />
                  <span>Account Settings</span>
                </button>
              </div>
              
              <div className="border-t border-slate-200 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}
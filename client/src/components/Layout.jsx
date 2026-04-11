import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './sidebar';
import { Search, Bell, ChevronDown, HelpCircle } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const getPageTitle = () => {
    if (location.pathname === '/app') return 'Dashboard';
    if (location.pathname === '/app/board') return 'Kanban Board';
    if (location.pathname === '/app/projects') return 'Projects';
    if (location.pathname === '/app/team') return 'Team';
    return 'Workspace';
  };
  return (
    <div className="flex h-screen overflow-hidden dotted-bg font-sans">

      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 ml-64 flex flex-col relative h-full">

        {/* --- NAVBAR START --- */}
        {/* We use 'shrink-0' to keep navbar height fixed */}
        <header className="shrink-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3 flex items-center justify-between transition-all">

          {/* Left: Breadcrumb / Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-800 tracking-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>Area 51</h1>
            <span className="text-gray-300 text-xl font-light">/</span>
            <span className="text-sm font-normal text-gray-500">{getPageTitle()}</span>
          </div>

          {/* Right: Actions Area */}
          <div className="flex items-center gap-4">

            {/* Search Bar (Pill Shape) */}
            <div className="relative hidden md:block group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-gray-100 hover:bg-white focus:bg-white pl-9 pr-4 py-2 rounded-full text-sm border border-transparent focus:border-orange-200 focus:ring-4 focus:ring-orange-500/10 transition-all w-64 outline-none placeholder:text-gray-400"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] text-gray-400 bg-white border border-gray-200 px-1.5 py-0.5 rounded shadow-sm">⌘K</span>
              </div>
            </div>

            {/* Divider Line */}
            <div className="h-6 w-px bg-gray-200 mx-2"></div>

            {/* Icons Group */}
            <div className="flex items-center gap-3">
              <button className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <HelpCircle size={20} />
              </button>

              <button className="relative text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors">
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
              </button>
            </div>

            {/* Profile Dropdown Trigger */}
            <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all group">
              <div className="w-8 h-8 bg-gradient-to-tr from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                JD
              </div>
              <div className="hidden lg:block text-left mr-1">
                <p className="text-xs font-semibold text-gray-700 group-hover:text-gray-900 leading-tight">Joe Mama</p>
                <p className="text-[10px] text-gray-500 leading-tight">Admin</p>
              </div>
              <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600" />
            </button>

          </div>
        </header>
        {/* --- NAVBAR END --- */}

        {/* Dynamic Page Content */}
        {/* Added overflow-y-auto to handle scrolling independently if needed */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default Layout;
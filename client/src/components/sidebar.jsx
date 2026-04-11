import React from 'react';
import { NavLink } from 'react-router-dom'; // <--- IMPORT THIS
import { LayoutDashboard, KanbanSquare, FolderOpen, Users, Plus, Target, Settings, Focus, BarChart3 } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-50 h-screen border-r border-gray-200 flex flex-col p-6 fixed left-0 top-0 overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>
        <span className="text-xl font-bold text-gray-800">PrompTool</span>
      </div>

      {/* New Task Button (Doesn't navigate, opens modal usually) */}
      <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 mb-8 shadow-md transition-all">
        <Plus size={20} /> New Task
      </button>

      {/* Navigation Groups */}
      <div className="flex-1 space-y-6">

        {/* Group 1: Workspace */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Workspace</p>
          <nav className="space-y-2">
            {/* We pass the 'to' prop which matches the route in App.jsx */}
            <NavItem to="/app" end icon={<LayoutDashboard size={20} />} label="Dashboard" />
            <NavItem to="/app/board" icon={<KanbanSquare size={20} />} label="Board" />
            <NavItem to="/app/projects" icon={<FolderOpen size={20} />} label="Projects" />
            <NavItem to="/app/team" icon={<Users size={20} />} label="Team" />
            <NavItem to="/app/tasks" icon={<Target size={20} />} label="Tasks" />
            <NavItem to="/app/focus" icon={<Focus size={20} />} label="Focus Mode" />
            <NavItem to="/app/graph" icon={<BarChart3 size={20} />} label="Graph" />
          </nav>
        </div>
      </div>

      {/* Group 3: Bottom Actions */}
      <div className="pt-6 border-t border-gray-200">
        <NavItem to="/app/settings" icon={<Settings size={20} />} label="Settings" />
      </div>

    </div>
  );
};

// --- REUSABLE NAV ITEM COMPONENT ---
const NavItem = ({ to, icon, label, end }) => (
  <NavLink
    to={to}
    end={end}
    // NavLink gives us `isActive` automatically. We destructure it here:
    className={({ isActive }) => `
      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors
      ${isActive
        ? 'bg-orange-100 text-orange-700'  // Style when ACTIVE
        : 'text-gray-600 hover:bg-gray-100' // Style when INACTIVE
      }
    `}
  >
    {icon}
    {label}
  </NavLink>
);

export default Sidebar;
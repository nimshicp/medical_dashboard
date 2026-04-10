import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Image as ImageIcon, Settings, LogOut, HeartPulse } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { path: '/', name: 'Dashboard', icon: LayoutDashboard },
    { path: '/patients', name: 'Patients', icon: Users },
    { path: '/media', name: 'Media Files', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 glass-panel m-4 flex flex-col z-20 h-[calc(100vh-2rem)] border-r border-slate-200/50">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-white/20">
        <div className="flex items-center space-x-3 text-brand-600">
          <HeartPulse className="w-8 h-8 drop-shadow-md" />
          <span className="text-xl font-bold tracking-tight text-slate-800">MedDash</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Main Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-50 to-brand-100/50 text-brand-600 font-semibold shadow-sm border border-brand-200/50'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-brand-500 font-medium hover:pl-6'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-white/20">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-slate-500 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all duration-300 w-full hover:pl-6 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

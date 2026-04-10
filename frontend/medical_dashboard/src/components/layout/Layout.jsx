import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Settings, LogOut, Search, Bell, User } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        navigate(`/patients?search=${encodeURIComponent(val)}`);
      }
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-slate-50 relative selection:bg-brand-500 selection:text-white">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand-100 blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-sky-100 blur-[120px] opacity-60 pointer-events-none"></div>

      
      <Sidebar />

      
      <div className="flex-1 flex flex-col pt-4 pr-4 pb-4 overflow-hidden relative z-10 w-full">
        {/* Top Navbar */}
        <header className="glass-card mb-6 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center flex-1">
            <div className="relative w-full max-w-md hidden md:block">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                onKeyDown={handleGlobalSearch}
                placeholder="Search patient names (Press Enter)..."
                className="w-full bg-white/50 border border-slate-200/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-slate-700 placeholder-slate-400 shadow-inner"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer group">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-wide">
                  {user?.username || 'Doctor'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white flex items-center justify-center font-bold shadow-md transform group-hover:scale-105 transition-all">
                {user?.username?.[0]?.toUpperCase() || 'D'}
              </div>
            </div>
          </div>
        </header>

        
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar pr-2 pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

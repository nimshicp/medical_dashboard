import React, { useState, useEffect } from 'react';
import { Activity, Users, FileText } from 'lucide-react';
import api from '../services/api';

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="glass-card p-6 relative overflow-hidden group">
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
    <div className="relative z-10 flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      </div>
      <div className="p-3 bg-white rounded-xl shadow-sm text-blue-500">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [patientCount, setPatientCount] = useState(0);
  const [mediaCount, setMediaCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsRes, mediaRes] = await Promise.all([
          api.get('/patients/'),
          api.get('/media/')
        ]);
        setPatientCount(patientsRes.data.length || 0);
        setMediaCount(mediaRes.data.length || 0);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="px-6 py-2 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h1>
        <p className="text-slate-500 mt-1 font-medium">Real-time statistics sourced direct from database</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
           <p className="text-slate-500 font-medium">Loading statistics...</p>
        ) : (
           <>
             <StatCard title="Total Registered Patients" value={patientCount} icon={Users} />
             <StatCard title="Total Uploaded Media Files" value={mediaCount} icon={FileText} />
             <StatCard title="System Status" value={"Online"} icon={Activity} />
           </>
        )}
      </div>

     
    </div>
  );
};

export default Dashboard;

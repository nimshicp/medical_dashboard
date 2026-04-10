import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Plus, MoreVertical, Filter, X, Edit, Trash2 } from 'lucide-react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Patients = () => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize query from URL search bar navigation
  const [searchQuery, setSearchQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('search') || '';
  });
  
  const [tagQuery, setTagQuery] = useState('');
  const [dateQuery, setDateQuery] = useState('');
  
  // Create Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', tags_input: '', doctor_id: '' });

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState({ id: null, name: '', tags_input: '', doctor_id: '' });

  // Admin dropdown support
  const [doctorsList, setDoctorsList] = useState([]);
  useEffect(() => {
    if (user?.role === 'admin') {
      api.get('/auth/doctors/')
        .then(res => setDoctorsList(res.data))
        .catch(err => console.error("Failed to fetch doctors:", err));
    }
  }, [user]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      let endpoint = '/patients/?';
      if (searchQuery) endpoint += `name=${encodeURIComponent(searchQuery)}&`;
      if (tagQuery) endpoint += `tag=${encodeURIComponent(tagQuery)}&`;
      if (dateQuery) endpoint += `date=${encodeURIComponent(dateQuery)}&`;
      const response = await api.get(endpoint);
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPatients();
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, tagQuery, dateQuery]);

  // Sync state if user types in global nav search bar repeatedly while on this page
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = newPatient.tags_input.split(',').map(tag => tag.trim()).filter(t => t);
      const payload = {
        name: newPatient.name,
        tags_input: tagsArray
      };
      if (user?.role === 'admin' && newPatient.doctor_id) {
          payload.doctor_id = parseInt(newPatient.doctor_id, 10);
      }
      
      await api.post('/patients/', payload);
      setIsCreateModalOpen(false);
      setNewPatient({ name: '', tags_input: '', doctor_id: '' });
      fetchPatients();
    } catch (error) {
      console.error("Failed to create patient:", error);
      alert("Error adding patient. Please try again.");
    }
  };

  const handleEditClick = (patient) => {
    const tagsStr = patient.tags ? patient.tags.map(t => t.name).join(', ') : '';
    setEditingPatient({
      id: patient.id,
      name: patient.name,
      tags_input: tagsStr,
      doctor_id: patient.doctor_id || '',
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = editingPatient.tags_input.split(',').map(tag => tag.trim()).filter(t => t);
      const payload = {
        name: editingPatient.name,
        tags_input: tagsArray
      };
      if (user?.role === 'admin' && editingPatient.doctor_id) {
          payload.doctor_id = parseInt(editingPatient.doctor_id, 10);
      }
      
      await api.patch(`/patients/${editingPatient.id}/`, payload);
      setIsEditModalOpen(false);
      setEditingPatient({ id: null, name: '', tags_input: '', doctor_id: '' });
      fetchPatients();
    } catch (error) {
      console.error("Failed to update patient:", error);
      alert("Error updating patient.");
    }
  };

  const handleDeleteClick = async (id, name) => {
    const confirmed = window.confirm(`Are you sure you want to delete patient "${name}"? This action cannot be undone.`);
    if (confirmed) {
      try {
        await api.delete(`/patients/${id}/`);
        fetchPatients();
      } catch (error) {
        console.error("Failed to delete patient:", error);
        alert("Error deleting patient.");
      }
    }
  };


  return (
    <div className="px-6 py-2 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient Directory</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and view all registered patients.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Patient</span>
        </button>
      </div>

      <div className="glass-panel overflow-hidden shadow-brand-500/5">
        <div className="p-4 border-b border-slate-200/50 flex flex-wrap gap-4 items-center bg-white/30">
          <div className="relative w-64 flex-shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="relative w-56 flex-shrink-0">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by exact tag..." 
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
          </div>
          <div className="relative w-48 flex-shrink-0">
             <input 
               type="date"
               value={dateQuery}
               onChange={(e) => setDateQuery(e.target.value)}
               className="w-full px-4 py-2 pr-8 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-600"
               title="Filter by Creation Date"
             />
             {dateQuery && (
               <button onClick={() => setDateQuery('')} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-rose-500">
                 <X className="w-4 h-4" />
               </button>
             )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/50 bg-slate-50/50 text-slate-500 text-sm">
                <th className="px-6 py-4 font-semibold">Patient Name</th>
                <th className="px-6 py-4 font-semibold">Assigned Doctor</th>
                <th className="px-6 py-4 font-semibold">Tags</th>
                <th className="px-6 py-4 font-semibold">Created At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">Loading records from backend...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400 font-medium">No patients found. Add one above!</td>
                </tr>
              ) : patients.map((patient) => (
                <tr key={patient.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-sky-400 flex items-center justify-center text-white font-bold shadow-sm">
                        {patient.name?.[0] || '?'}
                      </div>
                      <span className="font-semibold text-slate-800">{patient.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {patient.doctor || 'Unassigned'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {patient.tags && patient.tags.length > 0 ? patient.tags.map(tag => (
                        <span key={tag.id} className="px-2 py-1 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-widest shadow-sm border border-blue-200 flex-shrink-0">
                          {tag.name}
                        </span>
                      )) : <span className="text-xs text-slate-400 italic">No tags</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium whitespace-nowrap">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                       <button onClick={() => handleEditClick(patient)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none shadow-sm shadow-transparent hover:shadow-blue-500/10" title="Edit Patient">
                         <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDeleteClick(patient.id, patient.name)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none shadow-sm shadow-transparent hover:shadow-rose-500/10" title="Delete Patient">
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Patient Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Register New Patient</h2>
            
            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Patient Full Name</label>
                <input 
                  type="text" 
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                  className="glass-input"
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Medical Tags <span className="text-slate-400 font-normal">(optional, comma-separated)</span></label>
                <input 
                  type="text" 
                  value={newPatient.tags_input}
                  onChange={(e) => setNewPatient({...newPatient, tags_input: e.target.value})}
                  className="glass-input"
                  placeholder="e.g. Cardiology, Urgent"
                />
              </div>

              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Assign Doctor</label>
                  <select 
                    value={newPatient.doctor_id} 
                    onChange={(e) => setNewPatient({...newPatient, doctor_id: e.target.value})} 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Unassigned</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2">
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Patient Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Edit Patient Details</h2>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Patient Full Name</label>
                <input 
                  type="text" 
                  value={editingPatient.name}
                  onChange={(e) => setEditingPatient({...editingPatient, name: e.target.value})}
                  className="glass-input"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Medical Tags <span className="text-slate-400 font-normal">(comma-separated)</span></label>
                <input 
                  type="text" 
                  value={editingPatient.tags_input}
                  onChange={(e) => setEditingPatient({...editingPatient, tags_input: e.target.value})}
                  className="glass-input"
                />
              </div>

              {user?.role === 'admin' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Assign Doctor</label>
                  <select 
                    value={editingPatient.doctor_id} 
                    onChange={(e) => setEditingPatient({...editingPatient, doctor_id: e.target.value})} 
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
                  >
                    <option value="">Unassigned</option>
                    {doctorsList.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.username}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

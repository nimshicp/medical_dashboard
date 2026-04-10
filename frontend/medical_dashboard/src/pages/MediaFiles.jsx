import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, File, Image as ImageIcon, FileText, Download, Trash2, X } from 'lucide-react';
import api from '../services/api';

const MediaFiles = () => {
  const [files, setFiles] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Upload Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  const fileInputRef = useRef(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await api.get('/media/');
      setFiles(response.data);
    } catch (error) {
      console.error("Failed to fetch media:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients/');
      setPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients for dropdown:", error);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchPatients();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId || !selectedFile) {
      alert("Please select both a patient and a file.");
      return;
    }

    const formData = new FormData();
    formData.append('patient', selectedPatientId);
    formData.append('file', selectedFile);
    formData.append('file_type', selectedFile.type || 'unknown');
    
    // File upload logic through Axios
    try {
      setUploading(true);
      await api.post('/media/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setSelectedFile(null);
      setSelectedPatientId('');
      fetchMedia();
    } catch (error) {
      console.error("Upload failed", error);
      alert("File upload failed. Ensure size < 2MB.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    // Make sure we have patients fetched!
    if (patients.length === 0) fetchPatients();
    setIsModalOpen(true);
  };

  const handleDeleteMedia = async (id) => {
    if (window.confirm("Are you sure you want to delete this file?")) {
      try {
        await api.delete(`/media/${id}/`);
        fetchMedia();
      } catch (error) {
        console.error("Failed to delete media", error);
        alert("Failed to delete media file.");
      }
    }
  };

  return (
    <div className="px-6 py-2 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Media & Documents</h1>
          <p className="text-slate-500 mt-1 font-medium">Securely store and manage patient files.</p>
        </div>
        <button onClick={triggerFileInput} className="btn-primary flex items-center space-x-2">
          <UploadCloud className="w-5 h-5" />
          <span>Upload File</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-slate-500">Loading files from database...</p>
        ) : files.length === 0 ? (
           <p className="text-slate-500 col-span-3 text-center py-12">No media files found in the database.</p>
        ) : files.map(file => (
          <div key={file.id} className="glass-card p-5 group flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-4 rounded-xl ${file.file_type && file.file_type.includes('image') ? 'bg-sky-100 text-sky-600' : 'bg-rose-100 text-rose-600'}`}>
                {file.file_type && file.file_type.includes('image') ? <ImageIcon className="w-8 h-8" /> : <FileText className="w-8 h-8" />}
              </div>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {file.file && (
                   <a href={file.file} download target="_blank" rel="noreferrer" className="p-2 bg-slate-100 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer block">
                     <Download className="w-4 h-4" />
                   </a>
                )}
                <button onClick={() => handleDeleteMedia(file.id)} className="p-2 bg-slate-100 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="mt-auto">
              <h4 className="font-semibold text-slate-800 truncate" title={file.file_type || 'Unknown'}>
                {file.patient_name ? `${file.patient_name} - ` : ''}{file.file_type || 'Document'}
              </h4>
              <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
                <span className="uppercase text-blue-600 font-bold tracking-wide">{file.status}</span>
                <span>{new Date(file.uploaded_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Upload Medical File</h2>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select Patient</label>
                <select 
                  className="glass-input"
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  required
                >
                  <option value="" disabled>-- Select a Patient --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 mt-4">
                <label className="text-sm font-semibold text-slate-700">Attach File</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-500 transition-colors bg-white/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    required
                  />
                  <div className="flex flex-col items-center text-slate-500">
                    <UploadCloud className="w-8 h-8 mb-2 text-blue-500" />
                    <span className="text-sm font-medium">
                      {selectedFile ? selectedFile.name : "Click to select file (Max 2MB)"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={uploading} className="btn-primary py-2 disabled:opacity-50">
                  {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaFiles;

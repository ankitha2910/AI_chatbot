import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Shield, BookOpen, GraduationCap, Building2, 
  Award, Key, Edit3, Save, X, Sparkles, Database, CheckCircle2, Layers
} from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose, currentUser, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        studentId: currentUser.studentId || '2024-CS-108',
        department: currentUser.department || (currentUser.role === 'Administrator' ? 'Academic Affairs & Dean Office' : 'Computer Science & Engineering'),
        semester: currentUser.semester || 'Semester 4 (Year 2)',
        adminId: currentUser.adminId || 'ADM-4019',
        designation: currentUser.designation || 'Chief Academic Registrar',
        adminKey: currentUser.adminKey || 'ADM-2026-SECKEY'
      });
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const isStudent = currentUser.role === 'Student';

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...currentUser,
      ...formData
    };
    onUpdateProfile(updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#080d1a]/95 p-6 sm:p-8 shadow-2xl shadow-teal-500/20 overflow-hidden">
        
        {/* Glow Effects */}
        <div className={`absolute top-0 right-0 h-48 w-48 rounded-full blur-3xl pointer-events-none ${
          isStudent ? 'bg-teal-500/15' : 'bg-indigo-500/15'
        }`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-5">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-white font-black text-xl shadow-xl ${
            isStudent 
              ? 'bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/30' 
              : 'bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-indigo-500/30'
          }`}>
            {isStudent ? <GraduationCap className="h-8 w-8" /> : <Shield className="h-8 w-8" />}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {currentUser.name}
              </h2>
              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${
                isStudent
                  ? 'bg-teal-500/10 border-teal-500/30 text-teal-300'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}>
                {currentUser.role} Account
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          
          {/* Header Action Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {isStudent ? '🎓 Student Academic Credentials' : '🛡️ Administrative & Authorization Details'}
            </span>
            
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Cancel Editing' : 'Edit Profile Fields'}</span>
            </button>
          </div>

          {/* Role Specific Grid Fields */}
          {isStudent ? (
            /* Student Account Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Student Roll / ID Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white disabled:opacity-75 focus:border-teal-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Academic Department / Major</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  {isEditing ? (
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Business Administration & Management">Business Administration</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={formData.department}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white opacity-75"
                    />
                  )}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Semester / Academic Year</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Award className="h-4 w-4" />
                  </div>
                  {isEditing ? (
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white focus:border-teal-500 outline-none cursor-pointer"
                    >
                      <option value="Semester 1 (Year 1)">Semester 1 (Year 1)</option>
                      <option value="Semester 2 (Year 1)">Semester 2 (Year 1)</option>
                      <option value="Semester 3 (Year 2)">Semester 3 (Year 2)</option>
                      <option value="Semester 4 (Year 2)">Semester 4 (Year 2)</option>
                      <option value="Semester 5 (Year 3)">Semester 5 (Year 3)</option>
                      <option value="Semester 6 (Year 3)">Semester 6 (Year 3)</option>
                      <option value="Semester 7 (Year 4)">Semester 7 (Year 4)</option>
                      <option value="Semester 8 (Year 4)">Semester 8 (Year 4)</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={formData.semester}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white opacity-75"
                    />
                  )}
                </div>
              </div>

            </div>
          ) : (
            /* Administrator Account Fields */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Admin Employee ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.adminId}
                    onChange={(e) => setFormData({ ...formData, adminId: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white disabled:opacity-75 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Administrative Unit</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  {isEditing ? (
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white focus:border-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="Academic Affairs & Dean Office">Academic Affairs & Dean Office</option>
                      <option value="Examination Cell & Evaluation">Examination Cell & Evaluation</option>
                      <option value="Department Head / Faculty">Department Head / Faculty</option>
                      <option value="IT Infrastructure & Security">IT Infrastructure & Security</option>
                      <option value="Registrar & Student Admissions">Registrar & Student Admissions</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      disabled
                      value={formData.department}
                      className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white opacity-75"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Designation / Official Title</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white disabled:opacity-75 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Security Clearance Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Key className="h-4 w-4 text-indigo-400" />
                  </div>
                  <input
                    type="password"
                    disabled={!isEditing}
                    value={formData.adminKey}
                    onChange={(e) => setFormData({ ...formData, adminKey: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-[#0c1222] pl-9 pr-3 py-2.5 text-white disabled:opacity-75 focus:border-indigo-500 outline-none font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          {/* Role Metrics Box inside Profile */}
          <div className="p-4 rounded-2xl border border-white/10 bg-[#050811]/80 space-y-2 mt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              {isStudent ? '🎓 Student Learning Activity' : '⚡ System Administration Status'}
            </span>

            {isStudent ? (
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-teal-400 font-heading">24</span>
                  <span className="text-[9px] text-slate-400 uppercase">Doubts Solved</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-indigo-400 font-heading">12</span>
                  <span className="text-[9px] text-slate-400 uppercase">Chat History</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-emerald-400 font-heading">100%</span>
                  <span className="text-[9px] text-slate-400 uppercase">Grounded RAG</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-indigo-400 font-heading">Full</span>
                  <span className="text-[9px] text-slate-400 uppercase">Admin Clearance</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-violet-400 font-heading">Active</span>
                  <span className="text-[9px] text-slate-400 uppercase">Vector Engine</span>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/5">
                  <span className="block text-sm font-bold text-teal-400 font-heading">384-D</span>
                  <span className="text-[9px] text-slate-400 uppercase">Embedding Dim</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing ? (
            <button
              type="submit"
              className="gradient-btn w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile Changes</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              Close Profile Window
            </button>
          )}

        </form>

      </div>
    </div>
  );
}

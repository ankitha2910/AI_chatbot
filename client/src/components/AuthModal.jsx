import React, { useState } from 'react';
import { 
  Sparkles, User, Mail, Lock, Shield, ArrowRight, X, 
  GraduationCap, BookOpen, Building2, Award, Key 
} from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'signup', 
  customMessage = '', 
  onAuthSuccess 
}) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup' | 'forgot'
  const [role, setRole] = useState('Student'); // 'Student' | 'Administrator'
  const [resetSent, setResetSent] = useState(false);
  
  // Basic fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Student specific fields
  const [studentId, setStudentId] = useState('');
  const [studentDept, setStudentDept] = useState('Computer Science & Engineering');
  const [semester, setSemester] = useState('Semester 4 (Year 2)');

  // Administrator specific fields
  const [adminId, setAdminId] = useState('');
  const [adminDept, setAdminDept] = useState('Academic Affairs & Dean Office');
  const [designation, setDesignation] = useState('Chief Academic Registrar');
  const [adminKey, setAdminKey] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'forgot') {
      if (!email) {
        setError('Please enter your email address to reset password.');
        return;
      }
      setResetSent(true);
      return;
    }

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (mode === 'signup' && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Role-specific validation during signup
    if (mode === 'signup') {
      if (role === 'Student' && !studentId.trim()) {
        setError('Please enter your Student Roll / ID Number.');
        return;
      }
      if (role === 'Administrator') {
        if (!adminId.trim()) {
          setError('Please enter your Admin Employee ID.');
          return;
        }
        if (!adminKey.trim()) {
          setError('Please enter your Admin Security Clearance Key.');
          return;
        }
      }
    }

    // Build role-tailored user object
    const userObj = {
      name: mode === 'signup' ? fullName : (email.split('@')[0] || 'User'),
      email: email,
      role: role,
      token: `token-${Date.now()}`,
      ...(role === 'Student' ? {
        studentId: studentId.trim() || '2024-CS-108',
        department: studentDept,
        semester: semester
      } : {
        adminId: adminId.trim() || 'ADM-4019',
        department: adminDept,
        designation: designation.trim() || 'System Administrator',
        adminKey: adminKey.trim() || 'ADM-2026-KEY'
      })
    };

    onAuthSuccess(userObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      
      <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#080d1a]/95 p-6 sm:p-8 shadow-2xl shadow-teal-500/20 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Glow backdrop */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-32 w-64 rounded-full blur-3xl pointer-events-none ${
          role === 'Student' ? 'bg-teal-500/20' : 'bg-indigo-500/20'
        }`}></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Custom Notice Message when triggered by auth guard */}
        {customMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 text-center font-medium flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 shrink-0 text-teal-400" />
            <span>{customMessage}</span>
          </div>
        )}

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-2 mb-6">
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-xl ${
            role === 'Student' 
              ? 'bg-gradient-to-tr from-teal-500 to-indigo-600 shadow-teal-500/30'
              : 'bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-indigo-500/30'
          }`}>
            {role === 'Student' ? <GraduationCap className="h-7 w-7" /> : <Shield className="h-7 w-7" />}
          </div>

          <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight">
            {mode === 'signup' ? `Create ${role} Account` : `Sign In as ${role}`}
          </h2>

          <p className="text-xs text-slate-400 max-w-xs">
            {mode === 'signup' 
              ? `Fill in your ${role.toLowerCase()} credentials to access personalized university RAG features`
              : 'Sign in to access your AcademiX workspace'}
          </p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="mb-6 grid grid-cols-2 gap-2 bg-[#0c1222] p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => setRole('Student')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'Student'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="h-4 w-4" />
            <span>Student Account</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('Administrator')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              role === 'Administrator'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="h-4 w-4" />
            <span>Administrator</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={role === 'Student' ? "Jane Doe" : "Dr. Robert Smith"}
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {role === 'Student' ? 'Student Email Address' : 'Institutional Admin Email'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'Student' ? "student@university.edu" : "admin@university.edu"}
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• (min 6 chars)"
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* DYNAMIC ROLE-SPECIFIC FIELDS DURING SIGNUP */}
          {mode === 'signup' && role === 'Student' && (
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="h-3.5 w-3.5" />
                <span>Student Academic Details</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Student Roll / ID Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 2024-CS-108"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Department / Major
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <select
                    value={studentDept}
                    onChange={(e) => setStudentDept(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                    <option value="Data Science & Artificial Intelligence">Data Science & AI</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics & Communication">Electronics & Communication</option>
                    <option value="Business Administration & Management">Business Administration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Semester / Year
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white focus:border-teal-500 focus:outline-none transition-all appearance-none cursor-pointer"
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
                </div>
              </div>
            </div>
          )}

          {mode === 'signup' && role === 'Administrator' && (
            <div className="space-y-4 pt-2 border-t border-white/10">
              <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                <span>Administrative Credentials</span>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Employee ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Shield className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="e.g. ADM-4019"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Administrative Department / Unit
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <select
                    value={adminDept}
                    onChange={(e) => setAdminDept(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="Academic Affairs & Dean Office">Academic Affairs & Dean Office</option>
                    <option value="Examination Cell & Evaluation">Examination Cell & Evaluation</option>
                    <option value="Department Head / Faculty">Department Head / Faculty</option>
                    <option value="IT Infrastructure & Security">IT Infrastructure & Security</option>
                    <option value="Registrar & Student Admissions">Registrar & Student Admissions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Designation / Official Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Chief Academic Registrar"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Clearance Security Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-indigo-400">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="e.g. ADM-2026-KEY"
                    className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-all font-mono"
                  />
                </div>
              </div>

            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
              role === 'Student'
                ? 'gradient-btn text-white shadow-teal-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:brightness-110 text-white shadow-indigo-500/20'
            }`}
          >
            <span>{mode === 'signup' ? `Create ${role} Account` : `Sign In as ${role}`}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4 space-y-2">
          {resetSent ? (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl">
              Password reset link sent to <strong>{email}</strong>! Check your inbox.
            </div>
          ) : mode === 'forgot' ? (
            <p>
              Remembered your password?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className="font-bold text-teal-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('signin'); setError(''); }}
                className="font-bold text-teal-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setError(''); }}
                  className="font-bold text-teal-400 hover:underline"
                >
                  Create Account
                </button>
              </p>

              <button
                type="button"
                onClick={() => { setMode('forgot'); setError(''); }}
                className="text-slate-400 hover:text-white hover:underline text-[11px]"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

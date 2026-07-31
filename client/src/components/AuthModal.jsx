import React, { useState } from 'react';
import { Sparkles, User, Mail, Lock, Shield, ArrowRight, X } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup', onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); // 'Student' | 'Administrator'
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

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

    // Mock successful authentication
    const userObj = {
      name: mode === 'signup' ? fullName : (email.split('@')[0] || 'User'),
      email: email,
      role: role,
      token: `token-${Date.now()}`
    };

    onAuthSuccess(userObj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in">
      
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#080d1a]/95 p-8 shadow-2xl shadow-teal-500/20 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon Header */}
        <div className="flex flex-col items-center text-center space-y-3 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-xl shadow-teal-500/30">
            <Sparkles className="h-7 w-7" />
          </div>

          <h2 className="text-2xl font-extrabold text-white font-heading tracking-tight">
            {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
          </h2>

          <p className="text-xs text-slate-400 max-w-xs">
            {mode === 'signup' 
              ? 'Join EduAssist to start exploring university academic resources'
              : 'Sign in to access your RAG assistant and study history'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        {/* Auth Form matching user's screenshot */}
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
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
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
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Account Role
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Shield className="h-4 w-4" />
              </div>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0f172a] pl-10 pr-4 py-3 text-white focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all appearance-none cursor-pointer"
              >
                <option value="Student" className="bg-[#080d1a] text-white">Student</option>
                <option value="Administrator" className="bg-[#080d1a] text-white">Administrator</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="gradient-btn w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 mt-2"
          >
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
          {mode === 'signup' ? (
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
          )}
        </div>

      </div>
    </div>
  );
}

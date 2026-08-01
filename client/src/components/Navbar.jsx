import React from 'react';
import { 
  Sparkles, LogIn, UserPlus, LogOut, GraduationCap, Shield 
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  currentUser, 
  onOpenAuth, 
  onLogout,
  onOpenProfile 
}) {
  const isStudent = currentUser?.role === 'Student';
  const isAdmin = currentUser?.role === 'Administrator';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050811]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-heading">
                AcademiX <span className="gradient-text">AI</span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-teal-500/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-400">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping"></span>
                RAG v2.4
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">Smart Campus Knowledge & RAG Engine</p>
          </div>
        </div>

        {/* Auth / Profile Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2">
              
              {/* Profile Pill Trigger */}
              <button
                onClick={onOpenProfile}
                className="flex items-center gap-2.5 bg-[#0c111e] hover:bg-white/10 border border-white/15 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer group"
                title="View & Edit Role Profile"
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg font-bold text-xs ${
                  isAdmin 
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                    : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                }`}>
                  {isAdmin ? <Shield className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                </div>

                <div className="text-left hidden md:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white leading-none group-hover:text-teal-300 transition-colors">
                      {currentUser.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold ${isAdmin ? 'text-indigo-400' : 'text-teal-400'}`}>
                      {currentUser.role}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">
                      • {isStudent ? (currentUser.studentId || '2024-CS-108') : (currentUser.adminId || 'ADM-4019')}
                    </span>
                  </div>
                </div>
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-400 rounded-xl hover:bg-white/10 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin', 'Please sign in or create an account as a Student or Administrator.')}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup', 'Please choose Student or Administrator role to create your account.')}
                className="gradient-btn flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white px-4 py-2.5 rounded-xl shadow-lg shadow-teal-500/10 hover:brightness-110 transition-all cursor-pointer font-heading"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

import React from 'react';
import { Sparkles, MessageSquare, Database, ShieldCheck, Home, LogIn, UserPlus, LogOut, User, HelpCircle } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView, stats, currentUser, onOpenAuth, onLogout }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050811]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
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
            <p className="text-[10px] text-slate-400 hidden sm:block">Smart Campus Knowledge & AI Assistant</p>
          </div>
        </div>

        {/* Navigation buttons */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentView('landing')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'landing' 
                ? 'bg-white/10 text-white border border-white/15' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <button
            onClick={() => setCurrentView('doubt-solver')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'doubt-solver' 
                ? 'bg-gradient-to-r from-amber-500/20 to-teal-500/20 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <HelpCircle className="h-4 w-4 text-amber-400" />
            <span>Doubt Resolver</span>
          </button>

          <button
            onClick={() => setCurrentView('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'chat' 
                ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/40 shadow-sm shadow-teal-500/10' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <MessageSquare className="h-4 w-4 text-teal-400" />
            <span>AI Assistant</span>
          </button>

          <button
            onClick={() => setCurrentView('admin')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              currentView === 'admin' 
                ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 text-indigo-300 border border-indigo-500/40' 
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="h-4 w-4 text-indigo-400" />
            <span>Knowledge Admin</span>
          </button>
        </nav>

        {/* Auth / Profile Controls */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 bg-[#0c111e] border border-white/10 px-3 py-1.5 rounded-xl text-xs">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 font-bold text-[10px]">
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="block font-bold text-white leading-none">{currentUser.name}</span>
                  <span className="text-[9px] text-teal-400 font-medium">{currentUser.role}</span>
                </div>
              </div>
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
                onClick={() => onOpenAuth('signin')}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('signup')}
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

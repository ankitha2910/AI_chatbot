import React from 'react';
import { LogOut, User } from 'lucide-react';

export default function Sidebar({ menuItems, activeTab, setActiveTab, currentUser, onLogout }) {
  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-[#050811] border-r border-white/10 h-[calc(100vh-4rem)] sticky top-16 flex flex-col hidden md:flex shrink-0">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 font-bold text-sm border border-teal-500/30">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="text-sm font-bold text-white truncate">{currentUser.name}</h3>
            <span className="text-[10px] text-teal-400 font-mono block truncate">{currentUser.role}</span>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

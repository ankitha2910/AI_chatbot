import React, { useState } from 'react';
import { 
  LayoutDashboard, MessageSquare, BookOpen, BrainCircuit, 
  TrendingUp, User, ChevronRight, FileText, Download, Eye, PlayCircle
} from 'lucide-react';
import Sidebar from './Sidebar';
import FullChatView from './FullChatView';

export default function StudentDashboardView({ currentUser, onOpenAuth, onOpenProfile, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'study-materials', label: 'Study Materials', icon: BookOpen },
    { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  // Placeholder study materials (merged notes and pdfs)
  const studyMaterials = [
    { id: 'm1', type: 'note', subject: 'Data Structures', title: 'Binary Search Trees & AVL', readTime: '8 min read' },
    { id: 'm2', type: 'pdf', subject: 'DBMS', title: 'SQL Query Reference', size: '2.1 MB' },
    { id: 'm3', type: 'note', subject: 'Operating Systems', title: 'CPU Scheduling Algorithms', readTime: '12 min read' },
    { id: 'm4', type: 'pdf', subject: 'Computer Networks', title: 'Protocol Cheatsheet', size: '1.9 MB' }
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-[#050811]">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back, <span className="text-teal-400">{currentUser?.name}</span>!</h1>
        <p className="text-sm text-slate-300">Here's a quick overview of your academic progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Study Materials Read</span>
          <div className="text-3xl font-extrabold text-white">24</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">Quizzes Completed</span>
          <div className="text-3xl font-extrabold text-white">12</div>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-2">
          <span className="text-xs text-slate-400 font-bold uppercase">AI Queries</span>
          <div className="text-3xl font-extrabold text-white">156</div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {studyMaterials.slice(0, 3).map((item) => (
            <div key={item.id} className="glass-card p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {item.type === 'note' ? <BookOpen className="h-5 w-5 text-teal-400" /> : <FileText className="h-5 w-5 text-indigo-400" />}
                <div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                  <span className="text-[10px] text-slate-400">{item.subject}</span>
                </div>
              </div>
              <button onClick={() => setActiveTab('study-materials')} className="text-xs font-bold text-teal-400 hover:underline">View</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStudyMaterials = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Study Materials</h2>
        <input
          type="text"
          placeholder="Search materials..."
          className="rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2 text-xs text-white focus:border-teal-500 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studyMaterials.map((item) => (
          <div key={item.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 hover:border-teal-500/40 transition-colors">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full">{item.subject}</span>
              <span className="text-[10px] text-slate-500">{item.type === 'note' ? item.readTime : item.size}</span>
            </div>
            <h4 className="text-sm font-bold text-white">{item.title}</h4>
            <div className="pt-3 border-t border-white/10 flex gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-bold transition-colors flex justify-center items-center gap-1">
                <Eye className="h-3.5 w-3.5" /> View
              </button>
              {item.type === 'pdf' && (
                <button className="flex-1 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold transition-colors flex justify-center items-center gap-1">
                  <Download className="h-3.5 w-3.5" /> Save
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6 text-center py-10">
      <BrainCircuit className="h-16 w-16 text-teal-400 mx-auto opacity-50" />
      <h2 className="text-2xl font-bold text-white">Active Quizzes</h2>
      <p className="text-sm text-slate-400 max-w-md mx-auto">Test your knowledge with AI-generated quizzes based on your study materials.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-6 text-left">
        <div className="glass-card p-5 rounded-xl border border-white/10 hover:border-teal-500/30 transition-colors">
          <h4 className="text-sm font-bold text-white mb-1">Data Structures - Trees & Graphs</h4>
          <p className="text-xs text-slate-400 mb-4">15 Questions • 20 Mins</p>
          <button className="flex items-center justify-center gap-2 w-full py-2 bg-teal-500/20 text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-500/30">
            <PlayCircle className="h-4 w-4" /> Start Quiz
          </button>
        </div>
        <div className="glass-card p-5 rounded-xl border border-white/10 hover:border-teal-500/30 transition-colors">
          <h4 className="text-sm font-bold text-white mb-1">DBMS - Normalization</h4>
          <p className="text-xs text-slate-400 mb-4">10 Questions • 15 Mins</p>
          <button className="flex items-center justify-center gap-2 w-full py-2 bg-teal-500/20 text-teal-300 rounded-lg text-xs font-bold hover:bg-teal-500/30">
            <PlayCircle className="h-4 w-4" /> Start Quiz
          </button>
        </div>
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="space-y-6 text-center py-10">
      <TrendingUp className="h-16 w-16 text-teal-400 mx-auto opacity-50" />
      <h2 className="text-2xl font-bold text-white">Academic Progress</h2>
      <p className="text-sm text-slate-400 max-w-md mx-auto">Track your learning journey and performance across different subjects.</p>
      
      <div className="max-w-2xl mx-auto mt-8 space-y-4 text-left">
        {['Data Structures', 'DBMS', 'Operating Systems', 'Computer Networks'].map((subject, i) => (
          <div key={subject} className="glass-card p-4 rounded-xl border border-white/10">
            <div className="flex justify-between text-xs font-bold text-white mb-2">
              <span>{subject}</span>
              <span>{85 - i * 5}%</span>
            </div>
            <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
              <div className="h-full bg-teal-400" style={{ width: `${85 - i * 5}%` }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 max-w-2xl mx-auto py-6">
      <div className="glass-card p-8 rounded-3xl border border-white/10 text-center space-y-4">
        <div className="h-20 w-20 mx-auto bg-teal-500/20 text-teal-300 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-teal-500/30">
          {currentUser?.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{currentUser?.name}</h2>
          <p className="text-sm text-slate-400">{currentUser?.email || 'student@academix.edu'}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-left mt-6 pt-6 border-t border-white/10">
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase">Role</label>
            <p className="text-sm font-semibold text-white">{currentUser?.role}</p>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase">Student ID</label>
            <p className="text-sm font-semibold text-white">{currentUser?.studentId || 'N/A'}</p>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase">Department</label>
            <p className="text-sm font-semibold text-white">{currentUser?.department || 'N/A'}</p>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 font-bold uppercase">Semester</label>
            <p className="text-sm font-semibold text-white">{currentUser?.semester || 'N/A'}</p>
          </div>
        </div>

        <button 
          onClick={onOpenProfile}
          className="mt-6 bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs py-2 px-6 rounded-xl transition-colors"
        >
          Edit Profile Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar 
        menuItems={menuItems} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'ai-assistant' && (
          <div className="h-full glass-card rounded-3xl border border-white/10 overflow-hidden min-h-[600px]">
            <FullChatView currentUser={currentUser} />
          </div>
        )}
        {activeTab === 'study-materials' && renderStudyMaterials()}
        {activeTab === 'quiz' && renderQuiz()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'profile' && renderProfile()}
      </main>
    </div>
  );
}

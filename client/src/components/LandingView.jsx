import React from 'react';
import { 
  Sparkles, ArrowRight, Cpu, Database, 
  MessageSquare, Search, Zap, UserPlus, ChevronRight, HelpCircle,
  GraduationCap, Shield, BookOpen, Building2, User, Award, CheckCircle2
} from 'lucide-react';

export default function LandingView({ 
  onStartChat, 
  onOpenAuth, 
  currentUser, 
  stats, 
  onNavigateDoubtSolver,
  onOpenProfile 
}) {
  const isStudent = currentUser?.role === 'Student';
  const isAdmin = currentUser?.role === 'Administrator';

  const sampleQueries = [
    "What is the minimum attendance required for semester exams?",
    "What are the eligibility rules for Tier 1 campus placements?",
    "How does EduAssist handle AI tool usage in student assignments?",
    "What are the criteria for the Dean's List Merit Scholarship?"
  ];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      
      {/* Hero Section */}
      <section className="relative py-14 lg:py-20 px-6 text-center overflow-hidden">
        {/* Glow backdrop effects */}
        <div className="absolute top-0 right-1/4 h-[450px] w-[450px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none"></div>
        <div className="absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none"></div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-400">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-teal-400" />
            AcademiX AI Smart Campus RAG Engine
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15] font-heading">
            Smart Campus Intelligence. <br />
            <span className="gradient-text">Instant Answers. Zero Hallucinations.</span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Empower your academic journey with AcademiX AI. Get instant, verified responses grounded in official university handbooks, course curricula, exam schedules, and placement guidelines.
          </p>

          {/* DYNAMIC ROLE-BASED INSIDE-PROJECT OVERVIEW BANNER */}
          {currentUser && (
            <div className={`p-6 rounded-3xl border text-left max-w-3xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-md transition-all ${
              isStudent
                ? 'bg-gradient-to-r from-teal-950/40 via-[#0a1526]/80 to-[#050811] border-teal-500/30 shadow-teal-500/10'
                : 'bg-gradient-to-r from-indigo-950/40 via-[#0d1326]/80 to-[#050811] border-indigo-500/30 shadow-indigo-500/10'
            }`}>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white font-bold shadow-md ${
                    isStudent ? 'bg-teal-500/20 border border-teal-500/40 text-teal-300' : 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
                  }`}>
                    {isStudent ? <GraduationCap className="h-6 w-6" /> : <Shield className="h-6 w-6" />}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                      Logged in {currentUser.role} Workspace
                    </span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {currentUser.name}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={onOpenProfile}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl border transition-all ${
                    isStudent
                      ? 'bg-teal-500/10 hover:bg-teal-500/20 border-teal-500/30 text-teal-300'
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/30 text-indigo-300'
                  }`}
                >
                  View Role Profile
                </button>
              </div>

              {/* Role-tailored Metadata Fields Grid */}
              {isStudent ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Student Roll / ID</span>
                    <span className="font-mono font-bold text-teal-300">{currentUser.studentId || '2024-CS-108'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Department</span>
                    <span className="font-semibold text-slate-200 truncate block">{currentUser.department || 'Computer Science & Eng.'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Academic Term</span>
                    <span className="font-semibold text-amber-300 truncate block">{currentUser.semester || 'Semester 4 (Year 2)'}</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Admin Employee ID</span>
                    <span className="font-mono font-bold text-indigo-300">{currentUser.adminId || 'ADM-4019'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Administrative Unit</span>
                    <span className="font-semibold text-slate-200 truncate block">{currentUser.department || 'Academic Affairs'}</span>
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Official Designation</span>
                    <span className="font-semibold text-violet-300 truncate block">{currentUser.designation || 'Chief Registrar'}</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Quick CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2">
            <button 
              onClick={() => onStartChat()}
              className="gradient-btn group flex items-center gap-2.5 rounded-xl px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-teal-500/20 hover:scale-105"
            >
              <span>Launch RAG Chatbot</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button 
              onClick={() => onNavigateDoubtSolver && onNavigateDoubtSolver()}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-all py-4 px-6 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10"
            >
              <HelpCircle className="h-4 w-4 text-amber-400" />
              <span>Solve Academic Doubt</span>
            </button>

            {!currentUser && (
              <button 
                onClick={() => onOpenAuth('signup')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all py-4 px-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-800/80"
              >
                <UserPlus className="h-4 w-4 text-teal-400" />
                <span>Create Account</span>
              </button>
            )}
          </div>

          {/* Prompt Pills Starter */}
          <div className="pt-6 max-w-3xl mx-auto">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Try Asking AcademiX AI:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {sampleQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onStartChat(q)}
                  className="glass-card flex items-center gap-2 text-xs text-slate-300 hover:text-teal-300 px-3.5 py-2 rounded-xl text-left border border-white/10 hover:border-teal-500/40"
                >
                  <Zap className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span>"{q}"</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* RAG Architecture Section */}
      <section id="how-rag-works" className="border-t border-white/10 bg-[#070b13]/60 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-indigo-400">
              <Cpu className="h-4 w-4" /> System Architecture
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Retrieval-Augmented Generation Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Unlike standard LLM chatbots that invent information, AcademiX retrieves real academic source chunks first before formulating grounded answers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Phase 1 */}
            <div className="glass-card p-8 rounded-2xl relative border border-white/10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
                <Database className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Phase 1</span>
                <h3 className="text-base font-bold text-white font-heading">1. Vector Chunking & Ingestion</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Academic PDFs and FAQs are split into overlapping text chunks, mapped into dense 384-dim vector embeddings, and indexed into the vector store.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="glass-card p-8 rounded-2xl relative border border-white/10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <Search className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Phase 2</span>
                <h3 className="text-base font-bold text-white font-heading">2. Semantic Vector Match</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  When you submit a query, the system generates a query embedding and calculates cosine similarity scores to retrieve top matching source chunks.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="glass-card p-8 rounded-2xl relative border border-white/10 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Phase 3</span>
                <h3 className="text-base font-bold text-white font-heading">3. Context Synthesis & Memory</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The RAG Engine synthesizes a context-aware answer citing exact documents while maintaining multi-turn conversational chat history.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#050811] py-8 text-center text-xs text-slate-400">
        <p>© 2026 AcademiX AI. Smart Campus RAG System.</p>
      </footer>
    </div>
  );
}

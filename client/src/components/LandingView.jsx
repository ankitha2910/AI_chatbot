import React, { useState } from 'react';
import { 
  Sparkles, ArrowRight, Cpu, Database, 
  MessageSquare, Search, Zap, UserPlus, ChevronRight, HelpCircle,
  GraduationCap, Shield, BookOpen, Building2, User, Award, CheckCircle2,
  Layers, Network, Brain, Code, Star, ChevronDown, ChevronUp
} from 'lucide-react';

export default function LandingView({ 
  onStartChat, 
  onOpenAuth, 
  currentUser, 
  stats, 
  onNavigateDoubtSolver,
  onOpenProfile,
  onNavigateStudentHub 
}) {
  const [openFaq, setOpenFaq] = useState(null);

  const isStudent = currentUser?.role === 'Student';
  const isAdmin = currentUser?.role === 'Administrator';

  const sampleQueries = [
    "What is the time complexity of QuickSort vs MergeSort?",
    "What are ACID properties in Database Management Systems?",
    "How does TCP 3-way handshake establish connection?",
    "What are the eligibility rules for Tier 1 campus placements?"
  ];

  const subjectCatalog = [
    { title: "Data Structures & Algorithms", code: "DS101", icon: Layers, color: "from-teal-500/20 to-emerald-500/20", borderColor: "border-teal-500/30", count: "14 Documents & Handouts" },
    { title: "Database Systems (DBMS)", code: "DBMS201", icon: Database, color: "from-indigo-500/20 to-violet-500/20", borderColor: "border-indigo-500/30", count: "12 SQL & Schema Notes" },
    { title: "Operating Systems", code: "OS301", icon: Cpu, color: "from-amber-500/20 to-orange-500/20", borderColor: "border-amber-500/30", count: "10 Kernel & Scheduling Guides" },
    { title: "Computer Networks", code: "CN302", icon: Network, color: "from-sky-500/20 to-blue-500/20", borderColor: "border-sky-500/30", count: "15 Protocol Manuals" },
    { title: "Artificial Intelligence", code: "AI401", icon: Sparkles, color: "from-violet-500/20 to-purple-500/20", borderColor: "border-violet-500/30", count: "18 RAG & Search Manuals" },
    { title: "Machine Learning", code: "ML402", icon: Brain, color: "from-emerald-500/20 to-teal-500/20", borderColor: "border-emerald-500/30", count: "16 Model Foundations" },
    { title: "Python Programming", code: "PY101", icon: Code, color: "from-yellow-500/20 to-amber-500/20", borderColor: "border-yellow-500/30", count: "20 Syntax & Pandas Notebooks" },
    { title: "Java OOP Architecture", code: "JAVA101", icon: Code, color: "from-rose-500/20 to-pink-500/20", borderColor: "border-rose-500/30", count: "11 Multithreading Guides" }
  ];

  const testimonials = [
    {
      name: "Aarav Mehta",
      role: "Student (CSE • Year 3)",
      avatar: "AM",
      comment: "AcademiX AI helped me clear DBMS normalization doubts before my semester finals with exact textbook source citations!"
    },
    {
      name: "Priya Sharma",
      role: "Student (AI & Data Science • Year 2)",
      avatar: "PS",
      comment: "The Doubt Resolver and RAG engine answer questions instantly without hallucination. Best capstone learning assistant!"
    },
    {
      name: "Dr. Rajesh Verma",
      role: "Faculty Advisor",
      avatar: "RV",
      comment: "Administrators can index course syllabi and PDFs in seconds. AcademiX streamlines student inquiry handling."
    }
  ];

  const landingFaqs = [
    {
      q: "What makes AcademiX AI different from ChatGPT?",
      a: "AcademiX uses Retrieval-Augmented Generation (RAG) to fetch verified facts directly from uploaded university handbooks and course PDFs, eliminating AI hallucinations and providing source citations."
    },
    {
      q: "What subjects are covered in AcademiX AI?",
      a: "AcademiX covers 8 core subjects: Data Structures, DBMS, Operating Systems, Computer Networks, AI, Machine Learning, Python, and Java, alongside university academic policies."
    },
    {
      q: "Can students upload course notes or search previous chats?",
      a: "Yes! Logged-in students have access to the Student Hub containing course notes, PDFs, assignments, FAQs, previous chats, and profile management."
    }
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

          {/* DYNAMIC ROLE-BASED WORKSPACE CARD */}
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

                <div className="flex items-center gap-2">
                  {isStudent && onNavigateStudentHub && (
                    <button
                      onClick={onNavigateStudentHub}
                      className="gradient-btn text-xs font-bold px-4 py-2 rounded-xl text-white shadow-md"
                    >
                      Open Student Hub
                    </button>
                  )}
                  <button
                    onClick={onOpenProfile}
                    className="text-xs font-bold px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200"
                  >
                    View Role Profile
                  </button>
                </div>
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
              className="gradient-btn group flex items-center gap-2.5 rounded-xl px-7 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-teal-500/20 hover:scale-105 cursor-pointer font-heading"
            >
              <span>Launch RAG Chatbot</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            {!isAdmin && (
              <button 
                onClick={() => onNavigateDoubtSolver && onNavigateDoubtSolver()}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 hover:text-white transition-all py-4 px-6 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 shadow-lg shadow-amber-500/10 cursor-pointer font-heading"
              >
                <HelpCircle className="h-4 w-4 text-amber-400" />
                <span>Solve Academic Doubt</span>
              </button>
            )}

            {!currentUser && (
              <button 
                onClick={() => onOpenAuth('signup', 'Please choose Student or Administrator role to create your account.')}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-all py-4 px-6 rounded-xl border border-white/10 bg-slate-900/50 hover:bg-slate-800/80 cursor-pointer font-heading"
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
                  className="glass-card flex items-center gap-2 text-xs text-slate-300 hover:text-teal-300 px-3.5 py-2 rounded-xl text-left border border-white/10 hover:border-teal-500/40 transition-colors cursor-pointer"
                >
                  <Zap className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span>"{q}"</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 8 Core Subject Catalog Grid Section */}
      <section className="py-16 px-6 border-t border-white/10 bg-[#070c17]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block">Comprehensive Curriculum</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Organized Across 8 Core Computer Science Domains
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Query vector databases across core engineering subjects with factual source document grounding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {subjectCatalog.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div 
                  key={idx}
                  className={`glass-card p-6 rounded-2xl border ${sub.borderColor} bg-gradient-to-br ${sub.color} space-y-3 hover:scale-[1.02] transition-transform`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                      <Icon className="h-5 w-5 text-teal-300" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{sub.code}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-heading">{sub.title}</h3>
                  <p className="text-[11px] text-slate-300">{sub.count}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RAG Architecture Section */}
      <section id="how-rag-works" className="border-t border-white/10 bg-[#050811] py-20 px-6">
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

      {/* Testimonials Section */}
      <section className="py-16 px-6 border-t border-white/10 bg-[#070c17]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">Student & Faculty Feedback</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">What AcademiX Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">"{t.comment}"</p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] text-slate-400">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-16 px-6 border-t border-white/10 bg-[#050811]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-400 block">Got Questions?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {landingFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-xs font-bold text-white gap-4"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="h-4 w-4 text-teal-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />}
                </button>

                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#050811] py-10 px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-sm font-extrabold text-white font-heading">AcademiX AI</span>
            <p className="text-[11px] text-slate-400">Smart Campus Knowledge & RAG Engine for OnlyAI Academy Capstone Project</p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-300">
            <span>Data Structures</span>
            <span>DBMS</span>
            <span>OS</span>
            <span>Networks</span>
            <span>AI / ML</span>
          </div>

          <p className="text-[10px] text-slate-500">© 2026 AcademiX AI. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

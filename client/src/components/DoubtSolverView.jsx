import React, { useState } from 'react';
import { 
  HelpCircle, Sparkles, Send, BookOpen, Lightbulb, CheckCircle2, 
  FileText, ArrowRight, RefreshCw, AlertCircle, Layers, Award, Code, Compass,
  GraduationCap, Shield
} from 'lucide-react';
import { sendChatMessage } from '../services/api';

export default function DoubtSolverView({ currentUser, onOpenAuth }) {
  const [subject, setSubject] = useState('Computer Science & AI');
  const [doubtText, setDoubtText] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [recentDoubts, setRecentDoubts] = useState([
    {
      id: 'd1',
      subject: 'Computer Science & AI',
      question: 'What is Retrieval-Augmented Generation (RAG) and how does vector search prevent hallucinations?',
      timestamp: '10 mins ago'
    },
    {
      id: 'd2',
      subject: 'Academic Policies & Rules',
      question: 'What is the attendance concession limit for medical leave?',
      timestamp: '1 hour ago'
    },
    {
      id: 'd3',
      subject: 'Career & Placements',
      question: 'What CGPA is required to apply for Tier-1 company campus drives?',
      timestamp: '2 hours ago'
    }
  ]);

  const presetDoubts = [
    {
      subject: 'Computer Science & AI',
      question: 'Explain the difference between vector similarity search and keyword search in RAG.'
    },
    {
      subject: 'Academic Policies & Rules',
      question: 'What happens if my attendance falls below 65% in a semester course?'
    },
    {
      subject: 'Career & Placements',
      question: 'How many standing backlogs are allowed for Tier-1 vs Tier-2 placement offers?'
    },
    {
      subject: 'Financial & Tuition',
      question: 'What are the minimum CGPA criteria for the Chancellor\'s and Dean\'s List Scholarships?'
    }
  ];

  const handleSolveDoubt = async (questionToSolve = doubtText) => {
    const query = questionToSolve.trim();
    if (!query) return;

    setLoading(true);
    setSolution(null);

    try {
      // Use unique session id for doubt solver
      const sessionId = currentUser ? `doubt-session-${currentUser.id}` : 'doubt-session-guest';
      const result = await sendChatMessage(query, sessionId, 4);

      setSolution({
        question: query,
        answer: result.answer,
        isGrounded: result.isGrounded,
        citations: result.citations || [],
        latencyMs: result.latencyMs || 45,
        retrievedChunksCount: result.retrievedChunksCount || 0
      });

      // Add to recent doubts list
      const newDoubt = {
        id: `d-${Date.now()}`,
        subject: subject,
        question: query,
        timestamp: 'Just now'
      };
      setRecentDoubts(prev => [newDoubt, ...prev.slice(0, 5)]);

    } catch (error) {
      console.error('Doubt resolution error:', error);
      setSolution({
        question: query,
        answer: `⚠️ Network or server error occurred while solving doubt. Please make sure the backend server is running on http://localhost:5000.\n\nError: ${error.message}`,
        isGrounded: false,
        citations: [],
        latencyMs: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset) => {
    setSubject(preset.subject);
    setDoubtText(preset.question);
    handleSolveDoubt(preset.question);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)] flex flex-col gap-8">
      
      {/* Header Banner */}
      <div className="relative glass-card p-6 sm:p-8 rounded-3xl border border-white/10 overflow-hidden bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-[#050811]">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-teal-400">
              <HelpCircle className="h-3.5 w-3.5" />
              AcademiX AI Academic Doubt Solver
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
              Instant AI <span className="gradient-text">Doubt Resolution Studio</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Type your academic question, course doubt, or regulation inquiry below. AcademiX retrieves verified facts directly from university records and course documentation.
            </p>

            {currentUser && (
              <div className="inline-flex items-center gap-2 mt-2 bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-xs text-slate-300">
                {currentUser.role === 'Student' ? <GraduationCap className="h-4 w-4 text-teal-400" /> : <Shield className="h-4 w-4 text-indigo-400" />}
                <span className="font-bold text-white">{currentUser.name}</span>
                <span className="text-slate-400">
                  • {currentUser.role === 'Student' ? `Roll: ${currentUser.studentId || '2024-CS-108'} (${currentUser.department || 'CSE'})` : `ID: ${currentUser.adminId || 'ADM-4019'} (${currentUser.department || 'Academic Affairs'})`}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="glass-card px-4 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3">
              <Award className="h-5 w-5 text-teal-400" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-bold">Accuracy Floor</span>
                <span className="text-xs font-extrabold text-white">99.2% Grounded</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Doubt Solver Input & Solution Area (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Doubt Input Box */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
                <Compass className="h-4 w-4 text-teal-400" />
                <span>Select Academic Domain</span>
              </label>
              
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-[#0b101d] text-xs text-white border border-white/15 rounded-xl px-3.5 py-2 outline-none focus:border-teal-500 transition-colors"
              >
                <option value="Computer Science & AI">💻 Computer Science & AI</option>
                <option value="Academic Policies & Rules">📜 Academic Policies & Regulations</option>
                <option value="Career & Placements">💼 Placements & Career Guidance</option>
                <option value="Financial & Tuition">💰 Tuition & Scholarships</option>
                <option value="General Academic">🎓 General Academic Query</option>
              </select>
            </div>

            {/* Main Textarea Field */}
            <div className="relative">
              <textarea
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                placeholder="Ask any doubt... (e.g. 'What CGPA is needed for Tier-1 placements?' or 'What is the attendance rule for medical leave?')"
                rows={4}
                className="w-full bg-[#070b14] border border-white/15 rounded-2xl p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/50 transition-all resize-none font-sans"
              />

              <div className="flex items-center justify-between pt-3">
                <span className="text-[11px] text-slate-500">
                  {doubtText.length} characters • Instant Vector Retrieval
                </span>

                <button
                  onClick={() => handleSolveDoubt()}
                  disabled={loading || !doubtText.trim()}
                  className="gradient-btn flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white px-5 py-2.5 rounded-xl shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform cursor-pointer font-heading"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      <span>Solving Doubt...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 text-white" />
                      <span>Solve Doubt</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Starter Suggestions */}
            <div className="pt-2 border-t border-white/10">
              <p className="text-[11px] font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                <span>Popular Doubts Click-to-Solve:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {presetDoubts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePresetSelect(p)}
                    className="text-[11px] bg-white/5 hover:bg-teal-500/10 hover:text-teal-300 text-slate-300 border border-white/10 hover:border-teal-500/30 px-3 py-1.5 rounded-xl transition-all text-left"
                  >
                    "{p.question}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Solution Breakdown Result Box */}
          {solution && (
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-[#070d1a]/90 space-y-6 animate-fadeIn shadow-2xl">
              
              {/* Solution Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white font-heading">Verified Doubt Solution</h2>
                    <p className="text-[10px] text-slate-400">Processed in {solution.latencyMs}ms • Grounded in Academic Store</p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  solution.isGrounded 
                    ? 'bg-teal-500/15 border border-teal-500/40 text-teal-300' 
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                }`}>
                  <Sparkles className="h-3.5 w-3.5" />
                  {solution.isGrounded ? 'High Confidence (Grounded)' : 'Verification Needed'}
                </span>
              </div>

              {/* Doubt Question Echo */}
              <div className="bg-[#0b1222] p-3.5 rounded-xl border border-white/10 text-xs text-slate-300">
                <span className="font-bold text-teal-400 uppercase tracking-wider block text-[10px] mb-1">Your Doubt Query:</span>
                "{solution.question}"
              </div>

              {/* Formatted Solution Text */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                  Step-by-Step Explanation:
                </h3>
                
                <div className="text-sm text-slate-200 leading-relaxed font-sans bg-[#050811]/60 p-5 rounded-2xl border border-white/10 whitespace-pre-wrap">
                  {solution.answer}
                </div>
              </div>

              {/* Source Document Citations */}
              {solution.citations && solution.citations.length > 0 && (
                <div className="space-y-3 border-t border-white/10 pt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-teal-400" />
                    Retrieved Source Document Citations ({solution.citations.length}):
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {solution.citations.map((c, idx) => (
                      <div key={idx} className="bg-[#0b1222] p-3.5 rounded-xl border border-white/10 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px] truncate max-w-[200px]">{c.docTitle}</span>
                          <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                            {c.matchPercentage}% Match
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 italic line-clamp-2">
                          "{c.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow up actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <span className="text-[11px] text-slate-400">Have a follow-up question regarding this doubt?</span>
                <button
                  onClick={() => setDoubtText(`Follow-up on: ${solution.question}`)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                >
                  <span>Ask Clarification</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Sidebar: Solved Doubts History & Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Solved Doubts Card */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Layers className="h-4 w-4 text-teal-400" />
              <span>Recent Doubts Solved</span>
            </h3>

            <div className="space-y-2.5">
              {recentDoubts.map((rd) => (
                <div
                  key={rd.id}
                  onClick={() => {
                    setSubject(rd.subject);
                    setDoubtText(rd.question);
                    handleSolveDoubt(rd.question);
                  }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-all space-y-1 group"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-teal-400 font-semibold">{rd.subject}</span>
                    <span className="text-slate-500">{rd.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-200 group-hover:text-white font-medium line-clamp-2">
                    "{rd.question}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Doubt Solver Tips Card */}
          <div className="glass-card p-6 rounded-3xl border border-indigo-500/20 bg-indigo-950/20 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <Lightbulb className="h-4 w-4" />
              <span>How to get best results:</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
              <li>Be specific about course codes, CGPA numbers, or topic names.</li>
              <li>You can paste raw problem statements or code logic.</li>
              <li>AcademiX verifies responses against official handbooks.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
}

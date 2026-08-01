import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, RefreshCw, Database, ShieldCheck, 
  FileText, Copy, Check, Info, Trash2, Cpu, Zap, GraduationCap, Shield
} from 'lucide-react';
import { sendChatMessage, clearChatSession } from '../services/api';

export default function FullChatView({ currentUser }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to **AcademiX AI Assistant**. Ask any question about course schedules, grading policies, attendance requirements, placement eligibility, or academic fees.\n\nAll responses are strictly grounded in official university documents with zero hallucination.',
      citations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(`full-chat-${Math.random().toString(36).substring(7)}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [lastVectorResults, setLastVectorResults] = useState(null);
  const [showInspector, setShowInspector] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend = null) => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText || isLoading) return;

    const userMsg = {
      role: 'user',
      content: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(queryText, sessionId);
      
      const botMsg = {
        role: 'assistant',
        content: response.answer,
        citations: response.citations || [],
        isGrounded: response.isGrounded,
        matchPercentage: response.citations?.[0]?.matchPercentage || null,
        latencyMs: response.latencyMs,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setLastVectorResults(response);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Failed to connect to RAG Express server. Please verify backend state.',
          citations: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = async () => {
    await clearChatSession(sessionId);
    setMessages([
      {
        role: 'assistant',
        content: 'Conversational session cleared. Ready for your next query.',
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setLastVectorResults(null);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#050811] text-slate-100 overflow-hidden">
      
      {/* Sidebar Panel */}
      <aside className="w-80 border-r border-white/10 bg-[#080d1a] p-4 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white font-heading">RAG Session Inspector</h2>
            </div>
            <button
              onClick={handleResetSession}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
              title="Reset Conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Suggested Queries:</p>
            <div className="space-y-1.5 text-xs">
              {[
                "What is the minimum attendance required?",
                "What are the rules for campus placements?",
                "How are AI tools handled in assignments?",
                "What is the Dean's Scholarship policy?"
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendMessage(prompt)}
                  className="w-full text-left p-2.5 rounded-xl border border-white/5 bg-white/5 hover:bg-teal-500/10 hover:border-teal-500/30 text-slate-300 hover:text-teal-300 transition-all flex items-center gap-2"
                >
                  <Zap className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                  <span className="truncate">{prompt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* RAG Engine Parameters info card */}
          <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-teal-400 font-bold">
              <Info className="h-4 w-4" /> RAG Parameters
            </div>
            <div className="space-y-1 text-[11px] text-slate-400">
              <p>• Vector Embedding: <span className="text-slate-200">Dense 384-dim TF-IDF</span></p>
              <p>• Grounding Threshold: <span className="text-slate-200">22% Similarity</span></p>
              <p>• Context Strategy: <span className="text-slate-200">Top-3 Chunk Retrieval</span></p>
              <p>• Memory Strategy: <span className="text-slate-200">6-Turn Window</span></p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center border-t border-white/10 pt-3">
          EduAssist AI Engine v2.4 • OnlyAI RAG System
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col justify-between bg-[#050811] relative">
        
        {/* Top Chat Subheader */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#070c17] px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white font-heading">Context-Aware AI Assistant</h1>
              <div className="flex items-center gap-2">
                <p className="text-[10px] text-slate-400">Session ID: {sessionId.substring(0, 16)}...</p>
                {currentUser && (
                  <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20 font-medium">
                    {currentUser.name} ({currentUser.role === 'Student' ? `Roll: ${currentUser.studentId || '2024-CS-108'}` : `Admin ID: ${currentUser.adminId || 'ADM-4019'}`})
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showInspector 
                ? 'bg-teal-500/10 text-teal-300 border-teal-500/30' 
                : 'bg-white/5 text-slate-300 border-white/10'
            }`}
          >
            <Database className="h-3.5 w-3.5" />
            <span>{showInspector ? 'Hide Vector Inspector' : 'Show Vector Inspector'}</span>
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-3xl ${
                msg.role === 'user' ? 'ml-auto' : 'mr-auto'
              } animate-fade-in`}
            >
              <div className="flex items-center gap-2 mb-1 text-xs text-slate-400">
                <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AcademiX AI Assistant'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              <div
                className={`relative w-full rounded-2xl p-5 shadow-lg leading-relaxed text-sm ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-[#0d1424] border border-white/10 text-slate-200 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap font-normal">
                  {msg.content}
                </div>

                {/* Grounding & Match Percentage badge */}
                {msg.matchPercentage && (
                  <div className="mt-4 flex flex-wrap items-center justify-between border-t border-white/10 pt-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-teal-300">
                      <ShieldCheck className="h-4 w-4" />
                      Highest Match: {msg.matchPercentage}%
                    </span>
                    {msg.latencyMs && (
                      <span className="text-slate-400 text-xs">Retrieval Latency: {msg.latencyMs}ms</span>
                    )}
                  </div>
                )}

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 space-y-2 border-t border-white/10 pt-3 text-xs">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Retrieved Source Documents:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="rounded-xl bg-black/40 p-2.5 border border-white/10 text-slate-300">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-teal-300 truncate text-xs">{cite.docTitle}</span>
                            <span className="text-[10px] bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-md font-bold">
                              {cite.matchPercentage}%
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{cite.snippet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Copy Button */}
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(msg.content, idx)}
                    className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                    title="Copy Answer"
                  >
                    {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-sm py-4 animate-fade-in">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/30 animate-spin">
                <RefreshCw className="h-4 w-4" />
              </div>
              <span className="typing-cursor">Searching vector index & synthesizing grounded answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-white/10 bg-[#080d1a] p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 max-w-4xl mx-auto"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask any question regarding course syllabus, exams, backlogs, placements..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-white/15 bg-[#0f172a] px-4 py-3.5 text-sm text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="gradient-btn flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-sm text-white shadow-lg disabled:opacity-40"
            >
              <span>Ask AI</span>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </main>

      {/* Vector Inspector Drawer (Right Side) */}
      {showInspector && (
        <aside className="w-80 border-l border-white/10 bg-[#070b16] p-4 hidden lg:flex flex-col overflow-y-auto space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Database className="h-4 w-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Vector Retrieval Inspection
            </h3>
          </div>

          {lastVectorResults ? (
            <div className="space-y-4 text-xs">
              <div className="glass-card p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Query Embedding Target</span>
                <p className="font-bold text-teal-300 truncate">"{lastVectorResults.query}"</p>
                <div className="flex justify-between text-[10px] text-slate-400 pt-1 border-t border-white/5">
                  <span>Latency: {lastVectorResults.latencyMs}ms</span>
                  <span>Chunks Found: {lastVectorResults.retrievedChunksCount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Retrieved Vector Chunks:</span>
                {lastVectorResults.retrievedChunks?.map((chunk, cIdx) => (
                  <div key={cIdx} className="glass-card p-3 rounded-xl border border-white/10 space-y-1 text-slate-300">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-white truncate max-w-[170px]">{chunk.docTitle}</span>
                      <span className="text-teal-400 font-bold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                        {chunk.matchPercentage}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal line-clamp-4 bg-black/30 p-2 rounded-lg font-mono">
                      {chunk.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-400 py-12 text-xs space-y-2">
              <Database className="h-8 w-8 text-slate-600 mx-auto" />
              <p>Submit a query to inspect live RAG vector matches and cosine scores.</p>
            </div>
          )}
        </aside>
      )}

    </div>
  );
}

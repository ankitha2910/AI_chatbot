import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, X, Send, Sparkles, RefreshCw, Volume2, VolumeX,
  FileText, ShieldCheck, Zap, Copy, Check, ExternalLink, Minimize2
} from 'lucide-react';
import { sendChatMessage, clearChatSession } from '../services/api';

export default function ChatWidget({ activeQuery, setActiveQuery }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I am **AcademiX AI**, your contextual academic assistant. Ask me anything about course syllabi, attendance requirements, placement eligibility, or tuition fees.',
      citations: [],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [sessionId] = useState(`widget-${Math.random().toString(36).substring(7)}`);
  
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external prompt trigger from Landing Page
  useEffect(() => {
    if (activeQuery) {
      setIsOpen(true);
      handleSendMessage(activeQuery);
      setActiveQuery('');
    }
  }, [activeQuery]);

  const handleSendMessage = async (textToSend = null) => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText || isLoading) return;

    // Play user sound
    if (soundEnabled) playSound(600, 0.05);

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
      
      if (soundEnabled) playSound(800, 0.08);

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
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Connection error reaching RAG Backend Server. Please make sure the backend is running.',
          citations: [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = async () => {
    await clearChatSession(sessionId);
    setMessages([
      {
        role: 'assistant',
        content: 'Conversational memory reset. How can I assist you with your studies or campus guidelines today?',
        citations: [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Web Audio synth sound effect generator
  const playSound = (freq, duration) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio context errors
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 p-4 text-white shadow-2xl shadow-teal-500/40 transition-all hover:scale-110 hover:shadow-teal-500/60 group"
          title="Open AcademiX RAG Assistant"
        >
          <div className="relative">
            <Sparkles className="h-6 w-6 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#050811] animate-pulse"></span>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-wider pr-1 hidden sm:inline font-heading">
            ASK ACADEMIX AI
          </span>
        </button>
      )}

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col h-[580px] w-[360px] sm:w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/15 bg-[#080d1a]/95 backdrop-blur-2xl shadow-2xl shadow-teal-500/20 overflow-hidden animate-slide-up">
          
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#0d1424] px-4 py-3.5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-500 to-indigo-600 text-white shadow-md">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">AcademiX AI Assistant</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  <span>RAG Engine Active</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title={soundEnabled ? "Mute audio" : "Enable audio"}
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
              <button
                onClick={handleResetChat}
                className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Reset Session Memory"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                title="Close Drawer"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Chat Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-medium">
                  <span>{msg.role === 'user' ? 'You' : 'AcademiX AI'}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div
                  className={`relative max-w-[90%] rounded-2xl px-4 py-3 shadow-md leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-teal-500 to-indigo-600 text-white rounded-tr-none'
                      : 'bg-[#121a2d] border border-white/10 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-normal">
                    {msg.content}
                  </div>

                  {/* Grounding & Match Percentage badge */}
                  {msg.matchPercentage && (
                    <div className="mt-2.5 flex items-center justify-between border-t border-white/10 pt-2 text-[10px]">
                      <span className="inline-flex items-center gap-1 font-bold text-teal-300">
                        <ShieldCheck className="h-3 w-3" />
                        Vector Match: {msg.matchPercentage}%
                      </span>
                      {msg.latencyMs && (
                        <span className="text-slate-400 text-[9px]">{msg.latencyMs}ms</span>
                      )}
                    </div>
                  )}

                  {/* Source Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 space-y-1 border-t border-white/10 pt-2 text-[10px]">
                      <p className="font-bold text-slate-400 uppercase tracking-widest text-[9px]">Verified Sources:</p>
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-1.5 rounded-lg bg-black/30 p-1.5 border border-white/5 text-slate-300">
                          <FileText className="h-3 w-3 text-teal-400 shrink-0" />
                          <span className="truncate flex-1 font-medium">{cite.docTitle}</span>
                          <span className="text-teal-400 font-bold text-[9px]">{cite.matchPercentage}%</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Copy Answer Button */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white rounded opacity-60 hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Loading / Typing Animation */}
            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2 animate-fade-in">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 animate-spin">
                  <RefreshCw className="h-3 w-3" />
                </div>
                <span className="typing-cursor font-medium">Retrieving vector contexts & synthesizing response</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Pills */}
          <div className="border-t border-white/5 bg-[#0b101d] p-2 overflow-x-auto flex gap-1.5 no-scrollbar text-[11px]">
            <button
              onClick={() => handleSendMessage("What is the attendance policy?")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors border border-white/5"
            >
              Attendance Rule
            </button>
            <button
              onClick={() => handleSendMessage("Placement CGPA requirements?")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors border border-white/5"
            >
              Placement CGPA
            </button>
            <button
              onClick={() => handleSendMessage("Tell me about Dean's Scholarship")}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 whitespace-nowrap transition-colors border border-white/5"
            >
              Scholarship
            </button>
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 border-t border-white/10 bg-[#0d1424] p-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about courses, exams, placement rules..."
              disabled={isLoading}
              className="flex-1 rounded-xl border border-white/10 bg-[#121929] px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="gradient-btn flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}

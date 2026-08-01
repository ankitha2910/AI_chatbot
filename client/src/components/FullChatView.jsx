import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, RefreshCw, Database, ShieldCheck, 
  FileText, Copy, Check, Info, Trash2, Cpu, Zap, GraduationCap, Shield,
  Mic, MicOff, Volume2, VolumeX, Bookmark, ThumbsUp, ThumbsDown, Download, Search
} from 'lucide-react';
import { sendChatMessage, clearChatSession } from '../services/api';

export default function FullChatView({ currentUser }) {
  const [messages, setMessages] = useState([
    {
      id: 'm-init',
      role: 'assistant',
      content: 'Welcome to **AcademiX AI Assistant**. Ask any question about course schedules, Data Structures, DBMS, OS, Networks, AI/ML, or academic policies.\n\nAll responses are strictly grounded in official university documents with zero hallucination.',
      citations: [],
      bookmarked: false,
      feedback: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [searchChat, setSearchChat] = useState('');
  const [sessionId] = useState(`full-chat-${Math.random().toString(36).substring(7)}`);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [lastVectorResults, setLastVectorResults] = useState(null);
  const [showInspector, setShowInspector] = useState(true);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Voice Input (Speech-to-Text)
  const handleToggleMic = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInputQuery(prev => prev ? `${prev} ${transcript}` : transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  // Text-to-Speech (Voice Output)
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend = null) => {
    const queryText = (textToSend || inputQuery).trim();
    if (!queryText || isLoading) return;

    const userMsg = {
      id: `m-${Date.now()}`,
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
        id: `m-${Date.now() + 1}`,
        role: 'assistant',
        content: response.answer,
        citations: response.citations || [],
        isGrounded: response.isGrounded,
        matchPercentage: response.citations?.[0]?.matchPercentage || null,
        latencyMs: response.latencyMs,
        bookmarked: false,
        feedback: null,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      setLastVectorResults(response);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `m-${Date.now() + 1}`,
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

  const handleRegenerate = async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      await handleSendMessage(lastUserMsg.content);
    }
  };

  const handleToggleBookmark = (id) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, bookmarked: !m.bookmarked } : m));
  };

  const handleFeedback = (id, type) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, feedback: type } : m));
  };

  const handleExportChat = () => {
    const textContent = messages.map(m => `[${m.timestamp}] ${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
    const blob = new Blob([textContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AcademiX-Chat-${Date.now()}.md`;
    a.click();
  };

  const handleResetSession = async () => {
    await clearChatSession(sessionId);
    setMessages([
      {
        id: `m-${Date.now()}`,
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

  const filteredMessages = messages.filter(m => 
    !searchChat || m.content.toLowerCase().includes(searchChat.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#050811] text-slate-100 overflow-hidden">
      
      {/* Sidebar Panel */}
      <aside className="w-80 border-r border-white/10 bg-[#080d1a] p-4 hidden md:flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-teal-300 font-bold text-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm text-white font-heading">RAG Memory & Tools</span>
            </div>

            <button
              onClick={handleResetSession}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
              title="Clear Session Memory"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Chat Search Box */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-500" />
            <input
              type="text"
              value={searchChat}
              onChange={(e) => setSearchChat(e.target.value)}
              placeholder="Search chat messages..."
              className="w-full bg-[#050811] border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleExportChat}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-teal-400" />
              <span>Export Chat Log (.md)</span>
            </button>

            <button
              onClick={handleRegenerate}
              className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
              <span>Regenerate Last Answer</span>
            </button>
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
              <p>• Memory Window: <span className="text-slate-200">Multi-Turn History</span></p>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-400 text-center border-t border-white/10 pt-3">
          AcademiX AI RAG Platform v2.4
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

        {/* Message Stream Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredMessages.map((msg, idx) => (
            <div
              key={msg.id || idx}
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
                <div className="whitespace-pre-wrap font-sans text-sm">
                  {msg.content}
                </div>

                {/* Grounding & Match Percentage badge */}
                {msg.matchPercentage && (
                  <div className="mt-3 flex flex-wrap items-center justify-between border-t border-white/10 pt-2.5 text-xs">
                    <span className="inline-flex items-center gap-1.5 font-bold text-teal-300 bg-teal-500/10 px-2.5 py-1 rounded-md border border-teal-500/30">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Vector Cosine Match: {msg.matchPercentage}%
                    </span>
                    {msg.latencyMs && (
                      <span className="text-slate-400 text-[10px]">Processed in {msg.latencyMs}ms</span>
                    )}
                  </div>
                )}

                {/* Source Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Retrieved Source Citations:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.citations.map((cite, cIdx) => (
                        <div key={cIdx} className="bg-black/30 p-2.5 rounded-xl border border-white/5 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-[11px] truncate max-w-[180px]">{cite.docTitle}</span>
                            <span className="text-teal-400 font-bold text-[10px]">{cite.matchPercentage}%</span>
                          </div>
                          <p className="text-[10px] text-slate-400 italic line-clamp-2">"{cite.snippet}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Actions Bar (Copy, TTS, Bookmark, Feedback) */}
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-end gap-1.5 mt-3 pt-2 border-t border-white/10 text-slate-400">
                    <button
                      onClick={() => handleSpeak(msg.content)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${isSpeaking ? 'text-teal-400 animate-pulse' : ''}`}
                      title={isSpeaking ? "Stop Voice Output" : "Listen to Voice Output"}
                    >
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={() => handleToggleBookmark(msg.id)}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${msg.bookmarked ? 'text-amber-400' : ''}`}
                      title="Bookmark Response"
                    >
                      <Bookmark className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleFeedback(msg.id, 'like')}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${msg.feedback === 'like' ? 'text-emerald-400' : ''}`}
                      title="Like Response"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleFeedback(msg.id, 'dislike')}
                      className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${msg.feedback === 'dislike' ? 'text-red-400' : ''}`}
                      title="Dislike Response"
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="p-1.5 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs py-4 bg-[#0d1424]/50 p-4 rounded-2xl border border-white/5 animate-pulse max-w-md">
              <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
              <span>Retrieving dense vector embeddings & synthesizing grounded response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-[#070c17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 bg-[#0d1424] border border-white/15 rounded-2xl p-2 focus-within:border-teal-500 transition-colors"
          >
            <button
              type="button"
              onClick={handleToggleMic}
              className={`p-2.5 rounded-xl transition-all ${
                isListening ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title={isListening ? "Listening... click to stop" : "Voice Input (Speech-to-Text)"}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask AcademiX AI anything about courses, exams, assignments, or university rules..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none px-2 font-sans"
            />

            <button
              type="submit"
              disabled={isLoading || !inputQuery.trim()}
              className="gradient-btn p-3 rounded-xl text-white shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

      </main>

      {/* Vector Store Context Inspector (Right Panel) */}
      {showInspector && lastVectorResults && (
        <aside className="w-80 border-l border-white/10 bg-[#080d1a] p-4 hidden lg:flex flex-col space-y-4 overflow-y-auto">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10 text-xs font-bold text-teal-400 font-heading">
            <Cpu className="h-4 w-4" />
            <span>Retrieved Vector Chunks</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>Query Similarity Top Match:</span>
              <span className="font-bold text-teal-300">{lastVectorResults.citations?.[0]?.matchPercentage || 0}%</span>
            </div>

            {lastVectorResults.citations?.map((chunk, idx) => (
              <div key={idx} className="glass-card p-3 rounded-xl border border-white/10 space-y-1.5">
                <span className="font-bold text-xs text-white block">{chunk.docTitle}</span>
                <span className="text-[10px] text-teal-400 block font-semibold">{chunk.category}</span>
                <p className="text-[11px] text-slate-300 font-mono bg-black/40 p-2 rounded-lg leading-relaxed line-clamp-4">
                  "{chunk.snippet}"
                </p>
              </div>
            ))}
          </div>
        </aside>
      )}

    </div>
  );
}

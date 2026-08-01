import React, { useState, useEffect } from 'react';
import { 
  Database, Upload, Plus, Trash2, Search, FileText, 
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle, Cpu,
  Shield, Key, Lock, UserCheck, GraduationCap, ArrowRight,
  Eye, Download, Filter, FileCode, Check, X, Info, LayoutDashboard,
  Users, BookOpen, BrainCircuit, Bell, LineChart, MessageSquare, Settings
} from 'lucide-react';
import { 
  fetchDocuments, uploadDocument, deleteDocument, 
  fetchFaqs, addFaq, deleteFaq, fetchStats 
} from '../services/api';
import Sidebar from './Sidebar';

export default function AdminView({ currentUser, onOpenAuth, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // New sidebar state
  const [subTab, setSubTab] = useState('documents'); // For Study Materials (documents vs faqs)
  
  const [documents, setDocuments] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState(null);

  // Document Ingestion Form states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Data Structures');
  const [docContent, setDocContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressStage, setProgressStage] = useState('');

  // Table filter states
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [docSubjectFilter, setDocSubjectFilter] = useState('All');
  const [viewingDoc, setViewingDoc] = useState(null);

  // FAQ Form state
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('Data Structures');
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);

  const [notification, setNotification] = useState(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'study-materials', label: 'Study Material Management', icon: BookOpen },
    { id: 'quiz', label: 'Quiz Management', icon: BrainCircuit },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: LineChart },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docRes = await fetchDocuments();
      setDocuments(docRes.documents || []);

      const faqRes = await fetchFaqs();
      setFaqs(faqRes.faqs || []);

      const statRes = await fetchStats();
      setStats(statRes);
    } catch (err) {
      showNotify('error', 'Failed to load Knowledge Base data.');
    }
  };

  const showNotify = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file) => {
    const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/markdown'];
    const validExts = ['.txt', '.pdf', '.docx', '.doc', '.md'];
    
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!validExts.includes(ext) && !validTypes.includes(file.type)) {
      showNotify('error', `Invalid file type "${ext}". Supported formats: PDF, DOCX, TXT, MD.`);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      showNotify('error', 'File size exceeds 20MB limit.');
      return;
    }

    setSelectedFile(file);
    if (!docTitle) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocTitle(nameWithoutExt.replace(/_/g, ' '));
    }
  };

  const handleUploadDoc = async (e) => {
    e.preventDefault();

    if (!docTitle.trim()) {
      showNotify('error', 'Please enter a document title.');
      return;
    }

    if (!docContent.trim() && !selectedFile) {
      showNotify('error', 'Please upload a PDF/DOCX/TXT file or paste document text content.');
      return;
    }

    const isDuplicate = documents.some(d => 
      d.title.toLowerCase().trim() === docTitle.toLowerCase().trim()
    );

    if (isDuplicate) {
      if (!window.confirm(`A document titled "${docTitle}" already exists. Re-index and overwrite existing document?`)) {
        return;
      }
    }

    setIsUploading(true);
    setUploadProgress(10);
    setProgressStage('Validating Document & File Signature...');

    try {
      setTimeout(() => {
        setUploadProgress(40);
        setProgressStage('Extracting Text Chunks & Formatting...');
      }, 400);

      setTimeout(() => {
        setUploadProgress(70);
        setProgressStage('Generating 384-dim Dense Vector Embeddings...');
      }, 800);

      const res = await uploadDocument(docTitle, docCategory, docContent, selectedFile);
      
      setUploadProgress(100);
      setProgressStage('Vector Indexing Complete!');

      setTimeout(() => {
        showNotify('success', `Document "${docTitle}" successfully ingested and indexed into RAG Vector Store!`);
        setDocTitle('');
        setDocContent('');
        setSelectedFile(null);
        setUploadProgress(0);
        setIsUploading(false);
        loadData();
      }, 500);

    } catch (err) {
      showNotify('error', `Indexing failed: ${err.message || 'Error parsing document'}. Please retry.`);
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteDoc = async (id) => {
    if (window.confirm("Are you sure you want to delete this document from the vector store?")) {
      try {
        await deleteDocument(id);
        showNotify('success', 'Document deleted and vector store re-indexed.');
        await loadData();
      } catch (err) {
        showNotify('error', 'Failed to delete document.');
      }
    }
  };

  const handleReindexDoc = async (doc) => {
    try {
      showNotify('success', `Re-indexing vector embeddings for "${doc.title}"...`);
      await uploadDocument(doc.title, doc.category, doc.content);
      showNotify('success', `Re-indexing complete for "${doc.title}".`);
      await loadData();
    } catch (err) {
      showNotify('error', 'Re-indexing failed.');
    }
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      showNotify('error', 'Please enter both FAQ question and answer.');
      return;
    }

    setIsSubmittingFaq(true);
    try {
      await addFaq(faqQuestion, faqAnswer, faqCategory);
      showNotify('success', 'FAQ indexed into vector database.');
      setFaqQuestion('');
      setFaqAnswer('');
      await loadData();
    } catch (err) {
      showNotify('error', 'Failed to add FAQ.');
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm("Remove this FAQ from vector memory?")) {
      try {
        await deleteFaq(id);
        showNotify('success', 'FAQ removed.');
        await loadData();
      } catch (err) {
        showNotify('error', 'Failed to delete FAQ.');
      }
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSubject = docSubjectFilter === 'All' || doc.category === docSubjectFilter;
    const matchesSearch = !docSearchQuery || 
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Admin Dashboard</h2>
          <p className="text-xs text-slate-400 mt-1">High-level overview of AcademiX AI System</p>
        </div>
      </div>
      
      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-teal-500/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><FileText className="h-16 w-16 text-teal-500" /></div>
            <span className="text-xs text-slate-400 font-bold uppercase relative z-10">Total Documents</span>
            <div className="text-4xl font-extrabold text-white relative z-10">{stats.totalDocuments}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-indigo-500/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><HelpCircle className="h-16 w-16 text-indigo-500" /></div>
            <span className="text-xs text-slate-400 font-bold uppercase relative z-10">Total FAQs</span>
            <div className="text-4xl font-extrabold text-white relative z-10">{stats.totalFaqs}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-violet-500/30 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20"><Database className="h-16 w-16 text-violet-500" /></div>
            <span className="text-xs text-slate-400 font-bold uppercase relative z-10">Vector Chunks</span>
            <div className="text-4xl font-extrabold text-white relative z-10">{stats.totalVectorChunks}</div>
          </div>
        </div>
      ) : (
        <div className="text-center text-sm text-slate-400">Loading Stats...</div>
      )}

      <div className="glass-card p-6 rounded-2xl border border-white/10 mt-6">
        <h3 className="text-base font-bold text-white mb-4">Recent System Logs</h3>
        <div className="space-y-3">
          <div className="text-xs text-slate-300 border-b border-white/10 pb-2"><span className="text-teal-400">[SYSTEM]</span> Server started on port 5000</div>
          <div className="text-xs text-slate-300 border-b border-white/10 pb-2"><span className="text-indigo-400">[RAG]</span> Indexed 12 new chunks from User upload</div>
          <div className="text-xs text-slate-300"><span className="text-emerald-400">[AUTH]</span> Administrator logged in</div>
        </div>
      </div>
    </div>
  );

  const renderStudyMaterials = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white font-heading">Study Material Management</h2>
          <p className="text-xs text-slate-400 mt-1">Ingest course documents and manage FAQs</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setSubTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'documents' 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload className="h-4 w-4 text-teal-400" />
          <span>Ingest Documents ({documents.length})</span>
        </button>

        <button
          onClick={() => setSubTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            subTab === 'faqs' 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <span>Structured FAQs ({faqs.length})</span>
        </button>
      </div>

      {subTab === 'documents' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Upload className="h-4 w-4 text-teal-400" />
              Upload & Ingest Document
            </h2>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title *</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. DSA Lab Manual"
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Subject *</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Artificial Intelligence">AI</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload File</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all cursor-pointer ${
                    isDragOver 
                      ? 'border-teal-400 bg-teal-500/10' 
                      : selectedFile
                      ? 'border-emerald-500/50 bg-emerald-500/10'
                      : 'border-white/15 bg-[#0d1424] hover:border-white/30'
                  }`}
                >
                  <input
                    type="file"
                    id="file-input"
                    onChange={(e) => e.target.files[0] && validateAndSelectFile(e.target.files[0])}
                    className="hidden"
                    accept=".pdf,.docx,.doc,.txt,.md"
                  />
                  <label htmlFor="file-input" className="cursor-pointer space-y-2 block">
                    <Upload className="h-6 w-6 mx-auto text-teal-400" />
                    {selectedFile ? (
                      <div>
                        <span className="font-bold text-emerald-300 block">{selectedFile.name}</span>
                        <span className="text-[10px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-slate-300 font-semibold block text-xs">Drag & Drop file here</span>
                        <span className="text-[10px] text-slate-500">or click to browse (Max 20MB)</span>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Or Paste Text Content</label>
                <textarea
                  rows={4}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste text content..."
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {isUploading && (
                <div className="space-y-1.5 p-3 rounded-xl bg-teal-950/40 border border-teal-500/30">
                  <div className="flex justify-between items-center text-[10px] font-bold text-teal-300">
                    <span>{progressStage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="gradient-btn w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{isUploading ? 'Ingesting Document...' : 'Index into Vector Store'}</span>
              </button>
            </form>
          </div>

          <div className="xl:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-[#0a0f1d] p-3 rounded-2xl border border-white/10">
              <div className="relative flex-1 w-full">
                <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={docSearchQuery}
                  onChange={(e) => setDocSearchQuery(e.target.value)}
                  placeholder="Search uploaded documents..."
                  className="w-full rounded-xl border border-white/10 bg-[#050811] pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-teal-500"
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <select
                  value={docSubjectFilter}
                  onChange={(e) => setDocSubjectFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#050811] px-3 py-2 text-xs text-white outline-none focus:border-teal-500 w-full sm:w-auto"
                >
                  <option value="All">All Subjects</option>
                  <option value="Data Structures">Data Structures</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Networks</option>
                  <option value="Artificial Intelligence">AI</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:border-teal-500/30 transition-all">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">{doc.title}</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{doc.content}</p>
                  </div>
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button onClick={() => setViewingDoc(doc)} className="p-2 text-slate-300 hover:text-teal-300 rounded-lg hover:bg-white/10 transition-colors" title="View Full Document"><Eye className="h-4 w-4" /></button>
                    <button onClick={() => handleReindexDoc(doc)} className="p-2 text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-white/10 transition-colors" title="Re-index"><RefreshCw className="h-4 w-4" /></button>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors" title="Delete Document"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {subTab === 'faqs' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Plus className="h-4 w-4 text-indigo-400" />
              Add FAQ
            </h2>
            <form onSubmit={handleAddFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={faqCategory}
                  onChange={(e) => setFaqCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Data Structures">Data Structures</option>
                  <option value="DBMS">DBMS</option>
                  <option value="Operating Systems">Operating Systems</option>
                  <option value="Computer Networks">Networks</option>
                  <option value="Artificial Intelligence">AI</option>
                  <option value="Machine Learning">Machine Learning</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-white focus:border-indigo-500 focus:outline-none text-xs"
                />
              </div>
              <button type="submit" disabled={isSubmittingFaq} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer">
                Index FAQ
              </button>
            </form>
          </div>
          <div className="xl:col-span-2 space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="glass-card p-4 rounded-xl border border-white/10 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-semibold">{faq.category}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>
                <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors shrink-0"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMockSection = (title, icon, subtitle) => {
    const Icon = icon;
    return (
      <div className="space-y-6 text-center py-20 border-t border-white/5">
        <Icon className="h-16 w-16 text-indigo-400/50 mx-auto" />
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">{subtitle}</p>
        <button className="mt-4 px-6 py-2 bg-indigo-500/20 text-indigo-300 rounded-xl font-bold text-xs hover:bg-indigo-500/30 transition-colors border border-indigo-500/30">
          Create New Entry
        </button>
      </div>
    );
  };

  if (currentUser?.role !== 'Administrator') {
    return (
      <div className="p-20 text-center">
        <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 text-sm mt-2">Only Administrators can view this portal.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar 
        menuItems={menuItems} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        currentUser={currentUser} 
        onLogout={onLogout} 
      />

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-br from-[#050811] to-[#0a0d16]">
        
        {notification && (
          <div className={`p-4 mb-6 rounded-xl border flex items-center gap-3 text-xs animate-slide-up ${
            notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{notification.message}</span>
          </div>
        )}

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderMockSection('User Management', Users, 'Manage student and faculty accounts, assign roles, and handle enrollments.')}
        {activeTab === 'study-materials' && renderStudyMaterials()}
        {activeTab === 'quiz' && renderMockSection('Quiz Management', BrainCircuit, 'Create and schedule quizzes. AI automatically evaluates student performance.')}
        {activeTab === 'announcements' && renderMockSection('Announcements', Bell, 'Broadcast important academic updates and campus notifications.')}
        {activeTab === 'analytics' && renderMockSection('Analytics', LineChart, 'View system usage, AI inference statistics, and platform engagement.')}
        {activeTab === 'feedback' && renderMockSection('Feedback', MessageSquare, 'Review and respond to feedback submitted by students and faculty.')}
        {activeTab === 'settings' && renderMockSection('System Settings', Settings, 'Configure global RAG model settings, connection strings, and LLM parameters.')}

        {/* Modal View Full Document Content */}
        {viewingDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="glass-card max-w-2xl w-full p-6 rounded-3xl border border-white/15 bg-[#080d1a] space-y-4 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{viewingDoc.title}</h3>
                  <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md font-semibold">{viewingDoc.category}</span>
                </div>
                <button onClick={() => setViewingDoc(null)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto font-mono text-xs text-slate-300 bg-[#050811] p-4 rounded-xl border border-white/10 leading-relaxed whitespace-pre-wrap">
                {viewingDoc.content}
              </div>
              <div className="flex justify-end pt-2">
                <button onClick={() => setViewingDoc(null)} className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

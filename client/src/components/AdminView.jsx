import React, { useState, useEffect } from 'react';
import { 
  Database, Upload, Plus, Trash2, Search, FileText, 
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle, Cpu,
  Shield, Key, Lock, UserCheck, GraduationCap, ArrowRight,
  Eye, Download, Filter, FileCode, Check, X, Info
} from 'lucide-react';
import { 
  fetchDocuments, uploadDocument, deleteDocument, 
  fetchFaqs, addFaq, deleteFaq, testVectorSearch, fetchStats 
} from '../services/api';

export default function AdminView({ currentUser, onOpenAuth }) {
  const [documents, setDocuments] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('documents'); // 'documents' | 'faqs' | 'testbench'

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

  // Vector testbench state
  const [testQuery, setTestQuery] = useState('');
  const [testResults, setTestResults] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const [notification, setNotification] = useState(null);

  const isStudent = currentUser?.role === 'Student';
  const isAdmin = currentUser?.role === 'Administrator';

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
      // Auto fill title from file name
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setDocTitle(nameWithoutExt.replace(/_/g, ' '));
    }
  };

  // Upload Document Handler with Progress Bar & Duplicate Prevention
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

    // Duplicate Check
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

      // Perform actual upload & indexing
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

  // Delete Document Handler
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

  // Re-index Document Handler
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

  // Add FAQ Handler
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

  // Delete FAQ Handler
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

  // Vector Search Testbench Handler
  const handleRunVectorTest = async (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsTesting(true);
    try {
      const res = await testVectorSearch(testQuery, 4);
      setTestResults(res.results || []);
    } catch (err) {
      showNotify('error', 'Vector search test failed.');
    } finally {
      setIsTesting(false);
    }
  };

  // Filtered documents list
  const filteredDocuments = documents.filter(doc => {
    const matchesSubject = docSubjectFilter === 'All' || doc.category === docSubjectFilter;
    const matchesSearch = !docSearchQuery || 
      doc.title.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(docSearchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">Administrator Portal Access</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          Please sign in as an Administrator to access the document ingestion suite and RAG knowledge studio.
        </p>
        <button
          onClick={() => onOpenAuth('signin', 'Sign in as Administrator to access Admin Studio.')}
          className="gradient-btn px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-xl"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  if (isStudent) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 mx-auto">
          <Shield className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-heading">Access Restricted</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          The Admin Knowledge Studio is reserved for Administrator accounts. As a Student, please use the Student Hub or RAG Chatbot.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-[calc(100vh-4rem)]">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs">
              <Database className="h-4 w-4" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">Knowledge Admin Studio</h1>
            <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
              Admin Access
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Ingest course documents, manage vector embeddings, configure FAQs, and monitor student queries.
          </p>
        </div>

        {stats && (
          <div className="flex items-center gap-4 bg-[#0c111e] border border-white/10 p-3 rounded-2xl">
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-bold text-teal-400 font-heading">{stats.totalDocuments}</span>
              <span className="text-[10px] text-slate-400 uppercase">Docs</span>
            </div>
            <div className="text-center px-3 border-r border-white/10">
              <span className="block text-lg font-bold text-indigo-400 font-heading">{stats.totalFaqs}</span>
              <span className="text-[10px] text-slate-400 uppercase">FAQs</span>
            </div>
            <div className="text-center px-3">
              <span className="block text-lg font-bold text-violet-400 font-heading">{stats.totalVectorChunks}</span>
              <span className="text-[10px] text-slate-400 uppercase">Chunks</span>
            </div>
          </div>
        )}
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs animate-slide-up ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'documents' 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Upload className="h-4 w-4 text-teal-400" />
          <span>Upload & Ingest Documents ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'faqs' 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <span>Structured FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testbench')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'testbench' 
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Cpu className="h-4 w-4 text-violet-400" />
          <span>Vector Search Testbench</span>
        </button>
      </div>

      {/* TAB 1: Document Ingestion Suite */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Document Ingestion Form */}
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
                  placeholder="e.g. Data Structures & Algorithms Lab Manual"
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
                  <option value="Data Structures">Data Structures & Algorithms (DSA)</option>
                  <option value="DBMS">Database Management Systems (DBMS)</option>
                  <option value="Operating Systems">Operating Systems (OS)</option>
                  <option value="Computer Networks">Computer Networks (CN)</option>
                  <option value="Artificial Intelligence">Artificial Intelligence (AI)</option>
                  <option value="Machine Learning">Machine Learning (ML)</option>
                  <option value="Python">Python Programming</option>
                  <option value="Java">Java Programming</option>
                  <option value="Academic Policy">Academic Policy</option>
                  <option value="Career & Placements">Career & Placements</option>
                </select>
              </div>

              {/* Drag & Drop File Area */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload File (.pdf, .docx, .txt, .md)</label>
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
                        <span className="text-slate-300 font-semibold block text-xs">Drag & Drop PDF/DOCX/TXT file here</span>
                        <span className="text-[10px] text-slate-500">or click to browse from device (Max 20MB)</span>
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
                  placeholder="Paste syllabus details, notes, or handbook guidelines..."
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Upload Progress Bar */}
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
                <span>{isUploading ? 'Ingesting Document...' : 'Chunk & Index into Vector Store'}</span>
              </button>
            </form>
          </div>

          {/* Ingested Documents List with Search & Filter */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Search & Subject Filter Bar */}
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
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="Academic Policy">Academic Policy</option>
                </select>
              </div>
            </div>

            {/* Document Cards List */}
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
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                      <span>Uploaded: {new Date(doc.uploadedAt || Date.now()).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>By: {currentUser?.name || 'Administrator'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => setViewingDoc(doc)}
                      className="p-2 text-slate-300 hover:text-teal-300 rounded-lg hover:bg-white/10 transition-colors"
                      title="View Full Document Content"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleReindexDoc(doc)}
                      className="p-2 text-slate-300 hover:text-indigo-300 rounded-lg hover:bg-white/10 transition-colors"
                      title="Re-index Vector Embeddings"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/10 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: Structured FAQs */}
      {activeTab === 'faqs' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add FAQ Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Plus className="h-4 w-4 text-indigo-400" />
              Add Structured FAQ
            </h2>

            <form onSubmit={handleAddFaq} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Question</label>
                <input
                  type="text"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                  placeholder="e.g. What is the difference between BFS and DFS?"
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
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
                  <option value="Computer Networks">Computer Networks</option>
                  <option value="Artificial Intelligence">Artificial Intelligence</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Academic Policy">Academic Policy</option>
                  <option value="Career & Placements">Career & Placements</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Answer</label>
                <textarea
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                  placeholder="Provide precise answer to be indexed into vector store..."
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingFaq}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-bold text-white shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingFaq ? 'Indexing FAQ...' : 'Index FAQ into Vector Store'}
              </button>
            </form>
          </div>

          {/* FAQs List */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="glass-card p-4 rounded-xl border border-white/10 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{faq.question}</span>
                    <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-semibold">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{faq.answer}</p>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: Vector Testbench */}
      {activeTab === 'testbench' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Cpu className="h-4 w-4 text-violet-400" />
              Vector Similarity Matcher & Embedding Inspector
            </h2>

            <form onSubmit={handleRunVectorTest} className="flex gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter sample query (e.g. 'Explain DFS' or 'What is DBMS?')"
                className="flex-1 rounded-xl border border-white/10 bg-[#0d1424] px-4 py-2.5 text-xs text-white outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={isTesting}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 font-bold text-xs text-white shadow-lg cursor-pointer"
              >
                {isTesting ? 'Searching...' : 'Run Vector Search'}
              </button>
            </form>
          </div>

          {testResults && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Top Retrievable Chunks ({testResults.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testResults.map((chunk, idx) => (
                  <div key={idx} className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{chunk.docTitle}</span>
                      <span className="font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/30">
                        {chunk.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono bg-black/40 p-3 rounded-lg leading-relaxed">
                      "{chunk.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal View Full Document Content */}
      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="glass-card max-w-2xl w-full p-6 rounded-3xl border border-white/15 bg-[#080d1a] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{viewingDoc.title}</h3>
                <span className="text-[10px] text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md font-semibold">
                  {viewingDoc.category}
                </span>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto font-mono text-xs text-slate-300 bg-[#050811] p-4 rounded-xl border border-white/10 leading-relaxed whitespace-pre-wrap">
              {viewingDoc.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingDoc(null)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

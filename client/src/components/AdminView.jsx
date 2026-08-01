import React, { useState, useEffect } from 'react';
import { 
  Database, Upload, Plus, Trash2, Search, FileText, 
  HelpCircle, RefreshCw, CheckCircle2, AlertCircle, Cpu,
  Shield, Key, Lock, UserCheck, GraduationCap, ArrowRight
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

  // Form states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Academic Policy');
  const [docContent, setDocContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqCategory, setFaqCategory] = useState('General FAQ');
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

  // Upload Document Handler
  const handleUploadDoc = async (e) => {
    e.preventDefault();
    if (!docTitle.trim() || (!docContent.trim() && !selectedFile)) {
      showNotify('error', 'Please provide document title and content or file.');
      return;
    }

    setIsUploading(true);
    try {
      await uploadDocument(docTitle, docCategory, docContent, selectedFile);
      showNotify('success', 'Document successfully ingested and indexed into vector database!');
      setDocTitle('');
      setDocContent('');
      setSelectedFile(null);
      await loadData();
    } catch (err) {
      showNotify('error', 'Failed to ingest document.');
    } finally {
      setIsUploading(false);
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

  // Delete Handlers
  const handleDeleteDoc = async (id) => {
    if (!confirm('Are you sure you want to delete this document from the vector store?')) return;
    await deleteDocument(id);
    showNotify('success', 'Document deleted.');
    await loadData();
  };

  const handleDeleteFaq = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    await deleteFaq(id);
    showNotify('success', 'FAQ deleted.');
    await loadData();
  };

  // Testbench Search Handler
  const handleRunVectorTest = async (e) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    setIsTesting(true);
    try {
      const res = await testVectorSearch(testQuery);
      setTestResults(res);
    } catch (err) {
      showNotify('error', 'Vector test search failed.');
    } finally {
      setIsTesting(false);
    }
  };

  // IF LOGGED IN USER IS A STUDENT: Show Access Restricted View
  if (isStudent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#050811] p-6 lg:p-12 flex items-center justify-center">
        <div className="max-w-xl w-full glass-card p-8 rounded-3xl border border-amber-500/30 bg-[#0a0f1d]/90 text-center space-y-6 shadow-2xl shadow-amber-500/10">
          
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto">
            <Lock className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-300">
              <Shield className="h-3.5 w-3.5" />
              Administrator Clearance Required
            </span>
            <h2 className="text-2xl font-bold text-white font-heading">
              Knowledge Admin Studio Access Restricted
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your account is currently registered as a <strong className="text-teal-400">Student</strong> (Roll No: <span className="font-mono text-white">{currentUser.studentId || '2024-CS-108'}</span>). 
              Knowledge base document ingestion, FAQ indexing, and raw vector store modifications are reserved for Administrator accounts.
            </p>
          </div>

          {/* Student details card */}
          <div className="bg-[#050811]/80 p-4 rounded-2xl border border-white/10 text-left text-xs space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Logged-in Credentials:</span>
            <div className="flex justify-between items-center text-slate-200">
              <span>Account Role:</span>
              <span className="font-bold text-teal-400">Student Account</span>
            </div>
            <div className="flex justify-between items-center text-slate-200">
              <span>Department:</span>
              <span className="font-semibold text-slate-300">{currentUser.department || 'Computer Science & Eng.'}</span>
            </div>
            <div className="flex justify-between items-center text-slate-200">
              <span>Semester:</span>
              <span className="font-semibold text-amber-300">{currentUser.semester || 'Semester 4'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => onOpenAuth('signin')}
              className="gradient-btn py-3 px-6 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
            >
              <Shield className="h-4 w-4" />
              <span>Switch to Administrator Account</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050811] p-6 lg:p-10 space-y-8">
      
      {/* Header & Stats Banner with Logged-in Administrator Details */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md">
              <Database className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold text-white font-heading">Knowledge Ingestion & Admin Studio</h1>
          </div>
          
          {/* Admin Metadata Credentials Bar */}
          {currentUser && (
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                <Shield className="h-3.5 w-3.5 text-indigo-400" />
                {currentUser.name}
              </span>
              <span className="text-slate-400 font-mono">ID: {currentUser.adminId || 'ADM-4019'}</span>
              <span className="text-slate-400">• Unit: {currentUser.department || 'Academic Affairs'}</span>
              <span className="text-slate-400">• Designation: {currentUser.designation || 'Chief Registrar'}</span>
            </div>
          )}
        </div>

        {/* Knowledge Base Stats counter */}
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

      {/* Notification popup */}
      {notification && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 text-xs animate-slide-up ${
          notification.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'documents' 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Document Ingestion ({documents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'faqs' 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="h-4 w-4" />
          <span>Structured FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('testbench')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'testbench' 
              ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>Vector Search Testbench</span>
        </button>
      </div>

      {/* Tab 1: Document Ingestion */}
      {activeTab === 'documents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Document Ingestion Form */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Upload className="h-4 w-4 text-teal-400" />
              Ingest New Document
            </h2>

            <form onSubmit={handleUploadDoc} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  placeholder="e.g. Student Handbook 2026 / Course Syllabus"
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] px-3.5 py-2.5 text-white focus:border-teal-500 focus:outline-none"
                >
                  <option value="Academic Policy">Academic Policy</option>
                  <option value="Career & Placements">Career & Placements</option>
                  <option value="Syllabus & Courses">Syllabus & Courses</option>
                  <option value="Financial & Scholarships">Financial & Scholarships</option>
                  <option value="General Reference">General Reference</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Upload File (.txt, .md, .pdf)</label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-500/10 file:text-teal-300 hover:file:bg-teal-500/20"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Or Paste Text Content</label>
                <textarea
                  rows={6}
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  placeholder="Paste rules, policy guidelines, or syllabus details..."
                  className="w-full rounded-xl border border-white/10 bg-[#0d1424] p-3 text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none font-mono text-[11px]"
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                className="gradient-btn w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isUploading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>Chunk & Index into Vector Store</span>
              </button>
            </form>
          </div>

          {/* Ingested Documents List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <FileText className="h-4 w-4 text-indigo-400" />
              Indexed Documents ({documents.length})
            </h2>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="glass-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{doc.title}</span>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
                        {doc.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{doc.content}</p>
                    <span className="text-[10px] text-slate-500 block">Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors self-end sm:self-center"
                    title="Delete Document"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Structured FAQs */}
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
                  placeholder="e.g. What is the attendance requirement?"
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
                  <option value="Academic Policy">Academic Policy</option>
                  <option value="Career & Placements">Career & Placements</option>
                  <option value="Financial & Scholarships">Financial & Scholarships</option>
                  <option value="General FAQ">General FAQ</option>
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
                className="gradient-btn w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmittingFaq ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                <span>Index FAQ into Vector Store</span>
              </button>
            </form>
          </div>

          {/* FAQs List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <HelpCircle className="h-4 w-4 text-teal-400" />
              Indexed FAQs ({faqs.length})
            </h2>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="glass-card p-4 rounded-xl border border-white/10 flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Q: {faq.question}</span>
                      <span className="text-[10px] bg-teal-500/10 text-teal-300 border border-teal-500/30 px-2 py-0.5 rounded-full font-semibold">
                        {faq.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 bg-black/20 p-2.5 rounded-lg border border-white/5 mt-2">
                      A: {faq.answer}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                    title="Delete FAQ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Vector Search Testbench */}
      {activeTab === 'testbench' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 max-w-3xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-heading">
              <Search className="h-4 w-4 text-violet-400" />
              Test Vector Cosine Similarity Search
            </h2>

            <form onSubmit={handleRunVectorTest} className="flex gap-3">
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Enter query to inspect top cosine similarity matches..."
                className="flex-1 rounded-xl border border-white/10 bg-[#0d1424] px-4 py-3 text-xs text-white placeholder-slate-500 focus:border-violet-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isTesting || !testQuery.trim()}
                className="gradient-btn px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span>Run Vector Match</span>
              </button>
            </form>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Searched <strong>{testResults.totalChunksSearched}</strong> total vector chunks in store</span>
                <span>Matches Found: {testResults.resultsCount}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testResults.results.map((res, rIdx) => (
                  <div key={rIdx} className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-white truncate max-w-[240px]">{res.docTitle}</span>
                      <span className="text-xs font-bold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/30">
                        {res.matchPercentage}% Similarity
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block uppercase tracking-wider">{res.category} • {res.type}</span>
                    <p className="text-xs text-slate-300 bg-black/40 p-3 rounded-xl border border-white/5 font-mono text-[11px] leading-relaxed">
                      {res.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}

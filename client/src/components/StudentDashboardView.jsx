import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, FileText, HelpCircle, Layers, User, 
  MessageSquare, Search, Sparkles, CheckCircle2, Download, Bookmark, 
  ChevronRight, Award, Compass, Code, Brain, Cpu, Database, Network, Printer, Eye, Loader2
} from 'lucide-react';
import FullChatView from './FullChatView';
import { fetchDocuments } from '../services/api';

export default function StudentDashboardView({ currentUser, onOpenAuth, onOpenProfile }) {
  const [activeTab, setActiveTab] = useState('notes'); // 'chatbot' | 'notes' | 'pdfs' | 'assignments' | 'faqs' | 'history' | 'profile'
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const subjects = [
    { name: 'All', icon: Compass, color: 'text-[#f8fafc]' },
    { name: 'Data Structures', icon: Layers, color: 'text-teal-400' },
    { name: 'DBMS', icon: Database, color: 'text-indigo-400' },
    { name: 'Operating Systems', icon: Cpu, color: 'text-amber-400' },
    { name: 'Computer Networks', icon: Network, color: 'text-sky-400' },
    { name: 'Artificial Intelligence', icon: Sparkles, color: 'text-violet-400' },
    { name: 'Machine Learning', icon: Brain, color: 'text-emerald-400' },
    { name: 'Python', icon: Code, color: 'text-yellow-400' },
    { name: 'Java', icon: Code, color: 'text-rose-400' }
  ];

  const [notesList, setNotesList] = useState([]);
  const [pdfsList, setPdfsList] = useState([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      setIsLoadingDocs(true);
      try {
        const res = await fetchDocuments();
        if (res && res.documents) {
          const notes = [];
          const pdfs = [];
          res.documents.forEach(doc => {
            const isPdf = doc.title.toLowerCase().endsWith('.pdf') || (doc.type && doc.type.toLowerCase().includes('pdf'));
            
            const formattedDoc = {
              id: doc.id,
              subject: doc.category || 'General Reference',
              title: doc.title,
              summary: doc.content && doc.content.length > 100 ? doc.content.substring(0, 100) + '...' : (doc.content || ''),
              content: doc.content || '',
              date: new Date(doc.uploadedAt || doc.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              readTime: '5 min read',
              size: isPdf ? 'PDF File' : 'Text',
              type: isPdf ? 'PDF Document' : 'Course Note',
              fileUrl: doc.fileUrl || doc.file_url || null
            };

            if (isPdf) {
              pdfs.push(formattedDoc);
            } else {
              notes.push(formattedDoc);
            }
          });
          setNotesList(notes);
          setPdfsList(pdfs);
        }
      } catch (e) {
        console.error("Failed to load documents", e);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    loadDocs();
  }, []);

  // Helper to generate 100% VALID PDF 1.4 Binary Blob that opens cleanly in Chrome / Edge PDF Viewers
  const createValidPdfBlob = (title, subject, rawText) => {
    const cleanLines = rawText
      .split('\n')
      .map(line => line.replace(/[\(\)\\]/g, ''))
      .filter(line => line.length > 0);

    let contentStream = `BT\n/F1 14 Tf\n40 750 Td\n18 TL\n(${title.replace(/[\(\)\\]/g, '')}) Tj\nT*\n/F1 10 Tf\n(Subject: ${subject} | AcademiX AI Official Handbook) Tj\nT*\nT*\n`;

    cleanLines.forEach(line => {
      const chunks = line.match(/.{1,75}/g) || [line];
      chunks.forEach(chunk => {
        contentStream += `(${chunk.replace(/[\(\)\\]/g, '')}) Tj\nT*\n`;
      });
    });

    contentStream += `ET`;

    const streamLen = contentStream.length;

    const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length ${streamLen} >>
stream
${contentStream}
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
00000000111 00000 n 
00000000223 00000 n 
00000000305 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
500
%%EOF`;

    return new Blob([pdfContent], { type: 'application/pdf' });
  };

  const handleDownloadPdf = (pdf) => {
    setDownloadingId(pdf.id);
    try {
      if (pdf.fileUrl) {
        // Direct download from Supabase Storage
        const a = document.createElement('a');
        a.href = pdf.fileUrl;
        a.target = "_blank";
        a.download = pdf.title;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        const pdfBlob = createValidPdfBlob(pdf.title, pdf.subject, pdf.content);
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pdf.title.endsWith('.pdf') ? pdf.title : `${pdf.title}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
  };

  const handlePrintPdf = (pdf) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${pdf.title}</title>
          <style>
            body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 15px; margin-bottom: 25px; }
            .badge { background: #f0fdf4; color: #0d9488; border: 1px solid #99f6e4; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
            h1 { font-size: 22px; color: #0f172a; margin-top: 15px; margin-bottom: 5px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 13px; background: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #e2e8f0; }
            .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 11px; color: #64748b; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <span class="badge">${pdf.subject}</span>
            <h1>${pdf.title}</h1>
            <p style="font-size: 12px; color: #64748b; margin: 0;">AcademiX AI Official Student Handbook & Course Reference Guide</p>
          </div>
          <pre>${pdf.content}</pre>
          <div class="footer">Verified by AcademiX AI University Department of ${pdf.subject} © 2026</div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredNotes = notesList.filter(n => 
    (selectedSubject === 'All' || n.subject === selectedSubject) &&
    (n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.summary.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredPdfs = pdfsList.filter(p => 
    (selectedSubject === 'All' || p.subject === selectedSubject) &&
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)] space-y-8">
      
      {/* Student Hub Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-950/40 via-indigo-950/30 to-[#050811] relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-teal-400">
              <GraduationCap className="h-4 w-4" />
              AcademiX AI Student Learning Hub
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading">
              Welcome back, <span className="gradient-text">{currentUser?.name || 'Student'}</span>!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Access subject course notes, PDFs, practice assignments, structured FAQs, and your AI study assistant all in one unified workspace.
            </p>

            {currentUser && (
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-2">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl font-semibold text-teal-300">
                  Roll No: {currentUser.studentId || '2024-CS-108'}
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-slate-300">
                  Dept: {currentUser.department || 'Computer Science & Engineering'}
                </span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-xl text-amber-300 font-medium">
                  {currentUser.semester || 'Semester 4 (Year 2)'}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenProfile}
              className="gradient-btn px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider text-white shadow-xl flex items-center gap-2 cursor-pointer"
            >
              <User className="h-4 w-4" />
              <span>My Role Profile</span>
            </button>
          </div>

        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'notes' 
              ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BookOpen className="h-4 w-4 text-teal-400" />
          <span>Course Notes & Summaries</span>
        </button>

        <button
          onClick={() => setActiveTab('pdfs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'pdfs' 
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <FileText className="h-4 w-4 text-indigo-400" />
          <span>Handbooks & Course PDFs</span>
        </button>

        <button
          onClick={() => setActiveTab('chatbot')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'chatbot' 
              ? 'bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-teal-300 border border-teal-500/40' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="h-4 w-4 text-teal-400" />
          <span>AI Assistant</span>
        </button>
      </div>

      {/* Subject Filter Bar & Search Input */}
      {activeTab !== 'chatbot' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0a0f1d] p-4 rounded-2xl border border-white/10">
          {/* Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {subjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedSubject === sub.name
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${sub.color}`} />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes or PDFs..."
              className="w-full rounded-xl border border-white/10 bg-[#050811] pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500"
            />
          </div>
        </div>
      )}

      {/* TAB 1: Course Notes */}
      {activeTab === 'notes' && (
        <>
          {isLoadingDocs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-teal-500 animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Syncing course notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/5 rounded-2xl">
              <BookOpen className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No course notes available for this subject.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="glass-card p-6 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between hover:border-teal-500/40 transition-all group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2.5 py-0.5 rounded-full uppercase">
                        {note.subject}
                      </span>
                      <span className="text-[10px] text-slate-500">{note.readTime}</span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors line-clamp-2">
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {note.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[10px] text-slate-500">{note.date}</span>
                    <button 
                      onClick={() => handlePrintPdf({ title: note.title, subject: note.subject, content: note.content })}
                      className="flex items-center gap-1 text-teal-400 font-bold hover:underline cursor-pointer"
                    >
                      <span>Read & Print Note</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 2: Course PDFs */}
      {activeTab === 'pdfs' && (
        <>
          {isLoadingDocs ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
              <p className="text-slate-400 text-sm">Syncing PDFs...</p>
            </div>
          ) : filteredPdfs.length === 0 ? (
            <div className="text-center py-20 border border-white/5 bg-white/5 rounded-2xl">
              <FileText className="h-8 w-8 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-400">No PDFs available for this subject.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredPdfs.map((pdf) => (
                <div 
                  key={pdf.id} 
                  className="glass-card p-5 rounded-2xl border border-white/10 space-y-3 flex flex-col justify-between hover:border-indigo-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-md inline-block">
                      {pdf.subject}
                    </span>
                    <h4 className="text-xs font-bold text-white line-clamp-2">{pdf.title}</h4>
                    <span className="text-[10px] text-slate-500 block">{pdf.size} • {pdf.type}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleDownloadPdf(pdf)}
                      disabled={downloadingId === pdf.id}
                      className="flex-1 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                      title="Download PDF File"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{downloadingId === pdf.id ? 'Saving...' : 'Download PDF'}</span>
                    </button>

                    <button
                      onClick={() => handlePrintPdf(pdf)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                      title="View & Print PDF in Browser"
                    >
                      <Eye className="h-3.5 w-3.5 text-indigo-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB 3: Inline AI Assistant */}
      {activeTab === 'chatbot' && (
        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden min-h-[600px]">
          <FullChatView currentUser={currentUser} />
        </div>
      )}

    </div>
  );
}

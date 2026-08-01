import React, { useState } from 'react';
import { 
  GraduationCap, BookOpen, FileText, HelpCircle, Layers, User, 
  MessageSquare, Search, Sparkles, CheckCircle2, Download, Bookmark, 
  ChevronRight, Award, Compass, Code, Brain, Cpu, Database, Network
} from 'lucide-react';
import FullChatView from './FullChatView';

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

  const notesList = [
    {
      id: 'n1',
      subject: 'Data Structures',
      title: 'Binary Search Trees & AVL Tree Balancing',
      summary: 'Comprehensive notes covering BST insertion, deletion, and AVL single/double rotation algorithms.',
      date: 'Aug 2026',
      readTime: '8 min read'
    },
    {
      id: 'n2',
      subject: 'DBMS',
      title: 'ACID Properties & Transaction Concurrency Control',
      summary: 'Breakdown of Atomicity, Consistency, Isolation, Durability, and 2-Phase Locking (2PL).',
      date: 'Aug 2026',
      readTime: '10 min read'
    },
    {
      id: 'n3',
      subject: 'Operating Systems',
      title: 'CPU Scheduling Algorithms & Deadlock Banker’s Algorithm',
      summary: 'Round Robin, SJF, Priority Scheduling, and Banker’s Algorithm safety state checks.',
      date: 'Jul 2026',
      readTime: '12 min read'
    },
    {
      id: 'n4',
      subject: 'Computer Networks',
      title: 'TCP 3-Way Handshake & Sliding Window Flow Control',
      summary: 'Detailed step-by-step breakdown of SYN, SYN-ACK, ACK and TCP congestion windows.',
      date: 'Jul 2026',
      readTime: '6 min read'
    },
    {
      id: 'n5',
      subject: 'Artificial Intelligence',
      title: 'RAG Architecture: Vector Embeddings & Grounded Prompts',
      summary: 'How cosine similarity vector matching eliminates LLM hallucinations in university systems.',
      date: 'Aug 2026',
      readTime: '15 min read'
    },
    {
      id: 'n6',
      subject: 'Machine Learning',
      title: 'Supervised vs Unsupervised Learning & Neural Backpropagation',
      summary: 'Regression, Classification, K-Means clustering, and Gradient Descent backpropagation.',
      date: 'Aug 2026',
      readTime: '11 min read'
    },
    {
      id: 'n7',
      subject: 'Python',
      title: 'Python List Comprehensions, Generators & Magic Methods',
      summary: 'Memory efficient iteration using yield, magic methods (__init__, __repr__), and Pandas.',
      date: 'Jul 2026',
      readTime: '7 min read'
    },
    {
      id: 'n8',
      subject: 'Java',
      title: 'JVM Memory Architecture & Multithreading Executor Pools',
      summary: 'Heap vs Stack memory, Garbage Collection algorithms, and Thread synchronization.',
      date: 'Aug 2026',
      readTime: '9 min read'
    }
  ];

  const pdfsList = [
    { 
      id: 'p1', 
      subject: 'Data Structures', 
      title: 'DS_Complete_Lab_Manual_2026.pdf', 
      size: '3.4 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - DATA STRUCTURES & ALGORITHMS COMPLETE LAB MANUAL (2026)
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. LINEAR DATA STRUCTURES
--------------------------------------------------------------------------------
- Arrays: Fixed contiguous memory layout. Constant time O(1) random access by index.
- Linked Lists: Nodes containing data and pointers.
  - Singly Linked List: head -> node1 -> node2 -> null
  - Doubly Linked List: prev <-> node1 <-> node2 <-> next
- Stacks (LIFO): Last-In First-Out. Push O(1), Pop O(1), Peek O(1).
- Queues (FIFO): First-In First-Out. Enqueue O(1), Dequeue O(1).

2. TREES & BALANCED BSTs
--------------------------------------------------------------------------------
- Binary Search Tree (BST): Left child < Root < Right child.
  - Search Time: Average O(log N), Worst-case O(N) when unbalanced.
- AVL Tree: Self-balancing BST where height difference (Balance Factor = Height(Left) - Height(Right)) is -1, 0, or +1.
  - Rotations: Left Rotation (LL), Right Rotation (RR), Left-Right (LR), Right-Left (RL).

3. GRAPH ALGORITHMS
--------------------------------------------------------------------------------
- Breadth-First Search (BFS): Level-order traversal using Queue data structure. O(V + E) time.
- Depth-First Search (DFS): Backtracking traversal using Stack / Recursion. O(V + E) time.
- Dijkstra's Algorithm: Single-source shortest path using Min-Priority Queue (Heap). O((V + E) log V) time.
- Prim's & Kruskal's MST: Minimum Spanning Tree for weighted connected undirected graphs.

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    },
    { 
      id: 'p2', 
      subject: 'DBMS', 
      title: 'DBMS_SQL_Query_Reference_Guide.pdf', 
      size: '2.1 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - DATABASE MANAGEMENT SYSTEMS (DBMS) REFERENCE GUIDE
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. RELATIONAL DATABASE & SQL SYNTAX
--------------------------------------------------------------------------------
- Data Definition Language (DDL): CREATE TABLE, ALTER TABLE, DROP TABLE, TRUNCATE.
- Data Manipulation Language (DML): SELECT, INSERT INTO, UPDATE, DELETE.
- Joins:
  - INNER JOIN: Returns matching rows in both tables.
  - LEFT JOIN: Returns all rows from left table and matching rows from right table.
  - RIGHT JOIN: Returns all rows from right table and matching rows from left table.

2. NORMALIZATION FORMULAS (1NF to BCNF)
--------------------------------------------------------------------------------
- 1NF (First Normal Form): All table attributes must contain atomic (indivisible) values.
- 2NF (Second Normal Form): Table is in 1NF and no non-prime attribute is partially dependent on any candidate key.
- 3NF (Third Normal Form): Table is in 2NF and no non-prime attribute is transitively dependent on any candidate key.
- BCNF (Boyce-Codd Normal Form): For every functional dependency X -> Y, X must be a super key.

3. TRANSACTION MANAGEMENT & ACID PROPERTIES
--------------------------------------------------------------------------------
- Atomicity: All operations in a transaction complete successfully, or all rollback.
- Consistency: Data must satisfy all integrity constraints before and after transaction execution.
- Isolation: Concurrent transactions execute independently without mutual interference.
- Durability: Committed transaction modifications persist permanently in storage even after system failure.

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    },
    { 
      id: 'p3', 
      subject: 'Operating Systems', 
      title: 'OS_Kernel_Architecture_Notes.pdf', 
      size: '4.8 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - OPERATING SYSTEMS KERNEL ARCHITECTURE NOTES
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. PROCESS SCHEDULING ALGORITHMS
--------------------------------------------------------------------------------
- Process Control Block (PCB): Stores PID, Program Counter, CPU registers, memory limits, open file descriptors.
- CPU Scheduling Metrics: Throughput, Turnaround Time = Exit Time - Arrival Time, Waiting Time = Turnaround Time - Burst Time.
- Algorithms:
  - First-Come First-Served (FCFS): Non-preemptive, suffers from Convoy Effect.
  - Shortest Job First (SJF): Optimal average waiting time.
  - Round Robin (RR): Preemptive scheduling with fixed Time Quantum.

2. DEADLOCK HANDLING & BANKER'S ALGORITHM
--------------------------------------------------------------------------------
- Four Necessary Conditions for Deadlock:
  1. Mutual Exclusion
  2. Hold and Wait
  3. No Preemption
  4. Circular Wait
- Banker's Algorithm (Deadlock Avoidance):
  - Need[i][j] = Max[i][j] - Allocation[i][j]
  - Checks if Work >= Need[i] to find a Safe Execution Sequence.

3. MEMORY MANAGEMENT & VIRTUAL MEMORY
--------------------------------------------------------------------------------
- Paging: Physical memory divided into Frames, logical memory divided into Pages.
- Page Replacement Algorithms: FIFO, LRU (Least Recently Used), Optimal Page Replacement.

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    },
    { 
      id: 'p4', 
      subject: 'Computer Networks', 
      title: 'CN_Protocol_Cheatsheet.pdf', 
      size: '1.9 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - COMPUTER NETWORKS PROTOCOL CHEATSHEET
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. OSI & TCP/IP LAYERED MODEL
--------------------------------------------------------------------------------
- Layer 7: Application (HTTP, HTTPS, DNS, FTP, SMTP)
- Layer 4: Transport (TCP, UDP) - Port Numbers (HTTP: 80, HTTPS: 443, DNS: 53)
- Layer 3: Network (IP, ICMP, ARP, OSPF, BGP) - IP Addresses & Routers
- Layer 2: Data Link (Ethernet, MAC Addressing, Switches)

2. TCP 3-WAY HANDSHAKE & RELIABILITY
--------------------------------------------------------------------------------
- Step 1: Client -> Server [SYN, Seq = x]
- Step 2: Server -> Client [SYN-ACK, Seq = y, Ack = x + 1]
- Step 3: Client -> Server [ACK, Seq = x + 1, Ack = y + 1]
- Flow Control: Sliding Window protocol prevents sender from overwhelming receiver buffer.

3. IP ADDRESSING & SUBNETTING
--------------------------------------------------------------------------------
- IPv4 Address: 32-bit address divided into 4 octets (e.g. 192.168.1.1).
- CIDR Subnet Masking: /24 = 255.255.255.0 (254 usable host IP addresses).

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    },
    { 
      id: 'p5', 
      subject: 'Artificial Intelligence', 
      title: 'AI_Vector_RAG_Handbook.pdf', 
      size: '5.2 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - ARTIFICIAL INTELLIGENCE & RAG ARCHITECTURE HANDBOOK
================================================================================
Department of Computer Science & AI | AcademiX AI University

1. RETRIEVAL-AUGMENTED GENERATION (RAG) ARCHITECTURE
--------------------------------------------------------------------------------
- Vector Embeddings: Text passages converted into 384-dimensional dense semantic vectors using sentence transformers.
- Cosine Similarity:
  Cosine Similarity(A, B) = (A . B) / (||A|| * ||B||)
  Measures semantic angle between query vector and candidate document chunk vectors.
- Grounding & Anti-Hallucination: System injects retrieved text chunks as context into LLM prompt, enforcing answers grounded exclusively in verified facts.

2. SEARCH ALGORITHMS & HEURISTICS
--------------------------------------------------------------------------------
- A* Search Algorithm: f(n) = g(n) + h(n)
  - g(n): Exact cost to reach node n from start node.
  - h(n): Admissible heuristic estimated cost to reach goal node.

================================================================================
End of Document | Verified by AcademiX AI Department of Artificial Intelligence
================================================================================`
    },
    { 
      id: 'p6', 
      subject: 'Machine Learning', 
      title: 'ML_Math_Foundations.pdf', 
      size: '3.7 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - MACHINE LEARNING MATH & ALGORITHMIC FOUNDATIONS
================================================================================
Department of Computer Science & AI | AcademiX AI University

1. SUPERVISED LEARNING ALGORITHMS
--------------------------------------------------------------------------------
- Linear Regression: Cost Function J(w, b) = (1/2m) * sum((h(x) - y)^2)
- Logistic Regression: Sigmoid activation function g(z) = 1 / (1 + e^(-z))
- Decision Trees: Information Gain = Entropy(Parent) - Weighted Avg Entropy(Children)

2. NEURAL NETWORKS & BACKPROPAGATION
--------------------------------------------------------------------------------
- Forward Pass: Layer activations computed using Weights, Biases, and Activation functions (ReLU: max(0, z)).
- Backward Pass (Backpropagation): Chain Rule of calculus used to compute partial derivatives dJ/dW to update weights via Gradient Descent.

================================================================================
End of Document | Verified by AcademiX AI Department of Artificial Intelligence
================================================================================`
    },
    { 
      id: 'p7', 
      subject: 'Python', 
      title: 'Python_DataScience_Cheatsheet.pdf', 
      size: '2.5 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - PYTHON PROGRAMMING & DATA SCIENCE CHEATSHEET
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. CORE PYTHON SYNTAX & EFFICIENCY
--------------------------------------------------------------------------------
- List Comprehension: squares = [x**2 for x in range(10) if x % 2 == 0]
- Generators (Memory Efficient Iteration):
  def count_up():
      yield 1
      yield 2
- Dictionary Comprehension: word_lengths = {word: len(word) for word in text.split()}

2. PANDAS & NUMPY FOR DATA ANALYSIS
--------------------------------------------------------------------------------
- NumPy Vectorization: arr * 2 performs C-speed elementwise multiplication.
- Pandas DataFrames: df.groupby('Category').agg({'Sales': 'sum', 'Rating': 'mean'})

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    },
    { 
      id: 'p8', 
      subject: 'Java', 
      title: 'Java_OOP_Concurrency_Guide.pdf', 
      size: '3.1 MB', 
      type: 'PDF Document',
      content: `================================================================================
ACADEMIX AI - JAVA OBJECT-ORIENTED PROGRAMMING & CONCURRENCY GUIDE
================================================================================
Department of Computer Science & Engineering | AcademiX AI University

1. JAVA OOP PILLARS & JVM MEMORY
--------------------------------------------------------------------------------
- Encapsulation: Hiding internal object state behind private fields and public getters/setters.
- Inheritance: Subclasses extending superclass fields using 'extends'.
- Polymorphism: Method Overloading (compile-time) & Method Overriding (runtime).
- JVM Memory: Heap (Object instances & Garbage Collector) vs Stack (Primitive variables & Method frames).

2. MULTITHREADING & CONCURRENCY
--------------------------------------------------------------------------------
- Thread Creation: Extending Thread class or implementing Runnable interface.
- Synchronization: synchronized block/method enforces mutual exclusion.
- ExecutorService: Thread pools managing task queues cleanly.

================================================================================
End of Document | Verified by AcademiX AI Department of Computer Science
================================================================================`
    }
  ];

  const handleDownloadPdf = (pdf) => {
    setDownloadingId(pdf.id);
    try {
      const textContent = pdf.content || `================================================================================\nACADEMIX AI COURSE REFERENCE DOCUMENT\nTitle: ${pdf.title}\nSubject: ${pdf.subject}\n================================================================================\n\nOfficial Course Content & Syllabus Reference Document for AcademiX AI Students.\n\nVerified by AcademiX AI Academic Department.`;
      
      const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = pdf.title;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setTimeout(() => setDownloadingId(null), 1000);
    }
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
                  onClick={() => alert(`Opening ${note.title}`)}
                  className="flex items-center gap-1 text-teal-400 font-bold hover:underline cursor-pointer"
                >
                  <span>Read Note</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Course PDFs */}
      {activeTab === 'pdfs' && (
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

              <button
                onClick={() => handleDownloadPdf(pdf)}
                disabled={downloadingId === pdf.id}
                className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-indigo-300 border border-white/10 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{downloadingId === pdf.id ? 'Downloading...' : 'Download PDF'}</span>
              </button>
            </div>
          ))}
        </div>
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

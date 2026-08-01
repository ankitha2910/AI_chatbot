export const INITIAL_DOCUMENTS = [
  {
    id: "doc-student-handbook-2026",
    title: "AcademiX AI University - Academic & Student Conduct Handbook (2025-2026)",
    category: "Academic Policy",
    uploadedAt: "2026-01-15T08:30:00.000Z",
    content: `
AcademiX AI University Academic Regulations & Student Guidelines (2025-2026 Academic Year)

1. Attendance Policy & Mandatory Requirements:
Students must maintain a minimum of 75% attendance in each registered course to be eligible to sit for end-semester examinations. Medical leave requests up to 10% can be sanctioned by the Head of Department (HOD) upon submission of an authentic medical certificate within 5 working days of resumption. Students with attendance between 65% and 74% due to medical reasons will be required to submit makeup assignments. Attendance below 65% results in automatic course detention (Grade 'F-DET').

2. Grading System & Cumulative Grade Point Average (CGPA):
AcademiX University uses a 10-point relative grading scale:
- S Grade (90-100%): 10 Grade Points - Outstanding
- A Grade (80-89%): 9 Grade Points - Excellent
- B Grade (70-79%): 8 Grade Points - Very Good
- C Grade (60-69%): 7 Grade Points - Good
- D Grade (50-59%): 6 Grade Points - Average
- E Grade (40-49%): 5 Grade Points - Pass
- F Grade (<40%): 0 Grade Points - Fail (Requires Re-registration)

To earn an Honors Degree, students must maintain a minimum CGPA of 8.5 without any active backlogs and complete 18 additional credits of specialized electives or research projects.

3. Academic Integrity & Artificial Intelligence (AI) Policy:
AcademiX University encourages the ethical use of AI tools (like ChatGPT, GitHub Copilot, AcademiX AI) for research, brainstorming, and code comprehension. However, direct copying or submitting uncredited AI-generated output as original coursework is strictly prohibited. All assignment submissions are screened via Similarity Check tools. Submissions exceeding 15% uncredited similarity will receive zero marks and face disciplinary review.
    `
  },
  {
    id: "doc-placement-guidelines-2026",
    title: "AcademiX University - Campus Placement & Internship Portal Manual",
    category: "Career & Placements",
    uploadedAt: "2026-02-01T10:00:00.000Z",
    content: `
AcademiX Career Development Cell (CDC) - Campus Placement & Summer Internship Regulations

1. Placement Eligibility Criteria:
- All 7th and 8th-semester B.Tech/B.S. and final year M.Tech/M.S. students are eligible to register for placement drives.
- Minimum CGPA Requirement: Overall CGPA of 6.5 or above across all completed semesters.
- Active Backlog Constraint: Maximum 1 standing backlog allowed at the time of company registration. However, specific tier-1 companies (Tier 1 Package >= $120,000/yr or ₹15 LPA) enforce a strict 'Zero Standing Backlog' policy.

2. Placement Tiers & Dream Offer Policy:
- Tier 3 Companies (Base package up to $60,000 / ₹6 LPA)
- Tier 2 Companies (Base package between $60,000 - $100,000 / ₹6 - 10 LPA)
- Tier 1 Super Dream Companies (Package above $100,000 / ₹10 LPA)

Once a student receives a job offer in Tier 3 or Tier 2, they are allowed a maximum of 2 additional 'Dream Offer' attempts for Tier 1 companies. Upon securing a Tier 1 offer, the student is marked as 'Placed' and exits the campus drive.
    `
  },
  {
    id: "doc-ds-course",
    title: "Data Structures & Algorithms - Core Course Guide",
    category: "Data Structures",
    uploadedAt: "2026-02-10T09:00:00.000Z",
    content: `
Data Structures & Algorithms (DS101) Syllabus & Concept Breakdown:

1. Arrays, Linked Lists & Stacks:
- Linear Data Structures, Memory layout, Singly/Doubly Linked Lists.
- Stacks: LIFO principle, Operations (Push, Pop, Peek), Expression Evaluation (Infix to Postfix), Function call stack.
- Queues: FIFO principle, Circular Queue, Priority Queue using Heaps.

2. Trees & Graphs:
- Binary Search Trees (BST): Insertion, Deletion, In-order/Pre-order/Post-order Traversals. Time Complexity: O(log N) average.
- AVL Trees & Red-Black Trees: Self-balancing BSTs guaranteeing O(log N) height.
- Graphs: Adjacency Matrix vs Adjacency List representations.
- Graph Algorithms: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path, Prim's and Kruskal's Minimum Spanning Tree (MST).

3. Sorting & Dynamic Programming:
- QuickSort & MergeSort: Divide and conquer algorithm, MergeSort time complexity O(N log N) worst-case.
- Dynamic Programming: Overlapping subproblems and optimal substructure. Knapsack 0/1, Longest Common Subsequence (LCS).
    `
  },
  {
    id: "doc-dbms-course",
    title: "Database Management Systems (DBMS) - Course Guide",
    category: "DBMS",
    uploadedAt: "2026-02-12T11:00:00.000Z",
    content: `
Database Management Systems (DBMS201) Core Concepts:

1. Relational Model & SQL:
- Relational Schema, Tables, Primary Keys, Foreign Keys, Candidate Keys, Integrity Constraints.
- SQL DDL, DML, DCL commands. INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN. Group By & Having clauses.

2. Normalization:
- 1NF (Atomic values), 2NF (No partial functional dependency), 3NF (No transitive functional dependency), BCNF (Boyce-Codd Normal Form).

3. Transaction Management & ACID Properties:
- Atomicity: All or nothing execution (Rollback/Commit).
- Consistency: Database moves from one valid state to another.
- Isolation: Concurrent transactions do not interfere (Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Serializable).
- Durability: Committed data persists even after system crash (Write-Ahead Logging / WAL).
    `
  },
  {
    id: "doc-os-course",
    title: "Operating Systems - Core Concepts & Architecture",
    category: "Operating Systems",
    uploadedAt: "2026-02-15T10:30:00.000Z",
    content: `
Operating Systems (OS301) Syllabus:

1. Process Management & CPU Scheduling:
- Process Control Block (PCB), Process States (New, Ready, Running, Waiting, Terminated).
- CPU Scheduling Algorithms: First-Come First-Served (FCFS), Shortest Job First (SJF), Round Robin (RR) with time quantum, Priority Scheduling.

2. Process Synchronization & Deadlocks:
- Critical Section Problem, Peterson's Solution, Semaphores (Mutex, Counting Semaphore), Producer-Consumer Problem.
- Deadlock Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait.
- Deadlock Prevention, Avoidance (Banker's Algorithm), Detection and Recovery.

3. Memory Management & Paging:
- Virtual Memory, Paging, Page Tables, Translation Lookaside Buffer (TLB).
- Page Replacement Algorithms: FIFO, LRU (Least Recently Used), Optimal Page Replacement. Thrashing.
    `
  },
  {
    id: "doc-cn-course",
    title: "Computer Networks & Protocols - Course Handbook",
    category: "Computer Networks",
    uploadedAt: "2026-02-18T14:00:00.000Z",
    content: `
Computer Networks (CN302) Core Protocol Architecture:

1. OSI & TCP/IP Reference Models:
- Physical, Data Link, Network, Transport, Session, Presentation, Application layers.
- Data Link Layer: Framing, Error Detection (CRC), MAC Addresses, Ethernet.

2. Network Layer & IP Addressing:
- IPv4 & IPv6 Addressing, Subnetting (CIDR masks), NAT, Router Forwarding tables.
- Routing Protocols: OSPF (Link State), RIP (Distance Vector), BGP (Path Vector).

3. Transport Layer & Protocols:
- TCP (Transmission Control Protocol): Connection-oriented, Reliable, 3-Way Handshake (SYN, SYN-ACK, ACK), Flow Control (Sliding Window), Congestion Control.
- UDP (User Datagram Protocol): Connectionless, Unreliable, Low latency streaming.
    `
  },
  {
    id: "doc-ai-course",
    title: "Artificial Intelligence & RAG Architecture Handbook",
    category: "Artificial Intelligence",
    uploadedAt: "2026-02-22T16:00:00.000Z",
    content: `
Artificial Intelligence & RAG Systems (AI401):

1. Search & Heuristics:
- Uninformed Search: BFS, DFS, Uniform Cost Search.
- Informed Search: A* Search (f(n) = g(n) + h(n)), Minimax with Alpha-Beta Pruning.

2. Retrieval-Augmented Generation (RAG):
- Dense Semantic Vector Embeddings (384-dim, 1536-dim), Cosine Similarity, HNSW/IVFFlat Indexing.
- Context Ingestion & Overlapping Chunking strategies.
- Grounding & Anti-Hallucination: Prompts constraining response generation strictly to retrieved context chunks.
    `
  },
  {
    id: "doc-ml-course",
    title: "Machine Learning & Statistical Learning Guide",
    category: "Machine Learning",
    uploadedAt: "2026-02-25T13:20:00.000Z",
    content: `
Machine Learning Foundations (ML402):

1. Supervised Learning:
- Linear Regression, Logistic Regression (Sigmoid function).
- Decision Trees, Random Forests, Gradient Boosted Trees (XGBoost).
- Support Vector Machines (SVM) & Kernel trick.

2. Unsupervised Learning & Neural Networks:
- K-Means Clustering, Hierarchical Clustering, Principal Component Analysis (PCA) for dimensionality reduction.
- Artificial Neural Networks (ANN): Backpropagation, Activation functions (ReLU, Sigmoid, Softmax), Overfitting prevention (Dropout, L2 Regularization).
    `
  },
  {
    id: "doc-python-course",
    title: "Python Programming & Data Science Masterclass",
    category: "Python",
    uploadedAt: "2026-02-27T08:00:00.000Z",
    content: `
Python Programming (PY101) Core Concepts:

1. Core Syntax & Data Types:
- Immutable types (int, float, str, tuple) vs Mutable types (list, dict, set).
- List Comprehensions: [x**2 for x in range(10) if x % 2 == 0].
- Generators & Iterators (yield keyword).

2. Object-Oriented Python & Libraries:
- Classes, Inheritance, Polymorphism, Encapsulation, Magic Methods (__init__, __str__, __repr__).
- Key Libraries: NumPy (Ndarray operations), Pandas (DataFrame Data Cleaning), Scikit-Learn (ML Models).
    `
  },
  {
    id: "doc-java-course",
    title: "Java Programming & Object-Oriented Software Design",
    category: "Java",
    uploadedAt: "2026-03-01T10:00:00.000Z",
    content: `
Java Programming (JAVA101) Core Architecture:

1. JVM Architecture & OOP Principles:
- JDK, JRE, JVM execution pipeline, Just-In-Time (JIT) compiler.
- Four OOP Pillars: Encapsulation (private/getter/setter), Abstraction (interfaces/abstract classes), Inheritance (extends keyword), Polymorphism (Overloading & Overriding).

2. Collections Framework & Multithreading:
- Collection hierarchy: List (ArrayList, LinkedList), Set (HashSet, TreeSet), Map (HashMap, ConcurrentHashMap).
- Multithreading: Runnable interface, Thread class, Synchronization, ExecutorService thread pools.
    `
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "What is the minimum attendance required to appear for exams at AcademiX AI University?",
    answer: "Students must maintain a minimum of 75% attendance in each course. Medical leave up to 10% can be sanctioned by the HOD with a valid medical certificate submitted within 5 working days.",
    category: "Academic Policy"
  },
  {
    id: "faq-2",
    question: "What is the time complexity of binary search vs linear search?",
    answer: "Binary Search operates in O(log N) time complexity on sorted arrays, whereas Linear Search requires O(N) time complexity.",
    category: "Data Structures"
  },
  {
    id: "faq-3",
    question: "What are the ACID properties in Database Management Systems (DBMS)?",
    answer: "ACID stands for Atomicity (all or nothing), Consistency (valid state transitions), Isolation (independent concurrent execution), and Durability (permanent persistence of committed data).",
    category: "DBMS"
  },
  {
    id: "faq-4",
    question: "What is the difference between a process and a thread in Operating Systems?",
    answer: "A process is an independent executing program with its own memory space, whereas a thread is a lightweight execution unit inside a process that shares memory with sibling threads.",
    category: "Operating Systems"
  },
  {
    id: "faq-5",
    question: "What is the 3-Way Handshake in TCP networking?",
    answer: "The TCP 3-Way Handshake establishes a reliable connection using three packets: SYN (from client), SYN-ACK (from server), and ACK (from client).",
    category: "Computer Networks"
  },
  {
    id: "faq-6",
    question: "How does Retrieval-Augmented Generation (RAG) prevent AI hallucinations?",
    answer: "RAG retrieves verified source text chunks from a vector database matching the user query, and instructs the LLM to synthesize an answer strictly using the retrieved context.",
    category: "Artificial Intelligence"
  },
  {
    id: "faq-7",
    question: "What is the difference between supervised and unsupervised machine learning?",
    answer: "Supervised learning trains models using labeled data with target outputs (e.g. classification/regression), whereas unsupervised learning finds hidden patterns in unlabeled data (e.g. clustering).",
    category: "Machine Learning"
  },
  {
    id: "faq-8",
    question: "What is the difference between lists and tuples in Python?",
    answer: "Lists are mutable sequences declared with brackets [], allowing modification. Tuples are immutable sequences declared with parentheses (), preserving fixed data.",
    category: "Python"
  },
  {
    id: "faq-9",
    question: "What is the JVM and how does it execute Java bytecode?",
    answer: "The Java Virtual Machine (JVM) compiles Java source code into bytecode (.class files) and executes it using JIT compilation, rendering Java platform-independent.",
    category: "Java"
  }
];

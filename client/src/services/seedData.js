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
- Active Backlog Constraint: Maximum 1 standing backlog allowed at the time of company registration. However, specific tier-1 companies enforce zero standing backlogs.
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
- Stacks: LIFO principle, Operations (Push, Pop, Peek), Expression Evaluation.
- Queues: FIFO principle, Circular Queue, Priority Queue using Heaps.

2. Trees & Graphs:
- Binary Search Trees (BST): Insertion, Deletion, In-order/Pre-order/Post-order Traversals. Time Complexity: O(log N) average.
- AVL Trees: Self-balancing BST guaranteeing O(log N) height via rotations.
- Graph Algorithms: Breadth-First Search (BFS), Depth-First Search (DFS), Dijkstra's Shortest Path, Prim's and Kruskal's Minimum Spanning Tree (MST).
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
- Relational Schema, Tables, Primary Keys, Foreign Keys, Candidate Keys.
- SQL Commands: SELECT, INNER JOIN, LEFT JOIN, RIGHT JOIN, GROUP BY, HAVING.

2. Normalization & ACID Properties:
- 1NF, 2NF, 3NF, BCNF Normal Forms.
- ACID Properties: Atomicity, Consistency, Isolation, Durability.
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
- PCB, Process States, FCFS, SJF, Round Robin scheduling.

2. Process Synchronization & Deadlocks:
- Semaphores, Critical Section, Deadlock conditions, Banker's Algorithm.

3. Virtual Memory & Paging:
- Page Tables, TLB, Page replacement (LRU, FIFO).
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
- Application, Transport (TCP/UDP), Network (IP/Routing), Data Link layers.

2. TCP 3-Way Handshake:
- Connection establishment: SYN -> SYN-ACK -> ACK. Sliding Window flow control.
    `
  },
  {
    id: "doc-ai-course",
    title: "Artificial Intelligence & RAG Architecture Handbook",
    category: "Artificial Intelligence",
    uploadedAt: "2026-02-22T16:00:00.000Z",
    content: `
Artificial Intelligence & RAG Systems (AI401):

1. Retrieval-Augmented Generation (RAG):
- Dense Vector Embeddings (384-dim), Cosine Similarity, HNSW Indexing.
- Context Grounding & Anti-Hallucination strategies.
    `
  },
  {
    id: "doc-ml-course",
    title: "Machine Learning & Statistical Learning Guide",
    category: "Machine Learning",
    uploadedAt: "2026-02-25T13:20:00.000Z",
    content: `
Machine Learning Foundations (ML402):

1. Supervised & Unsupervised Learning:
- Linear Regression, Logistic Regression, Decision Trees, Random Forests, K-Means Clustering.
- Neural Networks: Forward pass activations (ReLU, Sigmoid) and Backpropagation via Gradient Descent.
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
- List Comprehensions, Generators (yield keyword), Magic Methods (__init__, __repr__).
- Pandas & NumPy for data processing.
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
- Four OOP Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism.
- Multithreading: Thread synchronization and ExecutorService pools.
    `
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "What is the minimum attendance required to appear for exams at AcademiX AI University?",
    answer: "Students must maintain a minimum of 75% attendance in each course.",
    category: "Academic Policy"
  },
  {
    id: "faq-2",
    question: "What is the time complexity of binary search vs linear search?",
    answer: "Binary Search operates in O(log N) time complexity on sorted arrays, whereas Linear Search requires O(N) time complexity.",
    category: "Data Structures"
  }
];

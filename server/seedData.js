export const INITIAL_DOCUMENTS = [
  {
    id: "doc-student-handbook-2026",
    title: "EduAssist University - Academic & Student Conduct Handbook (2025-2026)",
    category: "Academic Policy",
    uploadedAt: "2026-01-15T08:30:00.000Z",
    content: `
EduAssist University Academic Regulations & Student Guidelines (2025-2026 Academic Year)

1. Attendance Policy & Mandatory Requirements:
Students must maintain a minimum of 75% attendance in each registered course to be eligible to sit for end-semester examinations. Medical leave requests up to 10% can be sanctioned by the Head of Department (HOD) upon submission of an authentic medical certificate within 5 working days of resumption. Students with attendance between 65% and 74% due to medical reasons will be required to submit makeup assignments. Attendance below 65% results in automatic course detention (Grade 'F-DET').

2. Grading System & Cumulative Grade Point Average (CGPA):
EduAssist University uses a 10-point relative grading scale:
- S Grade (90-100%): 10 Grade Points - Outstanding
- A Grade (80-89%): 9 Grade Points - Excellent
- B Grade (70-79%): 8 Grade Points - Very Good
- C Grade (60-69%): 7 Grade Points - Good
- D Grade (50-59%): 6 Grade Points - Average
- E Grade (40-49%): 5 Grade Points - Pass
- F Grade (<40%): 0 Grade Points - Fail (Requires Re-registration)

To earn an Honors Degree, students must maintain a minimum CGPA of 8.5 without any active backlogs and complete 18 additional credits of specialized electives or research projects.

3. Academic Integrity & Artificial Intelligence (AI) Policy:
EduAssist University encourages the ethical use of AI tools (like ChatGPT, GitHub Copilot, EduAssist AI) for research, brainstorming, and code comprehension. However, direct copying or submitting uncredited AI-generated output as original coursework is strictly prohibited. All assignment submissions are screened via Similarity Check tools. Submissions exceeding 15% uncredited similarity will receive zero marks and face disciplinary review.

4. Leave & Re-evaluation Applications:
Students can apply for semester leave, re-evaluation of answer scripts, or grade improvement through the EduAssist Student Portal within 7 days of result declaration. Re-evaluation fee is $25 per course module, refundable if the grade improves by one full letter grade.
    `
  },
  {
    id: "doc-placement-guidelines-2026",
    title: "EduAssist University - Campus Placement & Internship Portal Manual",
    category: "Career & Placements",
    uploadedAt: "2026-02-01T10:00:00.000Z",
    content: `
EduAssist Career Development Cell (CDC) - Campus Placement & Summer Internship Regulations

1. Placement Eligibility Criteria:
- All 7th and 8th-semester B.Tech/B.S. and final year M.Tech/M.S. students are eligible to register for placement drives.
- Minimum CGPA Requirement: Overall CGPA of 6.5 or above across all completed semesters.
- Active Backlog Constraint: Maximum 1 standing backlog allowed at the time of company registration. However, specific tier-1 companies (Tier 1 Package >= $120,000/yr or ₹15 LPA) enforce a strict 'Zero Standing Backlog' policy.

2. Placement Tiers & Dream Offer Policy:
- Tier 3 Companies (Base package up to $60,000 / ₹6 LPA)
- Tier 2 Companies (Base package between $60,000 - $100,000 / ₹6 - 10 LPA)
- Tier 1 Super Dream Companies (Package above $100,000 / ₹10 LPA)

Once a student receives a job offer in Tier 3 or Tier 2, they are allowed a maximum of 2 additional 'Dream Offer' attempts for Tier 1 companies. Upon securing a Tier 1 offer, the student is marked as 'Placed' and exits the campus drive.

3. Internship & Pre-Placement Offers (PPOs):
Summer internships run for 8 to 12 weeks during the May-July break. If a company grants a Pre-Placement Offer (PPO) following the internship, the student must accept or decline within 10 calendar days. Accepting a PPO automatically revokes eligibility for campus placement drives unless the offer is under Tier 3 and the student applies for Tier 1 upgrade.
    `
  },
  {
    id: "doc-cs-curriculum-2026",
    title: "Department of Computer Science & AI - Course Syllabus & Electives",
    category: "Syllabus & Courses",
    uploadedAt: "2026-02-20T14:15:00.000Z",
    content: `
Department of Computer Science & Artificial Intelligence - Course Guide

Core Courses (Semesters 1 - 4):
- CS101: Data Structures & Algorithms in C++/Python (4 Credits)
- CS202: Database Management Systems & SQL/NoSQL (4 Credits)
- CS301: Computer Networks & Distributed Systems (3 Credits)
- CS305: Operating Systems & Kernel Architecture (4 Credits)
- AI310: Applied Machine Learning & Statistical Inference (4 Credits)

Advanced AI & RAG Track (Semesters 5 - 8):
- AI420: Large Language Models & Retrieval-Augmented Generation (4 Credits)
  Topics covered: Vector databases (Pinecone, Qdrant, ChromaDB), embedding models (Hugging Face sentence-transformers, OpenAI text-embedding-3), prompt engineering, LangChain, LlamaIndex, context-aware memory architecture, hallucination minimization strategies.
- AI425: Computer Vision & Generative Diffusion Models (3 Credits)
- CS450: Capstone Industry Project (6 Credits) - Mandatory 16-week project culminating in full-stack AI deployment, public GitHub repository, and live demo.
    `
  },
  {
    id: "doc-fees-scholarships-2026",
    title: "Tuition Fees, Hostel Maintenance, and Merit Scholarship Policy",
    category: "Financial & Scholarships",
    uploadedAt: "2026-03-05T09:45:00.000Z",
    content: `
EduAssist Financial Services & Scholarship Desk

1. Tuition Fee Structure:
- B.Tech/B.S. Programs: $4,500 per semester (Tuition: $3,800, Tech & Lab Fee: $500, Student Activities: $200).
- M.Tech/M.S. Programs: $5,200 per semester.
- Late Fee Penalty: A fee of $15 per day applies for payments delayed beyond the semester fee deadline (typically August 15 for Fall, January 15 for Spring).

2. Merit Scholarships & Financial Aid:
- Chancellor’s Excellence Scholarship: 100% tuition waiver for students securing a CGPA of 9.8 or higher in the previous academic year.
- Dean's List Merit Scholarship: 50% tuition waiver for students holding CGPA >= 9.2.
- Need-Based Aid: Financial assistance up to 30% available for students with annual household income below $25,000, requiring income tax validation documents submitted before semester start.

3. Refund Policy:
If a student withdraws from a program:
- 100% refund (minus $50 processing fee) if requested 15 days prior to class commencement.
- 75% refund if requested within 15 days after classes begin.
- No tuition refund after 30 calendar days from the start of the semester.
    `
  }
];

export const INITIAL_FAQS = [
  {
    id: "faq-1",
    question: "What is the minimum attendance required to appear for exams at EduAssist University?",
    answer: "Students must maintain a minimum of 75% attendance in each course. Medical leave up to 10% can be sanctioned by the HOD with a valid medical certificate submitted within 5 working days.",
    category: "Academic Policy"
  },
  {
    id: "faq-2",
    question: "What are the eligibility rules for campus placement drives?",
    answer: "Students in 7th/8th semester with a CGPA of 6.5+ and no more than 1 active backlog can participate in campus placements. Tier 1 companies require 0 standing backlogs.",
    category: "Career & Placements"
  },
  {
    id: "faq-3",
    question: "How does EduAssist handle AI tool usage in assignments?",
    answer: "AI tools are permitted for research and coding assistance. Direct uncredited copying is strictly prohibited. Submissions with over 15% similarity receive zero marks.",
    category: "Academic Policy"
  },
  {
    id: "faq-4",
    question: "How can I apply for the Dean's List Merit Scholarship?",
    answer: "Students maintaining a CGPA of 9.2 or higher automatically qualify for a 50% tuition fee waiver under the Dean's List Merit Scholarship, evaluated at the end of each academic year.",
    category: "Financial & Scholarships"
  }
];

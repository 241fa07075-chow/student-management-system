export const studentAssignmentsList = [
  {
    id: "ASN-101",
    title: "Relational Schema Normalization & BCNF Proofs",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    dueDate: "28 September 2026",
    status: "Pending", // Pending, Submitted, Graded
    priority: "High",
    totalMarks: 20,
    obtainedMarks: null,
    instructor: "Dr. Priya Iyer",
    description: "Convert the university course registry ER diagram into 3NF and BCNF tables. Identify functional dependencies and lossless join decompositions.",
    attachments: "ER_Schema_Problem_Statement.pdf"
  },
  {
    id: "ASN-102",
    title: "Spring Boot Microservice REST API with PostgreSQL",
    subject: "Java Programming",
    subjectCode: "CS502",
    dueDate: "02 October 2026",
    status: "Pending",
    priority: "Medium",
    totalMarks: 25,
    obtainedMarks: null,
    instructor: "Prof. Sandeep Kulkarni",
    description: "Build an authenticated JWT student enrollment microservice with CRUD operations and unit test coverage above 80%.",
    attachments: "API_Contract_Spec.json"
  },
  {
    id: "ASN-103",
    title: "TCP vs UDP Socket Client-Server Implementation",
    subject: "Computer Networks",
    subjectCode: "CS505",
    dueDate: "05 October 2026",
    status: "Pending",
    priority: "Low",
    totalMarks: 20,
    obtainedMarks: null,
    instructor: "Prof. Deepa Venkat",
    description: "Write C/Python multi-threaded client-server sockets that handle sliding window protocols with packet drop simulations.",
    attachments: "Socket_Lab_Guidelines.pdf"
  },
  {
    id: "ASN-098",
    title: "Linux Kernel Process Scheduler Simulation (Round Robin)",
    subject: "Operating Systems",
    subjectCode: "CS504",
    dueDate: "20 September 2026",
    status: "Graded",
    priority: "Normal",
    totalMarks: 30,
    obtainedMarks: 28,
    instructor: "Dr. Alok Mukherjee",
    description: "Implement priority-based round robin scheduling with context switch calculation and Gantt chart generation.",
    attachments: "Kernel_Scheduler.c",
    feedback: "Excellent modular design and edge case handling with time quantum drift."
  },
  {
    id: "ASN-095",
    title: "Graph Theory & Dijkstra Shortest Path Analysis",
    subject: "Mathematics IV",
    subjectCode: "CS501",
    dueDate: "14 September 2026",
    status: "Graded",
    priority: "Normal",
    totalMarks: 20,
    obtainedMarks: 19,
    instructor: "Prof. R. Natarajan",
    description: "Mathematical proofs of Dijkstra algorithm optimality and tree spanning matrix equations.",
    attachments: "Math_Solutions_Aarav.pdf",
    feedback: "Clean mathematical notation and robust proofs."
  }
];

export const teacherCreatedAssignments = [
  {
    id: "T-ASN-001",
    title: "Relational Schema Normalization & BCNF Proofs",
    courseId: "CS503",
    courseName: "Database Management Systems",
    batch: "CSE 3rd Year (Sec A)",
    assignedDate: "20 September 2026",
    dueDate: "28 September 2026",
    totalStudents: 62,
    submittedCount: 44,
    pendingReviewCount: 18,
    maxMarks: 20,
    status: "Active"
  },
  {
    id: "T-ASN-002",
    title: "SQL Subqueries, Aggregations & Complex Window Joins",
    courseId: "CS503",
    courseName: "Database Management Systems",
    batch: "CSE 3rd Year (Sec A)",
    assignedDate: "10 September 2026",
    dueDate: "18 September 2026",
    totalStudents: 62,
    submittedCount: 62,
    pendingReviewCount: 0,
    maxMarks: 20,
    status: "Completed"
  },
  {
    id: "T-ASN-003",
    title: "Distributed Transaction ACID & 2-Phase Commit Protocol",
    courseId: "CS702",
    courseName: "Advanced Distributed Systems",
    batch: "CSE 4th Year Elective",
    assignedDate: "22 September 2026",
    dueDate: "06 October 2026",
    totalStudents: 45,
    submittedCount: 12,
    pendingReviewCount: 12,
    maxMarks: 30,
    status: "Active"
  }
];

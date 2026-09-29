export const studentMarksData = {
  gpa: 8.6,
  cgpa: 8.52,
  creditsEarned: 24,
  totalCredits: 24,
  semester: "5th Semester (Fall 2026)",
  subjects: [
    {
      code: "CS501",
      subject: "Mathematics IV",
      credits: 4,
      internals: 26,
      assignments: 18,
      midterm: 27,
      endSem: 72,
      total: 88,
      grade: "A",
      gradePoint: 9.0,
      status: "Passed"
    },
    {
      code: "CS502",
      subject: "Java Programming",
      credits: 4,
      internals: 29,
      assignments: 20,
      midterm: 28,
      endSem: 78,
      total: 94,
      grade: "A+",
      gradePoint: 10.0,
      status: "Passed"
    },
    {
      code: "CS503",
      subject: "Database Management Systems",
      credits: 4,
      internals: 24,
      assignments: 17,
      midterm: 23,
      endSem: 65,
      total: 81,
      grade: "B+",
      gradePoint: 8.0,
      status: "Passed"
    },
    {
      code: "CS504",
      subject: "Operating Systems",
      credits: 4,
      internals: 26,
      assignments: 18,
      midterm: 25,
      endSem: 70,
      total: 86,
      grade: "A",
      gradePoint: 9.0,
      status: "Passed"
    },
    {
      code: "CS505",
      subject: "Computer Networks",
      credits: 4,
      internals: 28,
      assignments: 19,
      midterm: 29,
      endSem: 76,
      total: 93,
      grade: "A+",
      gradePoint: 10.0,
      status: "Passed"
    },
    {
      code: "CS506",
      subject: "Software Engineering",
      credits: 4,
      internals: 25,
      assignments: 18,
      midterm: 26,
      endSem: 71,
      total: 87,
      grade: "A",
      gradePoint: 9.0,
      status: "Passed"
    }
  ],
  semesterHistory: [
    { sem: "Sem 1", gpa: 8.1, credits: 22 },
    { sem: "Sem 2", gpa: 8.3, credits: 22 },
    { sem: "Sem 3", gpa: 8.4, credits: 24 },
    { sem: "Sem 4", gpa: 8.5, credits: 24 },
    { sem: "Sem 5", gpa: 8.6, credits: 24 }
  ]
};

export const teacherMarksRoster = [
  {
    id: "M-001",
    studentId: "STU-2024-001",
    rollNo: "21CS042",
    studentName: "Aarav Sharma",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 18, // max 20
    internalMarks: 25,   // max 30
    examMarks: 45,       // max 50
    total: 88,
    grade: "A"
  },
  {
    id: "M-002",
    studentId: "STU-2024-002",
    rollNo: "21CS043",
    studentName: "Sneha Reddy",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 20,
    internalMarks: 29,
    examMarks: 48,
    total: 97,
    grade: "A+"
  },
  {
    id: "M-003",
    studentId: "STU-2024-003",
    rollNo: "21CS044",
    studentName: "Rohan Varma",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 14,
    internalMarks: 20,
    examMarks: 34,
    total: 68,
    grade: "B"
  },
  {
    id: "M-004",
    studentId: "STU-2024-004",
    rollNo: "21IT019",
    studentName: "Ananya Patel",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 19,
    internalMarks: 27,
    examMarks: 46,
    total: 92,
    grade: "A+"
  },
  {
    id: "M-005",
    studentId: "STU-2024-005",
    rollNo: "22EC015",
    studentName: "Vikram Singhania",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 16,
    internalMarks: 24,
    examMarks: 42,
    total: 82,
    grade: "A"
  },
  {
    id: "M-006",
    studentId: "STU-2024-006",
    rollNo: "20CS089",
    studentName: "Pooja Hegde",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 20,
    internalMarks: 28,
    examMarks: 49,
    total: 97,
    grade: "A+"
  },
  {
    id: "M-007",
    studentId: "STU-2024-007",
    rollNo: "22ME032",
    studentName: "Karthik Nair",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 13,
    internalMarks: 18,
    examMarks: 32,
    total: 63,
    grade: "C"
  },
  {
    id: "M-008",
    studentId: "STU-2024-008",
    rollNo: "23CS012",
    studentName: "Tanvi Deshmukh",
    subject: "Database Management Systems",
    subjectCode: "CS503",
    assignmentMarks: 17,
    internalMarks: 26,
    examMarks: 43,
    total: 86,
    grade: "A"
  }
];

export const calculateGrade = (total) => {
  if (total >= 90) return "A+";
  if (total >= 80) return "A";
  if (total >= 70) return "B+";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 40) return "D";
  return "F";
};

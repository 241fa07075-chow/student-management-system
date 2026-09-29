export const studentAttendanceSummary = {
  overallPercentage: 87,
  totalClassesHeld: 240,
  totalClassesAttended: 209,
  totalClassesMissed: 31,
  minimumRequired: 75,
  subjects: [
    {
      subjectCode: "CS501",
      subjectName: "Mathematics IV",
      held: 48,
      attended: 44,
      percentage: 92,
      status: "Excellent",
      color: "#2563eb"
    },
    {
      subjectCode: "CS502",
      subjectName: "Java Programming",
      held: 42,
      attended: 37,
      percentage: 88,
      status: "Good",
      color: "#10b981"
    },
    {
      subjectCode: "CS503",
      subjectName: "Database Management Systems",
      held: 44,
      attended: 37,
      percentage: 84,
      status: "Good",
      color: "#8b5cf6"
    },
    {
      subjectCode: "CS504",
      subjectName: "Operating Systems",
      held: 43,
      attended: 34,
      percentage: 79,
      status: "Average",
      color: "#f59e0b"
    },
    {
      subjectCode: "CS505",
      subjectName: "Computer Networks",
      held: 45,
      attended: 41,
      percentage: 91,
      status: "Excellent",
      color: "#06b6d4"
    },
    {
      subjectCode: "CS506",
      subjectName: "Software Engineering",
      held: 38,
      attended: 34,
      percentage: 89,
      status: "Good",
      color: "#ec4899"
    }
  ],
  monthlyTrend: [
    { month: "June", percentage: 90 },
    { month: "July", percentage: 88 },
    { month: "August", percentage: 85 },
    { month: "September", percentage: 87 }
  ],
  recentLogs: [
    { date: "2026-09-26", time: "11:30 AM", subject: "Database Management Systems", status: "Present", teacher: "Dr. Priya Iyer" },
    { date: "2026-09-26", time: "09:00 AM", subject: "Mathematics IV", status: "Present", teacher: "Prof. R. Natarajan" },
    { date: "2026-09-25", time: "01:45 PM", subject: "Operating Systems", status: "Absent", teacher: "Dr. Alok Mukherjee" },
    { date: "2026-09-25", time: "10:15 AM", subject: "Java Programming", status: "Present", teacher: "Prof. Sandeep Kulkarni" },
    { date: "2026-09-24", time: "02:00 PM", subject: "Computer Networks", status: "Present", teacher: "Prof. Deepa Venkat" },
    { date: "2026-09-23", time: "11:30 AM", subject: "Database Management Systems", status: "Present", teacher: "Dr. Priya Iyer" },
    { date: "2026-09-23", time: "09:00 AM", subject: "Mathematics IV", status: "Present", teacher: "Prof. R. Natarajan" }
  ]
};

export const teacherRosterAttendance = [
  { id: "STU-2024-001", rollNo: "21CS042", name: "Aarav Sharma", status: "Present" },
  { id: "STU-2024-002", rollNo: "21CS043", name: "Sneha Reddy", status: "Present" },
  { id: "STU-2024-003", rollNo: "21CS044", name: "Rohan Varma", status: "Absent" },
  { id: "STU-2024-004", rollNo: "21IT019", name: "Ananya Patel", status: "Present" },
  { id: "STU-2024-005", rollNo: "22EC015", name: "Vikram Singhania", status: "Present" },
  { id: "STU-2024-006", rollNo: "20CS089", name: "Pooja Hegde", status: "Present" },
  { id: "STU-2024-007", rollNo: "22ME032", name: "Karthik Nair", status: "Absent" },
  { id: "STU-2024-008", rollNo: "23CS012", name: "Tanvi Deshmukh", status: "Present" },
  { id: "STU-2024-009", rollNo: "20IT054", name: "Aditya Chopra", status: "Present" },
  { id: "STU-2024-010", rollNo: "21EC041", name: "Meera Krishnan", status: "Present" }
];

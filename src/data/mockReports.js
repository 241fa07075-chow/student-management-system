export const studentReportsData = {
  attendanceOverview: {
    overall: 87,
    required: 75,
    totalSessions: 240,
    attendedSessions: 209,
    eligibleForExams: true,
    monthlyBreakdown: [
      { month: "Jun", attendance: 90, benchmark: 75 },
      { month: "Jul", attendance: 88, benchmark: 75 },
      { month: "Aug", attendance: 85, benchmark: 75 },
      { month: "Sep", attendance: 87, benchmark: 75 }
    ],
    subjectBreakdown: [
      { subject: "Mathematics IV", percentage: 92, status: "Safe" },
      { subject: "Java Programming", percentage: 88, status: "Safe" },
      { subject: "DBMS", percentage: 84, status: "Safe" },
      { subject: "Operating Systems", percentage: 79, status: "Needs Care" },
      { subject: "Computer Networks", percentage: 91, status: "Safe" },
      { subject: "Software Engineering", percentage: 89, status: "Safe" }
    ]
  },
  academicPerformance: {
    cgpa: 8.52,
    currentSemesterGpa: 8.6,
    rankInClass: "4th out of 68 students",
    percentile: 94.1,
    gradeDistribution: [
      { grade: "A+", count: 2, label: "Outstanding (90-100)" },
      { grade: "A", count: 3, label: "Excellent (80-89)" },
      { grade: "B+", count: 1, label: "Very Good (70-79)" },
      { grade: "B", count: 0, label: "Good (60-69)" }
    ],
    semesterTrend: [
      { semester: "Sem 1", sgpa: 8.1, credits: 22 },
      { semester: "Sem 2", sgpa: 8.3, credits: 22 },
      { semester: "Sem 3", sgpa: 8.4, credits: 24 },
      { semester: "Sem 4", sgpa: 8.5, credits: 24 },
      { semester: "Sem 5 (Current)", sgpa: 8.6, credits: 24 }
    ]
  }
};

export const teacherReportsData = {
  classPerformanceOverview: {
    totalStudents: 120,
    averageGpa: 8.1,
    passPercentage: 96.5,
    topPerformer: "Sneha Reddy (GPA: 9.2)",
    studentsAtRisk: 4,
    gradeDistribution: [
      { grade: "A+ (90-100%)", count: 24, percentage: 20 },
      { grade: "A (80-89%)", count: 52, percentage: 43.3 },
      { grade: "B+ (70-79%)", count: 31, percentage: 25.8 },
      { grade: "B (60-69%)", count: 9, percentage: 7.5 },
      { grade: "Needs Support (<60%)", count: 4, percentage: 3.4 }
    ]
  },
  attendanceStatistics: {
    overallAttendance: 84,
    above85Percent: 78,
    between75And85: 38,
    below75Risk: 4,
    monthlyClassAttendance: [
      { month: "Jun", rate: 88 },
      { month: "Jul", rate: 86 },
      { month: "Aug", rate: 82 },
      { month: "Sep", rate: 84 }
    ]
  },
  courseMetrics: [
    {
      course: "Database Management Systems (CSE-A)",
      enrolled: 62,
      avgMarks: 78.4,
      avgAttendance: 85,
      submissionsOnTime: "92%"
    },
    {
      course: "Database Management Systems (IT-B)",
      enrolled: 58,
      avgMarks: 76.1,
      avgAttendance: 82,
      submissionsOnTime: "88%"
    },
    {
      course: "Advanced Distributed Systems",
      enrolled: 45,
      avgMarks: 83.5,
      avgAttendance: 89,
      submissionsOnTime: "95%"
    },
    {
      course: "Data Structures Lab",
      enrolled: 65,
      avgMarks: 85.0,
      avgAttendance: 91,
      submissionsOnTime: "98%"
    }
  ]
};

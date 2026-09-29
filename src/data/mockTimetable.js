export const studentTimetableData = {
  today: "Monday",
  todayClasses: [
    {
      id: "T-MON-1",
      time: "09:00 AM - 10:00 AM",
      subject: "Mathematics IV",
      code: "CS501",
      instructor: "Prof. R. Natarajan",
      room: "LH-201",
      type: "Lecture",
      status: "Completed"
    },
    {
      id: "T-MON-2",
      time: "11:30 AM - 01:00 PM",
      subject: "Database Management Systems",
      code: "CS503",
      instructor: "Dr. Priya Iyer",
      room: "LH-104",
      type: "Lecture & Lab Demo",
      status: "Upcoming"
    },
    {
      id: "T-MON-3",
      time: "03:30 PM - 05:00 PM",
      subject: "Software Engineering",
      code: "CS506",
      instructor: "Prof. Manoj Joshi",
      room: "LH-205",
      type: "Lecture",
      status: "Upcoming"
    }
  ],
  weekly: {
    Monday: [
      { time: "09:00 - 10:00 AM", code: "CS501", subject: "Mathematics IV", room: "LH-201", teacher: "Prof. R. Natarajan" },
      { time: "11:30 - 01:00 PM", code: "CS503", subject: "Database Management Systems", room: "LH-104", teacher: "Dr. Priya Iyer" },
      { time: "01:00 - 02:00 PM", code: "LUNCH", subject: "Lunch Break", room: "Cafeteria", teacher: "-" },
      { time: "03:30 - 05:00 PM", code: "CS506", subject: "Software Engineering", room: "LH-205", teacher: "Prof. Manoj Joshi" }
    ],
    Tuesday: [
      { time: "10:15 - 11:45 AM", code: "CS502", subject: "Java Programming", room: "CS-Lab 2", teacher: "Prof. Sandeep Kulkarni" },
      { time: "01:00 - 02:00 PM", code: "LUNCH", subject: "Lunch Break", room: "Cafeteria", teacher: "-" },
      { time: "01:45 - 03:15 PM", code: "CS504", subject: "Operating Systems", room: "LH-203", teacher: "Dr. Alok Mukherjee" }
    ],
    Wednesday: [
      { time: "09:00 - 10:00 AM", code: "CS501", subject: "Mathematics IV", room: "LH-201", teacher: "Prof. R. Natarajan" },
      { time: "11:30 - 01:00 PM", code: "CS503", subject: "Database Management Systems", room: "LH-104", teacher: "Dr. Priya Iyer" },
      { time: "01:00 - 02:00 PM", code: "LUNCH", subject: "Lunch Break", room: "Cafeteria", teacher: "-" },
      { time: "02:00 - 03:30 PM", code: "CS505", subject: "Computer Networks", room: "LH-108", teacher: "Prof. Deepa Venkat" }
    ],
    Thursday: [
      { time: "10:15 - 11:45 AM", code: "CS502", subject: "Java Programming", room: "CS-Lab 2", teacher: "Prof. Sandeep Kulkarni" },
      { time: "01:00 - 02:00 PM", code: "LUNCH", subject: "Lunch Break", room: "Cafeteria", teacher: "-" },
      { time: "01:45 - 03:15 PM", code: "CS504", subject: "Operating Systems", room: "LH-203", teacher: "Dr. Alok Mukherjee" }
    ],
    Friday: [
      { time: "09:00 - 10:00 AM", code: "CS501", subject: "Mathematics IV", room: "LH-201", teacher: "Prof. R. Natarajan" },
      { time: "10:15 - 11:45 AM", code: "CS506", subject: "Software Engineering", room: "LH-205", teacher: "Prof. Manoj Joshi" },
      { time: "01:00 - 02:00 PM", code: "LUNCH", subject: "Lunch Break", room: "Cafeteria", teacher: "-" },
      { time: "02:00 - 03:30 PM", code: "CS505", subject: "Computer Networks", room: "LH-108", teacher: "Prof. Deepa Venkat" }
    ]
  }
};

export const teacherTimetableData = {
  today: "Monday",
  todayClasses: [
    {
      id: "T-SCH-01",
      time: "10:00 AM - 11:15 AM",
      subject: "Database Management Systems",
      batch: "CSE 3rd Year (Sec B)",
      room: "LH-102",
      type: "Lecture",
      status: "Completed"
    },
    {
      id: "T-SCH-02",
      time: "11:30 AM - 01:00 PM",
      subject: "Database Management Systems",
      batch: "CSE 3rd Year (Sec A)",
      room: "LH-104",
      type: "Theory & Practice",
      status: "In Progress"
    },
    {
      id: "T-SCH-03",
      time: "03:00 PM - 04:30 PM",
      subject: "Advanced Distributed Systems",
      batch: "CSE 4th Year Elective",
      room: "CS-Seminar Hall",
      type: "Seminar / Discussion",
      status: "Upcoming"
    }
  ],
  weekly: {
    Monday: [
      { time: "10:00 - 11:15 AM", subject: "Database Systems", batch: "CSE 3rd Year Sec B", room: "LH-102" },
      { time: "11:30 - 01:00 PM", subject: "Database Systems", batch: "CSE 3rd Year Sec A", room: "LH-104" },
      { time: "03:00 - 04:30 PM", subject: "Advanced Distributed Systems", batch: "CSE 4th Year Elective", room: "CS-Seminar Hall" }
    ],
    Tuesday: [
      { time: "09:00 - 10:30 AM", subject: "Database Systems", batch: "IT 3rd Year Sec B", room: "LH-102" },
      { time: "02:00 - 04:00 PM", subject: "Department Faculty Research Meet", batch: "CSE Staff", room: "Boardroom A" }
    ],
    Wednesday: [
      { time: "11:30 - 01:00 PM", subject: "Database Systems", batch: "CSE 3rd Year Sec A", room: "LH-104" },
      { time: "03:30 - 05:00 PM", subject: "Advanced Distributed Systems", batch: "CSE 4th Year Elective", room: "CS-Seminar Hall" }
    ],
    Thursday: [
      { time: "09:00 - 10:30 AM", subject: "Database Systems", batch: "IT 3rd Year Sec B", room: "LH-102" },
      { time: "01:45 - 04:45 PM", subject: "Data Structures Lab & Practice", batch: "CSE 2nd Year Sec A", room: "CS-Lab 1" }
    ],
    Friday: [
      { time: "03:30 - 05:00 PM", subject: "Advanced Distributed Systems", batch: "CSE 4th Year Elective", room: "CS-Seminar Hall" },
      { time: "05:00 - 06:00 PM", subject: "Office Hours Mentorship", batch: "Student Consultations", room: "Block C-304" }
    ]
  }
};

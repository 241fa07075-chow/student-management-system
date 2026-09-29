export const initialStudentNotifications = [
  {
    id: "NOTIF-STU-01",
    title: "Internal Marks Updated",
    message: "Dr. Priya Iyer has published the internal assessment marks for Database Management Systems (CS503).",
    date: "28 Sep 2026, 08:30 AM",
    read: false,
    type: "academic",
    link: "/student/marks"
  },
  {
    id: "NOTIF-STU-02",
    title: "Assignment Deadline Approaching",
    message: "Reminder: DBMS Normalization assignment is due tonight at 11:59 PM. Please submit on time.",
    date: "28 Sep 2026, 07:15 AM",
    read: false,
    type: "urgent",
    link: "/student/assignments"
  },
  {
    id: "NOTIF-STU-03",
    title: "New Timetable Published",
    message: "The revised Fall 2026 midterm examination and lab session timetable is now available for download.",
    date: "27 Sep 2026, 04:45 PM",
    read: true,
    type: "general",
    link: "/student/timetable"
  },
  {
    id: "NOTIF-STU-04",
    title: "Attendance Updated",
    message: "Attendance for Operating Systems class on 26 Sep has been recorded. Current attendance: 79%.",
    date: "26 Sep 2026, 03:00 PM",
    read: true,
    type: "attendance",
    link: "/student/attendance"
  },
  {
    id: "NOTIF-STU-05",
    title: "Library Book Due Notice",
    message: "The book 'Distributed Systems: Concepts and Design' borrowed from Central Library is due on 30 Sep.",
    date: "25 Sep 2026, 11:00 AM",
    read: true,
    type: "library",
    link: "/student/dashboard"
  }
];

export const initialTeacherNotifications = [
  {
    id: "NOTIF-TEA-01",
    title: "New Assignment Submissions",
    message: "18 new students submitted the DBMS BCNF Normalization assignment and are pending evaluation.",
    date: "28 Sep 2026, 08:15 AM",
    read: false,
    type: "assignment",
    link: "/teacher/assignments"
  },
  {
    id: "NOTIF-TEA-02",
    title: "Department Faculty Board Meeting",
    message: "HOD convened a curriculum review meeting on Tuesday at 02:00 PM in Conference Room A.",
    date: "27 Sep 2026, 02:30 PM",
    read: false,
    type: "meeting",
    link: "/teacher/timetable"
  },
  {
    id: "NOTIF-TEA-03",
    title: "Attendance Shortage Alert",
    message: "3 students in CSE 3rd Year (Sec A) have fallen below the 75% mandatory attendance threshold.",
    date: "26 Sep 2026, 05:00 PM",
    read: true,
    type: "alert",
    link: "/teacher/attendance"
  },
  {
    id: "NOTIF-TEA-04",
    title: "Internal Marks Submission Deadline",
    message: "Dean of Academics requests internal assessment 1 marks to be locked by 30th September.",
    date: "25 Sep 2026, 10:00 AM",
    read: true,
    type: "academic",
    link: "/teacher/marks"
  }
];

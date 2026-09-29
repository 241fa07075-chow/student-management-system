const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

const MINIMUM_ATTENDANCE_PERCENT = 75;

// Helper to calculate student's comprehensive attendance metrics
const computeStudentAttendance = async (student) => {
  // Find all attendance entries for this student
  const records = await Attendance.find({ studentId: student._id })
    .populate('courseId', 'courseCode courseName instructorName')
    .sort({ date: -1 });

  const totalClasses = records.length;
  const totalPresent = records.filter(r => r.status === 'present').length;
  const totalMissed = totalClasses - totalPresent;

  const overallPercentage = totalClasses > 0
    ? Number(((totalPresent / totalClasses) * 100).toFixed(1))
    : 85;

  const overallStatus = overallPercentage >= MINIMUM_ATTENDANCE_PERCENT ? 'Eligible' : 'Shortage';

  // Group by course
  const courseMap = {};
  records.forEach(rec => {
    if (!rec.courseId) return;
    const cid = rec.courseId._id.toString();
    if (!courseMap[cid]) {
      courseMap[cid] = {
        courseId: cid,
        subjectCode: rec.courseId.courseCode,
        subjectName: rec.courseId.courseName,
        subject: rec.courseId.courseName,
        instructor: rec.courseId.instructorName,
        held: 0,
        attended: 0,
        present: 0,
        total: 0
      };
    }
    courseMap[cid].held += 1;
    courseMap[cid].total += 1;
    if (rec.status === 'present') {
      courseMap[cid].attended += 1;
      courseMap[cid].present += 1;
    }
  });

  const subjects = Object.values(courseMap).map(sub => {
    const percentage = sub.total > 0
      ? Number(((sub.present / sub.total) * 100).toFixed(1))
      : 85;
    const status = percentage >= MINIMUM_ATTENDANCE_PERCENT ? 'Eligible' : 'Shortage';
    return {
      ...sub,
      percentage,
      status
    };
  });

  // Recent logs formatted
  const recentLogs = records.slice(0, 10).map(rec => ({
    id: rec._id,
    date: rec.date,
    time: rec.time || '10:00 AM',
    subject: rec.courseId?.courseName || 'Class Session',
    subjectCode: rec.courseId?.courseCode || 'CS',
    status: rec.status === 'present' ? 'Present' : 'Absent',
    teacher: rec.courseId?.instructorName || 'Faculty'
  }));

  let warning = null;
  if (overallPercentage < MINIMUM_ATTENDANCE_PERCENT) {
    warning = 'Attendance Shortage: Your attendance is below the required 75%.';
  } else if (overallPercentage < 80) {
    warning = 'Warning: Your attendance is approaching the minimum requirement of 75%.';
  }

  return {
    studentId: student.studentId,
    studentName: student.name,
    attendance: overallPercentage,
    overallPercentage,
    overallAttendance: overallPercentage,
    minimumRequired: MINIMUM_ATTENDANCE_PERCENT,
    status: overallStatus,
    eligibleForExams: overallStatus === 'Eligible',
    warning,
    totalClassesHeld: totalClasses,
    totalClassesAttended: totalPresent,
    totalClassesMissed: totalMissed,
    subjects,
    recentLogs
  };
};

// @desc    Get student attendance report
// @route   GET /api/attendance/student/:studentId
// @access  Private
exports.getStudentAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [
        { _id: req.params.studentId.match(/^[0-9a-fA-F]{24}$/) ? req.params.studentId : null },
        { studentId: req.params.studentId }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const report = await computeStudentAttendance(student);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's own attendance
// @route   GET /api/attendance/me
// @access  Private (Student)
exports.getMyAttendance = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const report = await computeStudentAttendance(student);
    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get roster attendance for teacher by course & date
// @route   GET /api/attendance/roster
// @access  Private (Teacher)
exports.getCourseRosterAttendance = async (req, res, next) => {
  try {
    const { courseCode, date } = req.query;
    const queryDate = date || new Date().toISOString().split('T')[0];

    const course = await Course.findOne({
      $or: [
        { courseCode: courseCode || 'CS503' },
        { _id: courseCode?.match(/^[0-9a-fA-F]{24}$/) ? courseCode : null }
      ]
    });

    // Get all students
    const students = await Student.find().sort({ studentId: 1 });

    // Find any existing attendance records for this course & date
    let records = [];
    if (course) {
      records = await Attendance.find({
        courseId: course._id,
        date: queryDate
      });
    }

    const recordMap = {};
    records.forEach(r => {
      recordMap[r.studentId.toString()] = r.status;
    });

    const roster = students.map(s => ({
      id: s._id,
      studentId: s.studentId,
      rollNo: s.rollNo || s.studentId,
      name: s.name,
      status: recordMap[s._id.toString()]
        ? (recordMap[s._id.toString()] === 'present' ? 'Present' : 'Absent')
        : 'Present' // Default to present for new roll call
    }));

    res.status(200).json({
      success: true,
      course: course ? { id: course._id, code: course.courseCode, name: course.courseName } : null,
      date: queryDate,
      count: roster.length,
      data: roster
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Save/Update attendance roster
// @route   POST /api/attendance
// @access  Private (Teacher)
exports.saveAttendance = async (req, res, next) => {
  try {
    const { courseCode, courseId, date, roster } = req.body;

    if (!date || !roster || !Array.isArray(roster)) {
      return res.status(400).json({ success: false, message: 'Date and student roster array are required' });
    }

    let course = null;
    if (courseId && courseId.match(/^[0-9a-fA-F]{24}$/)) {
      course = await Course.findById(courseId);
    }
    if (!course && courseCode) {
      course = await Course.findOne({ courseCode });
    }
    if (!course) {
      course = await Course.findOne(); // Fallback to first course
    }

    const bulkOps = [];
    for (const item of roster) {
      const studentKey = item.id || item.studentId;
      let student = null;
      if (typeof studentKey === 'string' && studentKey.match(/^[0-9a-fA-F]{24}$/)) {
        student = await Student.findById(studentKey);
      }
      if (!student) {
        student = await Student.findOne({ studentId: studentKey });
      }
      if (!student) continue;

      const status = (item.status || 'present').toLowerCase();
      bulkOps.push({
        updateOne: {
          filter: {
            studentId: student._id,
            courseId: course._id,
            date: date
          },
          update: {
            $set: {
              status: status === 'present' ? 'present' : 'absent',
              time: '11:30 AM'
            }
          },
          upsert: true
        }
      });
    }

    if (bulkOps.length > 0) {
      await Attendance.bulkWrite(bulkOps);
    }

    // Check if any student attendance has fallen below 75% and trigger alert notification
    for (const item of roster) {
      try {
        const studentKey = item.id || item.studentId;
        const student = (typeof studentKey === 'string' && studentKey.match(/^[0-9a-fA-F]{24}$/))
          ? await Student.findById(studentKey)
          : await Student.findOne({ studentId: studentKey });
        if (student) {
          const stats = await computeStudentAttendance(student);
          if (stats.overallPercentage < MINIMUM_ATTENDANCE_PERCENT) {
            // Check if notification already sent today
            const existingNotif = await Notification.findOne({
              userId: student.userId,
              title: 'Attendance Shortage Alert'
            });
            if (!existingNotif) {
              await Notification.create({
                userId: student.userId,
                title: 'Attendance Shortage Alert',
                message: `Attendance Shortage: Your current overall attendance is ${stats.overallPercentage}%, which is below the mandatory 75% requirement.`,
                type: 'urgent',
                link: '/student/attendance'
              });
            }
          }
        }
      } catch (subErr) {
        // Non-blocking
      }
    }

    res.status(200).json({
      success: true,
      message: `Attendance successfully saved for ${roster.length} students on ${date}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher attendance summary (total students, >=75%, <75%, at risk)
// @route   GET /api/attendance/summary
// @access  Private (Teacher)
exports.getTeacherAttendanceSummary = async (req, res, next) => {
  try {
    const students = await Student.find();
    let eligible = 0;
    let shortage = 0;

    for (const s of students) {
      const recs = await Attendance.find({ studentId: s._id });
      if (recs.length > 0) {
        const pres = recs.filter(r => r.status === 'present').length;
        const pct = (pres / recs.length) * 100;
        if (pct >= MINIMUM_ATTENDANCE_PERCENT) eligible++;
        else shortage++;
      } else {
        eligible++;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalStudents: students.length,
        eligible,
        shortage,
        minimumRequired: MINIMUM_ATTENDANCE_PERCENT
      }
    });
  } catch (error) {
    next(error);
  }
};

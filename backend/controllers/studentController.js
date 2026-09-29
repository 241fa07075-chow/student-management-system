const Student = require('../models/Student');
const User = require('../models/User');
const Attendance = require('../models/Attendance');
const Marks = require('../models/Marks');

// Helper to calculate student overall attendance percentage and GPA
const calculateStudentStats = async (studentObjectId) => {
  const attendanceRecords = await Attendance.find({ studentId: studentObjectId });
  let attendancePct = 85;
  if (attendanceRecords.length > 0) {
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    attendancePct = Number(((present / attendanceRecords.length) * 100).toFixed(1));
  }

  const marksRecords = await Marks.find({ studentId: studentObjectId });
  let gpa = 8.5;
  if (marksRecords.length > 0) {
    const totalGpa = marksRecords.reduce((acc, m) => acc + (m.gradePoint || 0), 0);
    gpa = Number((totalGpa / marksRecords.length).toFixed(1));
  }

  return { attendance: attendancePct, gpa };
};

// @desc    Get all students (with optional search, dept, year filters)
// @route   GET /api/students
// @access  Private (Teacher)
exports.getStudents = async (req, res, next) => {
  try {
    const { search, department, year } = req.query;
    let query = {};

    if (department && department !== 'All') {
      query.department = new RegExp(department, 'i');
    }
    if (year && year !== 'All') {
      query.year = new RegExp(year, 'i');
    }
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { studentId: new RegExp(search, 'i') },
        { rollNo: new RegExp(search, 'i') }
      ];
    }

    const students = await Student.find(query).sort({ studentId: 1 });

    // Attach calculated attendance and GPA to each student
    const enhancedStudents = await Promise.all(
      students.map(async (stu) => {
        const stats = await calculateStudentStats(stu._id);
        const doc = stu.toObject();
        return {
          ...doc,
          id: doc.studentId, // frontend alias
          _id: doc._id,
          attendance: stats.attendance,
          gpa: stats.gpa
        };
      })
    );

    res.status(200).json({
      success: true,
      count: enhancedStudents.length,
      data: enhancedStudents
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { studentId: req.params.id }
      ]
    }).populate('courses');

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const stats = await calculateStudentStats(student._id);
    const doc = student.toObject();

    res.status(200).json({
      success: true,
      data: {
        ...doc,
        id: doc.studentId,
        attendance: stats.attendance,
        gpa: stats.gpa
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in student's own profile
// @route   GET /api/students/profile/me
// @access  Private (Student)
exports.getMyStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('courses');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile record not found' });
    }

    const stats = await calculateStudentStats(student._id);
    const doc = student.toObject();

    res.status(200).json({
      success: true,
      data: {
        ...doc,
        id: doc.studentId,
        attendance: stats.attendance,
        gpa: stats.gpa
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new student
// @route   POST /api/students
// @access  Private (Teacher)
exports.createStudent = async (req, res, next) => {
  try {
    const {
      name,
      email,
      studentId: rawStudentId,
      department,
      year,
      semester,
      phone,
      address,
      rollNo,
      status
    } = req.body;

    const studentId = rawStudentId || rollNo || ('STU' + Math.floor(100 + Math.random() * 900));

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: `Student with ID '${studentId}' already exists`
      });
    }

    // Check or create associated user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'student123', // default initial password
        role: 'student',
        phone: phone || ''
      });
    }

    const newStudent = await Student.create({
      userId: user._id,
      studentId,
      name,
      email,
      phone: phone || '',
      department: department || 'Computer Science',
      year: year || '1st Year',
      semester: semester || '1st',
      address: address || '',
      rollNo: rollNo || studentId,
      status: status || 'Active'
    });

    // Optionally seed default attendance & marks if provided
    try {
      const Course = require('../models/Course');
      const defaultCourse = await Course.findOne();
      if (defaultCourse) {
        const initialAttendance = req.body.attendance !== undefined ? Number(req.body.attendance) : 85;
        const totalSessions = 20;
        const presentCount = Math.round((initialAttendance / 100) * totalSessions);
        for (let i = 0; i < totalSessions; i++) {
          await Attendance.create({
            studentId: newStudent._id,
            courseId: defaultCourse._id,
            date: `2026-09-${String(i + 1).padStart(2, '0')}`,
            status: i < presentCount ? 'present' : 'absent'
          });
        }
      }
    } catch (seedErr) {
      console.warn('Initial student attendance seed skipped:', seedErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Student enrolled successfully',
      data: newStudent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
// @access  Private
exports.updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { studentId: req.params.id }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Students can only update their own profile; teachers can update anyone
    if (req.user.role === 'student' && student.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this student profile' });
    }

    const fieldsToUpdate = [
      'name',
      'phone',
      'address',
      'guardianName',
      'guardianPhone',
      'department',
      'year',
      'semester',
      'dateOfBirth',
      'status',
      'profileImage'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    // If name or phone updated, sync with User
    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(student.userId, {
        name: student.name,
        phone: student.phone
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
// @access  Private (Teacher)
exports.deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { studentId: req.params.id }
      ]
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    await User.findByIdAndDelete(student.userId);
    await Student.findByIdAndDelete(student._id);

    res.status(200).json({
      success: true,
      message: 'Student record and login account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

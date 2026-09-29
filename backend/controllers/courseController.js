const Course = require('../models/Course');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
exports.getCourses = async (req, res, next) => {
  try {
    const { department, semester, teacherId } = req.query;
    let query = {};

    if (department) query.department = department;
    if (semester) query.semester = semester;
    if (teacherId) query.teacherId = teacherId;

    const courses = await Course.find(query)
      .populate('teacherId', 'name email designation qualification')
      .sort({ courseCode: 1 });

    const formatted = courses.map(c => {
      const doc = c.toObject();
      return {
        ...doc,
        id: doc.courseCode,
        _id: doc._id,
        code: doc.courseCode,
        name: doc.courseName,
        instructor: doc.instructorName || doc.teacherId?.name || 'Faculty Member',
        studentsCount: doc.students?.length || 60
      };
    });

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Private
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { courseCode: req.params.id }
      ]
    }).populate('teacherId').populate('students', 'name email studentId rollNo');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const doc = course.toObject();
    res.status(200).json({
      success: true,
      data: {
        ...doc,
        id: doc.courseCode,
        code: doc.courseCode,
        name: doc.courseName,
        instructor: doc.instructorName || doc.teacherId?.name || 'Faculty Member'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Teacher)
exports.createCourse = async (req, res, next) => {
  try {
    const { courseCode, courseName, credits, description, schedule, room, department, semester } = req.body;

    if (!courseCode || !courseName) {
      return res.status(400).json({ success: false, message: 'Course code and name are required' });
    }

    let teacher = null;
    if (req.user.role === 'teacher') {
      teacher = await Teacher.findOne({ userId: req.user.id });
    }

    const course = await Course.create({
      courseCode,
      courseName,
      credits: Number(credits) || 4,
      description: description || '',
      schedule: schedule || '',
      room: room || '',
      department: department || 'Computer Science',
      semester: semester || '5',
      teacherId: teacher ? teacher._id : null,
      instructorName: teacher ? teacher.name : ''
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { courseCode: req.params.id }
      ]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const fields = ['courseName', 'description', 'credits', 'schedule', 'room', 'syllabus', 'progress'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) course[f] = req.body[f];
    });

    await course.save();

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findOneAndDelete({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { courseCode: req.params.id }
      ]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Course removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll student in course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { courseCode: req.params.id }
      ]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    if (course.students.includes(student._id)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    course.students.push(student._id);
    await course.save();

    if (!student.courses.includes(course._id)) {
      student.courses.push(course._id);
      await student.save();
    }

    res.status(200).json({
      success: true,
      message: `Enrolled in ${course.courseName}`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private (Student)
exports.unenrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    course.students = course.students.filter(s => s.toString() !== student._id.toString());
    await course.save();

    student.courses = student.courses.filter(c => c.toString() !== course._id.toString());
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Unenrolled from course'
    });
  } catch (error) {
    next(error);
  }
};

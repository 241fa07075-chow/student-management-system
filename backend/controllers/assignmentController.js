const Assignment = require('../models/Assignment');
const Student = require('../models/Student');
const Course = require('../models/Course');
const Teacher = require('../models/Teacher');

// @desc    Get assignments (role-aware)
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res, next) => {
  try {
    const assignments = await Assignment.find()
      .populate('courseId', 'courseCode courseName')
      .populate('teacherId', 'name')
      .sort({ createdAt: -1 });

    if (req.user.role === 'student') {
      const student = await Student.findOne({ userId: req.user.id });
      const studentIdStr = student ? student._id.toString() : '';

      const formatted = assignments.map(a => {
        const doc = a.toObject();
        const submission = doc.submissions?.find(s => s.studentId?.toString() === studentIdStr);

        return {
          id: doc._id,
          _id: doc._id,
          title: doc.title,
          description: doc.description,
          subject: doc.courseId?.courseName || 'Computer Science',
          subjectCode: doc.courseId?.courseCode || 'CS',
          dueDate: doc.dueDate,
          priority: doc.priority || 'Medium',
          totalMarks: doc.maxMarks || 20,
          status: submission ? (submission.isGraded ? 'Graded' : 'Submitted') : 'Pending',
          obtainedMarks: submission?.obtainedMarks !== undefined ? submission.obtainedMarks : null,
          feedback: submission?.feedback || '',
          instructor: doc.teacherId?.name || 'Faculty Member',
          attachments: doc.attachments || ''
        };
      });

      return res.status(200).json({ success: true, count: formatted.length, data: formatted });
    }

    // Teacher view
    const formatted = assignments.map(a => {
      const doc = a.toObject();
      const submittedCount = doc.submissions?.length || 0;
      const gradedCount = doc.submissions?.filter(s => s.isGraded).length || 0;
      const pendingReviewCount = submittedCount - gradedCount;

      return {
        id: doc._id,
        _id: doc._id,
        title: doc.title,
        description: doc.description,
        courseName: doc.courseId?.courseName || 'Computer Science',
        courseCode: doc.courseId?.courseCode || 'CS',
        batch: 'CSE 3rd Year (Sec A)',
        dueDate: doc.dueDate,
        maxMarks: doc.maxMarks || 20,
        totalStudents: 62,
        submittedCount,
        pendingReviewCount,
        status: doc.status || 'Active',
        submissions: doc.submissions || []
      };
    });

    res.status(200).json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignmentById = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('courseId')
      .populate('teacherId');

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
exports.createAssignment = async (req, res, next) => {
  try {
    const { title, description, courseName, courseCode, dueDate, maxMarks } = req.body;

    let course = null;
    if (courseCode) {
      course = await Course.findOne({ courseCode });
    }
    if (!course && courseName) {
      course = await Course.findOne({ courseName: new RegExp(courseName, 'i') });
    }
    if (!course) {
      course = await Course.findOne();
    }

    const teacher = await Teacher.findOne({ userId: req.user.id });

    const assignment = await Assignment.create({
      title,
      description: description || '',
      courseId: course._id,
      teacherId: teacher ? teacher._id : null,
      dueDate: dueDate || '15 October 2026',
      maxMarks: Number(maxMarks) || 20
    });

    res.status(201).json({
      success: true,
      message: 'Assignment published successfully',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit assignment by student
// @route   POST /api/assignments/:id/submit
// @access  Private (Student)
exports.submitAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const { notes, fileName } = req.body;

    // Check if already submitted
    const existingIndex = assignment.submissions.findIndex(
      s => s.studentId.toString() === student._id.toString()
    );

    if (existingIndex >= 0) {
      assignment.submissions[existingIndex].notes = notes || '';
      assignment.submissions[existingIndex].fileName = fileName || 'submission.pdf';
      assignment.submissions[existingIndex].submittedAt = new Date();
    } else {
      assignment.submissions.push({
        studentId: student._id,
        studentName: student.name,
        rollNo: student.rollNo || student.studentId,
        notes: notes || '',
        fileName: fileName || 'submission.pdf',
        submittedAt: new Date(),
        isGraded: false
      });
    }

    await assignment.save();

    res.status(200).json({
      success: true,
      message: 'Assignment submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private (Teacher)
exports.updateAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({ success: true, data: assignment });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Teacher)
exports.deleteAssignment = async (req, res, next) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({ success: true, message: 'Assignment deleted' });
  } catch (error) {
    next(error);
  }
};

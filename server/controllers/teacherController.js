const Teacher = require('../models/Teacher');
const User = require('../models/User');

// @desc    Get all teachers
// @route   GET /api/teachers
// @access  Private
exports.getTeachers = async (req, res, next) => {
  try {
    const teachers = await Teacher.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single teacher by ID
// @route   GET /api/teachers/:id
// @access  Private
exports.getTeacherById = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { teacherId: req.params.id }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in teacher's own profile
// @route   GET /api/teachers/profile/me
// @access  Private (Teacher)
exports.getMyTeacherProfile = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({ userId: req.user.id });
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher profile record not found' });
    }

    res.status(200).json({
      success: true,
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create teacher
// @route   POST /api/teachers
// @access  Private (Admin)
exports.createTeacher = async (req, res, next) => {
  try {
    const { name, email, teacherId, department, subject, qualification, phone } = req.body;

    if (!name || !email || !teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and teacher ID are required'
      });
    }

    const existing = await Teacher.findOne({ teacherId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Teacher with ID '${teacherId}' already exists`
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'teacher123',
        role: 'teacher',
        phone: phone || ''
      });
    }

    const newTeacher = await Teacher.create({
      userId: user._id,
      teacherId,
      name,
      email,
      phone: phone || '',
      department: department || 'Computer Science',
      subject: subject || 'Computer Science',
      qualification: qualification || 'M.Tech / Ph.D.'
    });

    res.status(201).json({
      success: true,
      data: newTeacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update teacher profile
// @route   PUT /api/teachers/:id
// @access  Private (Teacher)
exports.updateTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { teacherId: req.params.id }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    const fields = [
      'name',
      'phone',
      'department',
      'specialization',
      'experience',
      'qualification',
      'cabin',
      'officeHours',
      'profileImage'
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        teacher[f] = req.body[f];
      }
    });

    await teacher.save();

    if (req.body.name || req.body.phone) {
      await User.findByIdAndUpdate(teacher.userId, {
        name: teacher.name,
        phone: teacher.phone
      });
    }

    res.status(200).json({
      success: true,
      message: 'Teacher profile updated successfully',
      data: teacher
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete teacher
// @route   DELETE /api/teachers/:id
// @access  Private (Admin)
exports.deleteTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { teacherId: req.params.id }
      ]
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    await User.findByIdAndDelete(teacher.userId);
    await Teacher.findByIdAndDelete(teacher._id);

    res.status(200).json({
      success: true,
      message: 'Teacher record deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

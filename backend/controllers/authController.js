const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

// Token generator
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_jwt_student_management_key_2026_apex_secure',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Student or Teacher)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      department,
      studentId,
      year,
      semester,
      dateOfBirth,
      gender,
      address,
      guardianName,
      guardianPhone,
      teacherId,
      subject,
      qualification,
      experience
    } = req.body;

    // 1. Basic required checks
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, password, and role.'
      });
    }

    // 2. Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    // 3. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
    }

    // 4. Password confirmation check
    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.'
      });
    }

    // 5. Check if user with email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    // 6. Role-specific validation & uniqueness
    if (role === 'student') {
      const sId = studentId ? studentId.trim() : `STU${Date.now().toString().slice(-4)}`;
      const existingStudent = await Student.findOne({ studentId: sId });
      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: 'A student with this Student ID already exists.'
        });
      }
    } else if (role === 'teacher') {
      const tId = teacherId ? teacherId.trim() : `TEA${Date.now().toString().slice(-4)}`;
      const existingTeacher = await Teacher.findOne({ teacherId: tId });
      if (existingTeacher) {
        return res.status(409).json({
          success: false,
          message: 'A teacher with this Teacher ID already exists.'
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be student or teacher.'
      });
    }

    // 7. Create User document (password is hashed automatically by User pre-save hook)
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      phone: phone ? phone.trim() : ''
    });

    let profileRecord = null;

    if (role === 'student') {
      const sId = studentId ? studentId.trim() : `STU${Date.now().toString().slice(-4)}`;
      profileRecord = await Student.create({
        userId: user._id,
        studentId: sId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: department || 'Computer Science',
        year: year ? String(year) : '1',
        semester: semester ? String(semester) : '1',
        dateOfBirth: dateOfBirth || '',
        gender: gender || 'Not Specified',
        address: address || '',
        guardianName: guardianName || '',
        guardianPhone: guardianPhone || ''
      });
    } else if (role === 'teacher') {
      const tId = teacherId ? teacherId.trim() : `TEA${Date.now().toString().slice(-4)}`;
      profileRecord = await Teacher.create({
        userId: user._id,
        teacherId: tId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: department || 'Computer Science',
        subject: subject || 'Computer Science',
        qualification: qualification || 'Post Graduate',
        experience: experience ? `${experience} Years` : '1 Year'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! You can now login.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: profileRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get JWT token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with this email.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Password does not match.'
      });
    }

    let profileRecord = null;
    if (user.role === 'student') {
      profileRecord = await Student.findOne({ userId: user._id });
    } else if (user.role === 'teacher') {
      profileRecord = await Teacher.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile: profileRecord
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user & profile
// @route   GET /api/auth/me or /api/auth/profile
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    let profile = null;

    if (user.role === 'student') {
      profile = await Student.findOne({ userId: user._id });
    } else if (user.role === 'teacher') {
      profile = await Teacher.findOne({ userId: user._id });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Auth health check
// @route   GET /api/auth/health
// @access  Public
exports.health = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth service operational'
  });
};

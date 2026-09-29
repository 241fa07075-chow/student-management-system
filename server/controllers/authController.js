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
    const { name, email, password, role, phone, department, studentId, teacherId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, password, and role'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || ''
    });

    let profileRecord = null;

    if (role === 'student') {
      profileRecord = await Student.create({
        userId: user._id,
        studentId: studentId || `STU${Date.now().toString().slice(-4)}`,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: department || 'Computer Science'
      });
    } else if (role === 'teacher') {
      profileRecord = await Teacher.create({
        userId: user._id,
        teacherId: teacherId || `TEA${Date.now().toString().slice(-4)}`,
        name: user.name,
        email: user.email,
        phone: user.phone,
        department: department || 'Computer Science'
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
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

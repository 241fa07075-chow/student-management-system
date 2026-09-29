const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    studentId: {
      type: String,
      required: [true, 'Please provide a unique student ID'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      required: [true, 'Please provide department'],
      trim: true
    },
    year: {
      type: String,
      default: '3'
    },
    semester: {
      type: String,
      default: '5'
    },
    dateOfBirth: {
      type: String,
      default: ''
    },
    gender: {
      type: String,
      default: 'Not Specified'
    },
    address: {
      type: String,
      default: ''
    },
    guardianName: {
      type: String,
      default: ''
    },
    guardianPhone: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }
    ],
    status: {
      type: String,
      enum: ['Active', 'Warning', 'Inactive'],
      default: 'Active'
    },
    rollNo: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);

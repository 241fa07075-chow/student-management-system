const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    teacherId: {
      type: String,
      required: [true, 'Please provide teacher ID'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Please provide teacher name'],
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
    subject: {
      type: String,
      default: 'Computer Science'
    },
    qualification: {
      type: String,
      default: 'Ph.D. in Computer Science'
    },
    experience: {
      type: String,
      default: '12 Years'
    },
    designation: {
      type: String,
      default: 'Associate Professor & HOD'
    },
    cabin: {
      type: String,
      default: 'Block C, Room 304'
    },
    officeHours: {
      type: String,
      default: 'Mon, Wed & Fri: 3:00 PM - 5:00 PM'
    },
    specialization: {
      type: String,
      default: 'Database Systems, Distributed Computing, Cloud Architectures'
    },
    profileImage: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);

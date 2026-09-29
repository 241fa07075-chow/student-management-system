const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: [true, 'Student reference is required']
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course reference is required']
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    date: {
      type: String, // YYYY-MM-DD format
      required: [true, 'Attendance date is required']
    },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent'],
        message: 'Status must be either present or absent'
      },
      lowercase: true,
      required: [true, 'Attendance status is required']
    },
    time: {
      type: String,
      default: '10:00 AM'
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate attendance for the same student, course, and date
attendanceSchema.index({ studentId: 1, courseId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);

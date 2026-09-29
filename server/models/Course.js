const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: [true, 'Please provide course code'],
      unique: true,
      trim: true,
      uppercase: true
    },
    courseName: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    credits: {
      type: Number,
      required: true,
      default: 4
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    instructorName: {
      type: String,
      default: ''
    },
    department: {
      type: String,
      default: 'Computer Science'
    },
    semester: {
      type: String,
      default: '5'
    },
    batch: {
      type: String,
      default: 'CSE 3rd Year (Sec A)'
    },
    schedule: {
      type: String,
      default: ''
    },
    room: {
      type: String,
      default: ''
    },
    syllabus: {
      type: String,
      default: ''
    },
    progress: {
      type: Number,
      default: 80
    },
    color: {
      type: String,
      default: '#2563eb'
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', courseSchema);

const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    courseCode: {
      type: String,
      required: true
    },
    courseName: {
      type: String,
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Teacher'
    },
    instructorName: {
      type: String,
      default: ''
    },
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    },
    type: {
      type: String,
      default: 'Lecture'
    },
    semester: {
      type: String,
      default: '5'
    },
    batch: {
      type: String,
      default: 'CSE Section A'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Timetable', timetableSchema);

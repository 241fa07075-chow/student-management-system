const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide assignment title'],
      trim: true
    },
    description: {
      type: String,
      default: ''
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
    dueDate: {
      type: String,
      required: [true, 'Due date is required']
    },
    maxMarks: {
      type: Number,
      default: 20
    },
    status: {
      type: String,
      enum: ['Active', 'Completed'],
      default: 'Active'
    },
    priority: {
      type: String,
      default: 'Medium'
    },
    attachments: {
      type: String,
      default: ''
    },
    submissions: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Student'
        },
        studentName: String,
        rollNo: String,
        submittedAt: {
          type: Date,
          default: Date.now
        },
        notes: String,
        fileName: String,
        obtainedMarks: Number,
        feedback: String,
        isGraded: {
          type: Boolean,
          default: false
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);

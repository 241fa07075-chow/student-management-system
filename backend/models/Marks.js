const mongoose = require('mongoose');

const calculateGrade = (total) => {
  if (total >= 90) return 'A+';
  if (total >= 80) return 'A';
  if (total >= 70) return 'B+';
  if (total >= 60) return 'B';
  if (total >= 50) return 'C';
  if (total >= 40) return 'D';
  return 'F';
};

const marksSchema = new mongoose.Schema(
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
    assignmentMarks: {
      type: Number,
      default: 0,
      min: [0, 'Assignment marks cannot be negative'],
      max: [20, 'Assignment marks cannot exceed 20']
    },
    internalMarks: {
      type: Number,
      default: 0,
      min: [0, 'Internal marks cannot be negative'],
      max: [30, 'Internal marks cannot exceed 30']
    },
    examMarks: {
      type: Number,
      default: 0,
      min: [0, 'Exam marks cannot be negative'],
      max: [50, 'Exam marks cannot exceed 50']
    },
    totalMarks: {
      type: Number,
      default: 0
    },
    grade: {
      type: String,
      default: 'F'
    },
    gradePoint: {
      type: Number,
      default: 0
    },
    semester: {
      type: String,
      default: '5'
    }
  },
  {
    timestamps: true
  }
);

// Auto-calculate totalMarks and grade before validation & save
marksSchema.pre('validate', function (next) {
  const asn = Number(this.assignmentMarks) || 0;
  const int = Number(this.internalMarks) || 0;
  const exam = Number(this.examMarks) || 0;
  this.totalMarks = asn + int + exam;
  this.grade = calculateGrade(this.totalMarks);

  if (this.grade === 'A+') this.gradePoint = 10.0;
  else if (this.grade === 'A') this.gradePoint = 9.0;
  else if (this.grade === 'B+') this.gradePoint = 8.0;
  else if (this.grade === 'B') this.gradePoint = 7.0;
  else if (this.grade === 'C') this.gradePoint = 6.0;
  else if (this.grade === 'D') this.gradePoint = 5.0;
  else this.gradePoint = 0.0;

  next();
});

marksSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

module.exports = mongoose.model('Marks', marksSchema);
module.exports.calculateGrade = calculateGrade;

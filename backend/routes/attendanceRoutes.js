const express = require('express');
const router = express.Router();
const {
  getStudentAttendance,
  getMyAttendance,
  getCourseRosterAttendance,
  saveAttendance,
  getTeacherAttendanceSummary
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/me', authorizeRoles('student'), getMyAttendance);
router.get('/my-summary', authorizeRoles('student'), getMyAttendance);
router.get('/roster', authorizeRoles('teacher'), getCourseRosterAttendance);
router.get('/summary', authorizeRoles('teacher'), getTeacherAttendanceSummary);
router.get('/student/:studentId', getStudentAttendance);
router.post('/', authorizeRoles('teacher'), saveAttendance);

module.exports = router;

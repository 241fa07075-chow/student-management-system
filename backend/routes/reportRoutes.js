const express = require('express');
const router = express.Router();
const {
  getStudentDashboard,
  getTeacherDashboard,
  getStudentReport,
  getTeacherReport
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/student/dashboard', authorizeRoles('student'), getStudentDashboard);
router.get('/teacher/dashboard', authorizeRoles('teacher'), getTeacherDashboard);
router.get('/student/:studentId', getStudentReport);
router.get('/teacher', authorizeRoles('teacher'), getTeacherReport);

module.exports = router;

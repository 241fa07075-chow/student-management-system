const express = require('express');
const router = express.Router();
const {
  getStudentMarks,
  getMyMarks,
  getTeacherMarksRoster,
  saveMarks,
  updateMarkById
} = require('../controllers/marksController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/me', authorizeRoles('student'), getMyMarks);
router.get('/roster', authorizeRoles('teacher'), getTeacherMarksRoster);
router.get('/student/:studentId', getStudentMarks);
router.post('/', authorizeRoles('teacher'), saveMarks);
router.put('/:id', authorizeRoles('teacher'), updateMarkById);

module.exports = router;

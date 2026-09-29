const express = require('express');
const router = express.Router();
const {
  getStudents,
  getStudentById,
  getMyStudentProfile,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/profile/me', authorizeRoles('student'), getMyStudentProfile);
router.get('/', authorizeRoles('teacher'), getStudents);
router.get('/:id', getStudentById);
router.post('/', authorizeRoles('teacher'), createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', authorizeRoles('teacher'), deleteStudent);

module.exports = router;

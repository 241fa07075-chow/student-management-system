const express = require('express');
const router = express.Router();
const {
  getTeachers,
  getTeacherById,
  getMyTeacherProfile,
  createTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/profile/me', authorizeRoles('teacher'), getMyTeacherProfile);
router.get('/', getTeachers);
router.get('/:id', getTeacherById);
router.post('/', authorizeRoles('teacher'), createTeacher);
router.put('/:id', authorizeRoles('teacher'), updateTeacher);
router.delete('/:id', authorizeRoles('teacher'), deleteTeacher);

module.exports = router;

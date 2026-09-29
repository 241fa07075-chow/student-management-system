const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse
} = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authorizeRoles('teacher'), createCourse);
router.put('/:id', authorizeRoles('teacher'), updateCourse);
router.delete('/:id', authorizeRoles('teacher'), deleteCourse);
router.post('/:id/enroll', authorizeRoles('student'), enrollCourse);
router.post('/:id/unenroll', authorizeRoles('student'), unenrollCourse);

module.exports = router;

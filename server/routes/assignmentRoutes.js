const express = require('express');
const router = express.Router();
const {
  getAssignments,
  getAssignmentById,
  createAssignment,
  submitAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getAssignments);
router.get('/:id', getAssignmentById);
router.post('/', authorizeRoles('teacher'), createAssignment);
router.post('/:id/submit', authorizeRoles('student'), submitAssignment);
router.put('/:id', authorizeRoles('teacher'), updateAssignment);
router.delete('/:id', authorizeRoles('teacher'), deleteAssignment);

module.exports = router;

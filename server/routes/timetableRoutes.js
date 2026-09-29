const express = require('express');
const router = express.Router();
const {
  getTimetable,
  createTimetableEntry,
  updateTimetableEntry,
  deleteTimetableEntry
} = require('../controllers/timetableController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(protect);

router.get('/', getTimetable);
router.post('/', authorizeRoles('teacher'), createTimetableEntry);
router.put('/:id', authorizeRoles('teacher'), updateTimetableEntry);
router.delete('/:id', authorizeRoles('teacher'), deleteTimetableEntry);

module.exports = router;

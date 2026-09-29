const Timetable = require('../models/Timetable');

// @desc    Get timetable (today + weekly)
// @route   GET /api/timetable
// @access  Private
exports.getTimetable = async (req, res, next) => {
  try {
    const list = await Timetable.find().sort({ startTime: 1 });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday, etc.
    const todayName = (currentDayIndex >= 1 && currentDayIndex <= 5) ? days[currentDayIndex - 1] : 'Monday';

    const weekly = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: []
    };

    list.forEach(t => {
      if (weekly[t.day]) {
        weekly[t.day].push({
          id: t._id,
          time: `${t.startTime} - ${t.endTime}`,
          code: t.courseCode,
          subject: t.courseName,
          teacher: t.instructorName || 'Faculty Member',
          instructor: t.instructorName || 'Faculty Member',
          room: t.room,
          type: t.type || 'Lecture',
          batch: t.batch,
          status: 'Upcoming'
        });
      }
    });

    const todayClasses = (weekly[todayName] || []).map((c, i) => ({
      ...c,
      status: i === 0 ? 'Completed' : (i === 1 ? 'In Progress' : 'Upcoming')
    }));

    res.status(200).json({
      success: true,
      data: {
        today: todayName,
        todayClasses,
        weekly
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add timetable entry
// @route   POST /api/timetable
// @access  Private (Teacher)
exports.createTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.create(req.body);
    res.status(201).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Update timetable entry
// @route   PUT /api/timetable/:id
// @access  Private (Teacher)
exports.updateTimetableEntry = async (req, res, next) => {
  try {
    const entry = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: entry });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete timetable entry
// @route   DELETE /api/timetable/:id
// @access  Private (Teacher)
exports.deleteTimetableEntry = async (req, res, next) => {
  try {
    await Timetable.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Schedule entry removed' });
  } catch (error) {
    next(error);
  }
};

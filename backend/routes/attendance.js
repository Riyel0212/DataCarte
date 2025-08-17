const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');
const mongoose = require('mongoose');

// Helper function to normalize date to midnight UTC
function normalizeToMidnightUTC(date) {
  const d = new Date(date);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}

// Get attendance for a student with optional period filter
router.get('/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period } = req.query;
    const user = await User.findById(req.user.id);

    // Authorization checks
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'parent' && !user.linkedStudents.some(id => id.equals(studentId))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Calculate date range with normalized start and end dates (midnight UTC)
    let startDate = new Date(0);
    const today = normalizeToMidnightUTC(new Date());

    if (period === 'currentWeek') {
      const day = today.getUTCDay() || 7;
      startDate = new Date(today);
      startDate.setUTCDate(today.getUTCDate() - day + 1);
    } else if (period === 'lastWeek') {
      const day = today.getUTCDay() || 7;
      startDate = new Date(today);
      startDate.setUTCDate(today.getUTCDate() - day - 6);
    } else if (period === 'lastMonth') {
      startDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));
    }

    const attendance = await Attendance.find({
      student: studentId,
      date: { $gte: startDate, $lte: today },
    }).sort({ date: 1 });

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create attendance (POST) - teacher only
router.post('/:studentId', auth, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, status } = req.body;

    const normalizedDate = normalizeToMidnightUTC(date);

    // Check if attendance exists for student+date
    const existing = await Attendance.findOne({ student: studentId, date: normalizedDate });
    if (existing) return res.status(400).json({ message: 'Attendance already exists for this date' });

    const attendance = new Attendance({ student: studentId, date: normalizedDate, status });
    await attendance.save();

    res.status(201).json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update attendance (PUT) - teacher only
router.put('/:studentId', auth, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, status } = req.body;

    const normalizedDate = normalizeToMidnightUTC(date);

    let attendance = await Attendance.findOne({ student: studentId, date: normalizedDate });
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });

    attendance.status = status;
    await attendance.save();

    res.json(attendance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

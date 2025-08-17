const express = require('express');
const router = express.Router();
const StudentRecord = require('../models/StudentRecord');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get student records
router.get('/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(401).json({ message: 'User not found' });

    // Authorization
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'parent' && !user.linkedStudents.some(id => id.equals(studentId))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    let record = await StudentRecord.findOne({ student: studentId });
    if (!record) {
      record = new StudentRecord({ student: studentId, activities: [] });
      await record.save();
    }

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create student record (POST) - teacher only (if needed)
router.post('/:studentId', auth, authorizeRoles('teacher'), async (req, res) => {
  try {
    const { studentId } = req.params;

    let record = await StudentRecord.findOne({ student: studentId });
    if (record) return res.status(400).json({ message: 'Student record already exists' });

    const newRecord = new StudentRecord({ student: studentId, activities: [] });
    await newRecord.save();

    res.status(201).json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student activities (PUT) - teacher only
router.put('/:studentId', auth, authorizeRoles('teacher'), 
  body('activities').isArray(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { studentId } = req.params;
    const { activities } = req.body;

    let record = await StudentRecord.findOne({ student: studentId });
    if (!record) return res.status(404).json({ message: 'Student record not found' });

    // Replace or update activities
    record.activities = activities;
    await record.save();

    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

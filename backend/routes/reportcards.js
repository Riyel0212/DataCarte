const express = require('express');
const router = express.Router();
const ReportCard = require('../models/ReportCard');
const User = require('../models/User');
const { auth, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Get report cards for a student
router.get('/:studentId', auth, async (req, res) => {
  try {
    const { studentId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Authorization checks
    if (req.user.role === 'student' && req.user.id !== studentId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'parent' && !user.linkedStudents.some(id => id.equals(studentId))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const reportCards = await ReportCard.find({ student: studentId }).sort({ updatedAt: -1 });
    res.json(reportCards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create report card (POST) - teacher only
router.post('/:studentId', auth, authorizeRoles('teacher'),
  body('term').notEmpty(),
  body('grades').isArray(),
  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { studentId } = req.params;
    const { term, grades, comments } = req.body;

    // Check if report card for term already exists
    const existing = await ReportCard.findOne({ student: studentId, term });
    if (existing) return res.status(400).json({ message: 'Report card for this term already exists' });

    const reportCard = new ReportCard({ student: studentId, term, grades, comments });
    await reportCard.save();

    res.status(201).json(reportCard);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update report card (PUT) - teacher only
router.put('/:studentId', auth, authorizeRoles('teacher'),
  body('term').notEmpty(),
  body('grades').isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { studentId } = req.params;
      const { term, grades, comments } = req.body;

      let reportCard = await ReportCard.findOne({ student: studentId, term });
      if (!reportCard) return res.status(404).json({ message: 'Report card not found' });

      reportCard.grades = grades;
      reportCard.comments = comments;
      reportCard.updatedAt = new Date();

      await reportCard.save();
      res.json(reportCard);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;

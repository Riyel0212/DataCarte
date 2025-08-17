const mongoose = require('mongoose');

const reportCardSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  term: { type: String, required: true },
  grades: [{
    subject: String,
    grade: String,
  }],
  comments: String,
  updatedAt: { type: Date, default: Date.now },
});

// Unique per student per term
reportCardSchema.index({ student: 1, term: 1 }, { unique: true });

module.exports = mongoose.model('ReportCard', reportCardSchema);

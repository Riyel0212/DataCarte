const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
  },
  remarks: {
    type: String,
    trim: true,
    default: '',
  },
});

const StudentRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Your User model
      required: true,
      unique: true,
      // Removed 'index: true' to avoid duplicate index warning
    },
    activities: {
      type: [ActivitySchema],
      default: [],
    },
  },
  { timestamps: true }
);

// Define the unique index here only (remove inline index from above)
StudentRecordSchema.index({ student: 1 }, { unique: true });

const StudentRecord = mongoose.model('StudentRecord', StudentRecordSchema);

module.exports = StudentRecord;

const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  condition: {
    type: String,
    required: true,
    enum: ['loadTime', 'firstContentfulPaint', 'largestContentfulPaint', 'errorCount']
  },
  threshold: {
    type: Number,
    required: true
  },
  timeframe: {
    type: Number,
    required: true,
    default: 5
  },
  email: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastTriggered: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
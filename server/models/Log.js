const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  apiKey: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  pageUrl: {
    type: String,
    required: true
  },
  userAgent: String,
  browser: String,
  os: String,
  deviceType: String,
  performanceMetrics: {
    loadTime: Number,
    firstContentfulPaint: Number,
    largestContentfulPaint: Number,
    firstInputDelay: Number,
    timeToFirstByte: Number,
    domContentLoaded: Number
  },
  errorLogs: [{
    message: String,
    source: String,
    lineno: Number,
    colno: Number,
    stack: String,
    timestamp: Date
  }]
});

// Index for faster querying
logSchema.index({ userId: 1, timestamp: -1 });
logSchema.index({ apiKey: 1, timestamp: -1 });

module.exports = mongoose.model('Log', logSchema);
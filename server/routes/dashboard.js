const express = require('express');
const auth = require('../middleware/auth');
const Log = require('../models/Log');

const router = express.Router();

// Get dashboard data
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, pageUrl, browser } = req.query;
    
    // Build filter object
    const filter = { userId: req.user._id };
    
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }
    
    if (pageUrl) filter.pageUrl = new RegExp(pageUrl, 'i');
    if (browser) filter.browser = browser;
    
    // Get logs with filters
    const logs = await Log.find(filter)
      .sort({ timestamp: -1 })
      .limit(1000);
    
    // Calculate performance metrics averages
    const performanceData = {
      loadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      timeToFirstByte: 0,
      domContentLoaded: 0
    };
    
    let performanceCount = 0;
    
    logs.forEach(log => {
      if (log.performanceMetrics) {
        Object.keys(performanceData).forEach(key => {
          if (log.performanceMetrics[key]) {
            performanceData[key] += log.performanceMetrics[key];
          }
        });
        performanceCount++;
      }
    });
    
    if (performanceCount > 0) {
      Object.keys(performanceData).forEach(key => {
        performanceData[key] = performanceData[key] / performanceCount;
      });
    }
    
    // Count errors by type
    const errorCounts = {};
    logs.forEach(log => {
      if (log.errorLogs && log.errorLogs.length > 0) {
        log.errorLogs.forEach(error => {
          const errorType = error.message.split(':')[0]; // Simple error type extraction
          errorCounts[errorType] = (errorCounts[errorType] || 0) + 1;
        });
      }
    });
    
    // Get recent errors
    const recentErrors = logs
      .filter(log => log.errorLogs && log.errorLogs.length > 0)
      .flatMap(log => 
        log.errorLogs.map(error => ({
          ...error.toObject?.(),
          pageUrl: log.pageUrl,
          timestamp: error.timestamp || log.timestamp
        }))
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 50);
    
    res.json({
      performanceData,
      errorCounts,
      recentErrors,
      totalLogs: logs.length,
      totalErrors: recentErrors.length
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
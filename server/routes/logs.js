
const express = require('express');
const apiKeyAuth = require('../middleware/apiKeyAuth');
const Log = require('../models/Log');
const { checkAlerts } = require('../utils/alertChecker');

const router = express.Router();

// Receive logs from SDK
router.post('/', apiKeyAuth, async (req, res) => {
  try {
    const { pageUrl, performanceMetrics, errorLogs, userAgent, customEvent } = req.body;
    
    // Parse user agent for additional info
    let browser = 'Unknown';
    let os = 'Unknown';
    let deviceType = 'Desktop';
    
    if (userAgent) {
      // Simple user agent parsing (in production, use a library like ua-parser-js)
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS')) os = 'iOS';
      
      if (userAgent.includes('Mobile')) deviceType = 'Mobile';
      else if (userAgent.includes('Tablet')) deviceType = 'Tablet';
    }
    
    // Safely process errorLogs - handle undefined or null
    const processedErrorLogs = errorLogs ? errorLogs.map(error => ({
      ...error,
      timestamp: new Date(error.timestamp || Date.now())
    })) : [];
    
    // Determine log type based on what data is present
    let logType = 'unknown';
    if (errorLogs && errorLogs.length > 0) {
      logType = 'error';
    } else if (performanceMetrics) {
      logType = 'performance';
    } else if (customEvent) {
      logType = 'custom';
    }
    
    // Create log entry
    const log = new Log({
      userId: req.user._id,
      apiKey: req.user.apiKey,
      pageUrl,
      userAgent,
      browser,
      os,
      deviceType,
      performanceMetrics: performanceMetrics || null,
      errorLogs: processedErrorLogs,
      customEvent: customEvent || null,
      logType,
      timestamp: new Date()
    });
    
    await log.save();
    
    // Check if this log triggers any alerts
    setTimeout(() => checkAlerts(), 1000); // Run async without blocking response
    
    res.status(201).json({ 
      message: 'Log received successfully',
      logType,
      id: log._id 
    });
    
  } catch (error) {
    console.error('Error saving log:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Optional: Add a health check endpoint for testing
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Logs endpoint is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
// const express = require('express');
// const apiKeyAuth = require('../middleware/apiKeyAuth');
// const Log = require('../models/Log');
// const { checkAlerts } = require('../utils/alertChecker');

// const router = express.Router();

// // Receive logs from SDK
// router.post('/', apiKeyAuth, async (req, res) => {
//   try {
//     const { pageUrl, performanceMetrics, errorLogs, userAgent } = req.body;
    
//     // Parse user agent for additional info
//     let browser = 'Unknown';
//     let os = 'Unknown';
//     let deviceType = 'Desktop';
    
//     if (userAgent) {
//       // Simple user agent parsing (in production, use a library like ua-parser-js)
//       if (userAgent.includes('Chrome')) browser = 'Chrome';
//       else if (userAgent.includes('Firefox')) browser = 'Firefox';
//       else if (userAgent.includes('Safari')) browser = 'Safari';
//       else if (userAgent.includes('Edge')) browser = 'Edge';
      
//       if (userAgent.includes('Windows')) os = 'Windows';
//       else if (userAgent.includes('Mac')) os = 'macOS';
//       else if (userAgent.includes('Linux')) os = 'Linux';
//       else if (userAgent.includes('Android')) os = 'Android';
//       else if (userAgent.includes('iOS')) os = 'iOS';
      
//       if (userAgent.includes('Mobile')) deviceType = 'Mobile';
//       else if (userAgent.includes('Tablet')) deviceType = 'Tablet';
//     }
    
//     // Create log entry
//     const log = new Log({
//       userId: req.user._id,
//       apiKey: req.user.apiKey,
//       pageUrl,
//       userAgent,
//       browser,
//       os,
//       deviceType,
//       performanceMetrics,
//       errorLogs: errorLogs.map(error => ({
//         ...error,
//         timestamp: new Date(error.timestamp || Date.now())
//       }))
//     });
    
//     await log.save();
    
//     // Check if this log triggers any alerts
//     setTimeout(checkAlerts, 1000); // Run async without blocking response
    
//     res.status(201).json({ message: 'Log received' });
//   } catch (error) {
//     console.error('Error saving log:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;
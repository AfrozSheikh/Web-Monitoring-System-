const Log = require('../models/Log');
const Alert = require('../models/Alert');
const { sendAlertEmail } = require('./emailService');

const checkAlerts = async () => {
  try {
    const alerts = await Alert.find({ active: true });
    const now = new Date();
    
    for (const alert of alerts) {
      const timeframe = new Date(now.getTime() - alert.timeframe * 60000);
      
      let conditionMet = false;
      
      if (alert.condition === 'errorCount') {
        const errorCount = await Log.countDocuments({
          userId: alert.userId,
          timestamp: { $gte: timeframe },
          'errorLogs.0': { $exists: true }
        });
        
        conditionMet = errorCount >= alert.threshold;
      } else {
        const logs = await Log.find({
          userId: alert.userId,
          timestamp: { $gte: timeframe },
          [`performanceMetrics.${alert.condition}`]: { $exists: true }
        });
        
        const avgValue = logs.reduce((sum, log) => 
          sum + log.performanceMetrics[alert.condition], 0) / (logs.length || 1);
        
        conditionMet = avgValue >= alert.threshold;
      }
      
      // Check if we should trigger the alert (avoid spamming)
      const shouldTrigger = conditionMet && 
        (!alert.lastTriggered || 
         (now - alert.lastTriggered) > alert.timeframe * 60000);
      
      if (shouldTrigger) {
        await sendAlertEmail(
          alert.email,
          `Web Monitoring Alert: ${alert.name}`,
          `Alert condition "${alert.condition}" exceeded threshold of ${alert.threshold} in the last ${alert.timeframe} minutes.`
        );
        
        alert.lastTriggered = now;
        await alert.save();
      }
    }
  } catch (error) {
    console.error('Error checking alerts:', error);
  }
};

module.exports = { checkAlerts };